import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    const value = trimmed.slice(idx + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TERM = "Fall 2026";
const START = new Date("2026-01-01T12:00:00");
const END = new Date("2026-06-05T12:00:00");
const TIME_SLOTS = [
  { start: "09:00", end: "10:30", room: "Room 105" },
  { start: "11:00", end: "12:30", room: "Lab 204" },
  { start: "14:00", end: "15:30", room: "Room 302" },
];

function seededRandom(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function isWeekday(d) {
  const day = d.getDay();
  return day >= 1 && day <= 5;
}

console.log(`Seeding ${TERM} class sessions (${formatDate(START)} to ${formatDate(END)})...`);

const { data: courses, error: courseError } = await supabase.from("courses").select("id, name");
if (courseError) throw courseError;

const { data: enrollments, error: enrollError } = await supabase
  .from("enrollments")
  .select("id, student_id, course_id")
  .eq("semester", "Spring 2026");
if (enrollError) throw enrollError;

const { data: existingSessions } = await supabase.from("class_sessions").select("id").eq("term", TERM);
if (existingSessions?.length) {
  await supabase
    .from("session_attendance")
    .delete()
    .in(
      "session_id",
      existingSessions.map((s) => s.id),
    );
}
await supabase.from("class_sessions").delete().eq("term", TERM);

const sessionsByCourse = new Map();
let sessionInsertErrors = 0;

for (const course of courses ?? []) {
  const rng = seededRandom(`course-${course.id}`);
  const sessions = [];

  for (let d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
    if (!isWeekday(d)) continue;
    if (rng() > 0.42) continue;

    const slot = TIME_SLOTS[Math.floor(rng() * TIME_SLOTS.length)];
    sessions.push({
      course_id: course.id,
      session_date: formatDate(d),
      start_time: slot.start,
      end_time: slot.end,
      room: slot.room,
      term: TERM,
    });
  }

  if (sessions.length === 0) continue;

  const { data: inserted, error } = await supabase
    .from("class_sessions")
    .upsert(sessions, { onConflict: "course_id,session_date,start_time" })
    .select("id, course_id, session_date, start_time");

  if (error) {
    console.error(`Sessions for ${course.id}:`, error.message);
    sessionInsertErrors += 1;
    continue;
  }

  sessionsByCourse.set(course.id, inserted ?? []);
  console.log(`  ${course.id}: ${inserted?.length ?? 0} sessions`);
}

const attendanceRows = [];

if (sessionsByCourse.size === 0) {
  console.error(
    "\nNo class sessions were created. Run `npm run db:push` first, then retry.",
    sessionInsertErrors ? `(${sessionInsertErrors} course insert errors)` : "",
  );
  console.error("Or paste supabase/seed-fall-attendance.sql in the Supabase SQL Editor.");
  process.exit(1);
}

for (const enrollment of enrollments ?? []) {
  const sessions = sessionsByCourse.get(enrollment.course_id) ?? [];
  if (sessions.length === 0) continue;

  const rng = seededRandom(`${enrollment.student_id}-${enrollment.course_id}`);
  const targetPct = 20 + Math.floor(rng() * 81);
  let attendCount = Math.round((sessions.length * targetPct) / 100);
  attendCount = Math.max(1, Math.min(sessions.length, attendCount));

  const shuffled = [...sessions].sort(() => rng() - 0.5);
  const presentIds = new Set(shuffled.slice(0, attendCount).map((s) => s.id));

  for (const session of sessions) {
    attendanceRows.push({
      enrollment_id: enrollment.id,
      session_id: session.id,
      present: presentIds.has(session.id),
    });
  }
}

for (let i = 0; i < attendanceRows.length; i += 500) {
  const chunk = attendanceRows.slice(i, i + 500);
  const { error } = await supabase
    .from("session_attendance")
    .upsert(chunk, { onConflict: "enrollment_id,session_id" });
  if (error) throw error;
}

console.log(`\nDone: ${attendanceRows.length} session attendance marks (min 20%, no 0% courses).`);
console.log("Run npm run seed:attendance after db:push to regenerate.");
