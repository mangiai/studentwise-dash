import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { seedDemoData, seedNotificationsForUser } from "./seed-demo-data.mjs";

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

const TEST_PASSWORD = "StudentWise123!";

const users = [
  {
    email: "admin@studentwise.test",
    fullName: "Portal Admin",
    role: "admin",
    studentId: null,
    teacherId: null,
    notifications: [
      { type: "announcement", title: "Admin: enrollment window", body: "Fall 2026 enrollment opens next Monday.", read: false },
    ],
  },
  {
    email: "moderator@studentwise.test",
    fullName: "Portal Moderator",
    role: "moderator",
    studentId: null,
    teacherId: null,
    notifications: [],
  },
  {
    email: "sarah@studentwise.test",
    fullName: "Sarah Ahmed",
    role: "student",
    studentId: "2026-BSCS-0042",
    teacherId: null,
    notifications: [
      { type: "fee", title: "Fee payment reminder", body: "Fall 2026 installment is due by Sep 15, 2026.", read: false },
      { type: "attendance", title: "Short attendance alert", body: "Operating Systems attendance is below 75%.", read: false },
      { type: "course", title: "New assignment posted", body: "Software Engineering — Project milestone 2 is now live.", read: true },
      { type: "announcement", title: "Spring break schedule", body: "Campus will be closed March 20–27 for spring break.", read: true },
    ],
  },
  {
    email: "hassan@studentwise.test",
    fullName: "Hassan Raza",
    role: "student",
    studentId: "2026-BSCS-0043",
    teacherId: null,
    notifications: [
      { type: "fee", title: "Pending fee notice", body: "Spring 2026 second installment is pending.", read: false },
    ],
  },
  {
    email: "teacher@studentwise.test",
    fullName: "Dr. Aamir Khan",
    role: "teacher",
    studentId: null,
    teacherId: "FAC-2018-014",
    notifications: [],
  },
  {
    email: "maryam@studentwise.test",
    fullName: "Maryam Khan",
    role: "student",
    studentId: "2025-BSEE-0118",
    teacherId: null,
    notifications: [],
  },
];

await seedDemoData(supabase);

console.log("Creating StudentWise test users...\n");

const userIds = {};

for (const user of users) {
  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === user.email);

  let userId = found?.id;

  if (found) {
    console.log(`• ${user.email} already exists — updating profile links`);
    await supabase.auth.admin.updateUserById(found.id, {
      password: TEST_PASSWORD,
      app_metadata: { role: user.role },
      user_metadata: { full_name: user.fullName },
    });
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      app_metadata: { role: user.role },
      user_metadata: { full_name: user.fullName },
    });

    if (error) {
      console.error(`✗ ${user.email}: ${error.message}`);
      continue;
    }

    userId = data.user.id;
    console.log(`✓ Created ${user.email}`);
  }

  if (!userId) continue;
  userIds[user.email] = userId;

  await supabase.from("profiles").upsert({
    id: userId,
    full_name: user.fullName,
    role: user.role,
  });

  if (user.studentId) {
    const { error } = await supabase
      .from("students")
      .update({ user_id: userId, name: user.fullName })
      .eq("id", user.studentId);
    if (error) console.error(`  ✗ Link student ${user.studentId}: ${error.message}`);
    else console.log(`  ✓ Linked ${user.email} → student ${user.studentId}`);
  }

  if (user.teacherId) {
    const { error } = await supabase
      .from("teachers")
      .update({ user_id: userId, name: user.fullName })
      .eq("id", user.teacherId);
    if (error) console.error(`  ✗ Link teacher ${user.teacherId}: ${error.message}`);
    else console.log(`  ✓ Linked ${user.email} → teacher ${user.teacherId}`);
  }

  if (user.notifications.length > 0) {
    await seedNotificationsForUser(supabase, userId, user.notifications);
  }
}

console.log("\nDone! All test users use password:", TEST_PASSWORD);
console.log("\nLogin emails:");
for (const user of users) {
  console.log(`  ${user.email} (${user.role})`);
}
