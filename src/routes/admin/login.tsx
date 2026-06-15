import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Lock, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { APP_COPYRIGHT, APP_NAME } from "@/lib/brand";
import { requireStaffGuest } from "@/lib/auth-guards";
import { pageHead } from "@/lib/seo";
import { signIn } from "@/lib/supabase/auth";
import { AmbientOrbs } from "@/components/motion";

export const Route = createFileRoute("/admin/login")({
  head: () => pageHead("Admin Sign In"),
  beforeLoad: ({ context }) => {
    requireStaffGuest(context.authUser);
  },
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    setLoading(true);
    try {
      await signIn({ data: { email: email.trim(), password } });
      toast.success("Welcome to the staff portal!");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative flex-col justify-between p-12 gradient-mesh-auth text-sidebar-foreground overflow-hidden">
        <AmbientOrbs />
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_30%,white_0,transparent_40%),radial-gradient(circle_at_80%_70%,white_0,transparent_40%)]" />
        <div className="relative flex items-center gap-3 animate-fade-in-up">
          <div className="size-10 rounded-xl bg-sidebar-primary grid place-content-center text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="font-bold text-lg">{APP_NAME}</div>
            <div className="text-xs opacity-70">Staff Portal</div>
          </div>
        </div>

        <div className="relative space-y-6 max-w-md animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <h2 className="text-3xl font-extrabold leading-tight">
            Secure staff access for university administrators and moderators.
          </h2>
          <p className="text-sm opacity-80">
            Manage students, teachers, courses, fees, and institutional records from one dashboard.
          </p>
          <div className="grid gap-3 pt-4">
            {[
              { i: Users, t: "Student & faculty management" },
              { i: BarChart3, t: "Reports and analytics" },
              { i: Lock, t: "Role-based secure access" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="auth-feature-row flex items-center gap-3 text-sm">
                <div className="size-8 rounded-md bg-sidebar-accent grid place-content-center transition-transform duration-300 hover:scale-110">
                  <Icon className="size-4" />
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs opacity-60">{APP_COPYRIGHT}</div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-auth-panel">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="size-10 rounded-xl gradient-primary grid place-content-center text-primary-foreground shadow-lg shadow-primary/30">
              <ShieldCheck className="size-5" />
            </div>
            <span className="font-bold text-lg">{APP_NAME} Staff</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Staff sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Use your staff credentials to access the admin dashboard.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Staff email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@studentwise.test or moderator@studentwise.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-pwd">Password</Label>
              <Input
                id="admin-pwd"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Signing in..." : "Sign in to Staff Portal"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Student or teacher?{" "}
              <Link to="/login" className="text-accent font-medium hover:underline">
                Portal login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
