import { c as createServerRpc, i as isSupabaseServerConfigured, g as getSupabaseServerClient, a as getSupabaseServiceClient } from "./server-DYh3X2_O.mjs";
import { c as createServerFn } from "./index.mjs";
import "../_libs/supabase__ssr.mjs";
import "../_libs/ws.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "events";
import "https";
import "http";
import "net";
import "tls";
import "url";
import "zlib";
import "buffer";
const signInSchema = objectType({
  email: stringType().email(),
  password: stringType().min(6)
});
const signUpSchema = objectType({
  email: stringType().email(),
  password: stringType().min(8),
  fullName: stringType().min(2),
  studentId: stringType().optional()
});
function resolveUserRole(profileRole, appMetadata) {
  const metaRole = typeof appMetadata?.role === "string" ? appMetadata.role : void 0;
  const fromProfile = profileRole === "admin" || profileRole === "teacher" || profileRole === "student" ? profileRole : void 0;
  if (fromProfile === "admin" || metaRole === "admin") return "admin";
  if (fromProfile === "teacher" || metaRole === "teacher") return "teacher";
  return fromProfile ?? metaRole ?? "student";
}
async function fetchAuthUser() {
  if (!isSupabaseServerConfigured()) return null;
  try {
    const supabase = getSupabaseServerClient();
    const {
      data: {
        user
      },
      error
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    const {
      data: profile
    } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
    const metaFullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : void 0;
    const role = resolveUserRole(profile?.role, user.app_metadata);
    const fullName = profile?.full_name ?? metaFullName ?? user.email ?? "User";
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && (!profile || profile.role !== role || profile.full_name !== fullName)) {
      try {
        await getSupabaseServiceClient().from("profiles").upsert({
          id: user.id,
          full_name: fullName,
          role
        });
      } catch (syncError) {
        console.error("Profile sync failed:", syncError);
      }
    }
    return {
      id: user.id,
      email: user.email ?? "",
      fullName,
      role
    };
  } catch (error) {
    console.error("Auth lookup failed:", error);
    return null;
  }
}
const getAuthUser_createServerFn_handler = createServerRpc({
  id: "f5c567ac5140e43ba5fcdf825b40cb38ba645dfb2a19ba0595a7807515a44f15",
  name: "getAuthUser",
  filename: "src/lib/supabase/auth.ts"
}, (opts) => getAuthUser.__executeServer(opts));
const getAuthUser = createServerFn({
  method: "GET"
}).handler(getAuthUser_createServerFn_handler, async () => fetchAuthUser());
const signIn_createServerFn_handler = createServerRpc({
  id: "4653bac979dc566c839c98a53ac99755bb07c704bcf088b77feb9d57a4da1732",
  name: "signIn",
  filename: "src/lib/supabase/auth.ts"
}, (opts) => signIn.__executeServer(opts));
const signIn = createServerFn({
  method: "POST"
}).validator((data) => signInSchema.parse(data)).handler(signIn_createServerFn_handler, async ({
  data
}) => {
  if (!isSupabaseServerConfigured()) {
    throw new Error("Supabase is not configured. Add env vars to your .env file.");
  }
  const supabase = getSupabaseServerClient();
  const {
    error
  } = await supabase.auth.signInWithPassword(data);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const signUp_createServerFn_handler = createServerRpc({
  id: "d7fcca3fe3ac61831f82c7bdd38595963ad8aa6c56e1503dffd38f5ae092ea5e",
  name: "signUp",
  filename: "src/lib/supabase/auth.ts"
}, (opts) => signUp.__executeServer(opts));
const signUp = createServerFn({
  method: "POST"
}).validator((data) => signUpSchema.parse(data)).handler(signUp_createServerFn_handler, async ({
  data
}) => {
  if (!isSupabaseServerConfigured()) {
    throw new Error("Supabase is not configured. Add env vars to your .env file.");
  }
  const supabase = getSupabaseServerClient();
  const {
    data: authData,
    error
  } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName
      }
    }
  });
  if (error) throw new Error(error.message);
  if (!authData.user) throw new Error("Account could not be created.");
  if (data.studentId?.trim()) {
    const admin = getSupabaseServiceClient();
    const {
      error: linkError
    } = await admin.from("students").update({
      user_id: authData.user.id,
      name: data.fullName
    }).eq("id", data.studentId.trim()).is("user_id", null);
    if (linkError) {
      console.error("Student link failed:", linkError.message);
    }
  }
  return {
    ok: true
  };
});
const signOut_createServerFn_handler = createServerRpc({
  id: "248c5540df6c0e294de2706ca8a47b528b375918427cb544d809d4f7e845c1fe",
  name: "signOut",
  filename: "src/lib/supabase/auth.ts"
}, (opts) => signOut.__executeServer(opts));
const signOut = createServerFn({
  method: "POST"
}).handler(signOut_createServerFn_handler, async () => {
  if (!isSupabaseServerConfigured()) return {
    ok: true
  };
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return {
    ok: true
  };
});
const linkStudentSchema = objectType({
  studentId: stringType().min(1),
  fullName: stringType().min(2)
});
const linkStudentAccount_createServerFn_handler = createServerRpc({
  id: "848dbbe9e3ea97e446d34aaf053c7ed4c1cc74d7b16ee0d41be0232bcee585de",
  name: "linkStudentAccount",
  filename: "src/lib/supabase/auth.ts"
}, (opts) => linkStudentAccount.__executeServer(opts));
const linkStudentAccount = createServerFn({
  method: "POST"
}).validator((data) => linkStudentSchema.parse(data)).handler(linkStudentAccount_createServerFn_handler, async ({
  data
}) => {
  if (!isSupabaseServerConfigured()) {
    throw new Error("Supabase is not configured.");
  }
  const supabase = getSupabaseServerClient();
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in required to link a student record.");
  const admin = getSupabaseServiceClient();
  const {
    error: linkError
  } = await admin.from("students").update({
    user_id: user.id,
    name: data.fullName
  }).eq("id", data.studentId.trim()).is("user_id", null);
  if (linkError) throw new Error(linkError.message);
  return {
    ok: true
  };
});
export {
  getAuthUser_createServerFn_handler,
  linkStudentAccount_createServerFn_handler,
  signIn_createServerFn_handler,
  signOut_createServerFn_handler,
  signUp_createServerFn_handler
};
