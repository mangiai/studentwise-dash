import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, BookOpen, Users, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { APP_COPYRIGHT, APP_NAME, APP_TAGLINE } from "@/lib/brand";
import { requireGuest } from "@/lib/auth-guards";
import { pageHead } from "@/lib/seo";
import { signIn } from "@/lib/supabase/auth";

export const Route = createFileRoute("/login")({
  head: () => pageHead("Sign In"),
  beforeLoad: ({ context }) => {
    requireGuest(context.authUser);
  },
  component: Login,
});

function Login() {
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
      toast.success("Welcome back!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative flex-col justify-between p-12 bg-sidebar text-sidebar-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_30%,white_0,transparent_40%),radial-gradient(circle_at_80%_70%,white_0,transparent_40%)]" />
        <div className="relative flex items-center gap-3">
          <div className="size-10 rounded-xl bg-sidebar-primary grid place-content-center text-sidebar-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <div className="font-semibold text-lg">{APP_NAME}</div>
            <div className="text-xs opacity-70">{APP_TAGLINE}</div>
          </div>
        </div>

        <div className="relative space-y-6 max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            Empowering students, faculty, and admins — all in one place.
          </h2>
          <p className="text-sm opacity-80">
            Track attendance, manage fees, monitor academic progress, and stay connected with your
            university.
          </p>
          <div className="grid gap-3 pt-4">
            {[
              { i: BookOpen, t: "Smart course management" },
              { i: Users, t: "Faculty and student collaboration" },
              { i: ShieldCheck, t: "Secure fee payments & records" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="flex items-center gap-3 text-sm">
                <div className="size-8 rounded-md bg-sidebar-accent grid place-content-center">
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
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary grid place-content-center text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <span className="font-semibold text-lg">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="sarah@studentwise.test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd">Password</Label>
              <Input
                id="pwd"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox id="remember" /> Remember me for 30 days
            </label>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-accent font-medium hover:underline">
                Create one
              </Link>
            </div>
            <div className="text-center text-sm text-muted-foreground pt-2">
              Administrator?{" "}
              <Link to="/admin/login" className="text-accent font-medium hover:underline">
                Admin login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
