import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { APP_NAME } from "@/lib/brand";
import { requireGuest } from "@/lib/auth-guards";
import { pageHead } from "@/lib/seo";
import { signUp } from "@/lib/supabase/auth";
import { useSupabaseConfigured } from "@/hooks/use-supabase-configured";

export const Route = createFileRoute("/signup")({
  head: () => pageHead("Sign Up"),
  beforeLoad: ({ context }) => {
    requireGuest(context.authUser);
  },
  component: Signup,
});

function Signup() {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabaseReady = useSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName || !email || !password) {
      toast.error("Fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp({
        data: {
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          studentId: studentId.trim() || undefined,
        },
      });

      toast.success("Account created!");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-primary grid place-content-center text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <span className="font-semibold text-lg">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join StudentWise — manage your academic life with ease.
          </p>
        </div>

        {!supabaseReady && (
          <p className="mb-4 text-sm text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
            Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel, then redeploy.
          </p>
        )}

        <Card>
          <CardContent className="p-6 sm:p-8">
            <form className="grid sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Sarah Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sid">Student ID (optional)</Label>
                <Input
                  id="sid"
                  placeholder="2026-BSCS-0042"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p1">Password *</Label>
                <Input
                  id="p1"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p2">Confirm Password *</Label>
                <Input
                  id="p2"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
              <div className="sm:col-span-2 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
              <div className="sm:col-span-2 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-accent font-medium hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
