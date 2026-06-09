import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { APP_NAME } from "@/lib/brand";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/signup")({
  head: () => pageHead("Sign Up"),
  component: Signup,
});

function Signup() {
  return (
    <div className="min-h-screen bg-background grid place-items-center p-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-primary grid place-content-center text-primary-foreground"><GraduationCap className="size-5" /></div>
            <span className="font-semibold text-lg">{APP_NAME}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create your student account</h1>
          <p className="text-sm text-muted-foreground mt-1">Get started in minutes — manage your academic life with ease.</p>
        </div>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <form className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Sarah Ahmed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sid">Student ID</Label>
                <Input id="sid" placeholder="2026-BSCS-0042" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="student@university.edu" />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="ee">Electrical Engineering</SelectItem>
                    <SelectItem value="bba">Business Administration</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 8 }, (_, i) => (
                      <SelectItem key={i} value={`${i + 1}`}>Semester {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="p1">Password</Label>
                <Input id="p1" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p2">Confirm Password</Label>
                <Input id="p2" type="password" placeholder="••••••••" />
              </div>
              <div className="sm:col-span-2 pt-2">
                <Button className="w-full bg-primary hover:bg-primary/90">Create Account</Button>
              </div>
              <div className="sm:col-span-2 text-center text-sm text-muted-foreground">
                Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
