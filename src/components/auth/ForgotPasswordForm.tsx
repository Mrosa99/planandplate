"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SendPasswordReset } from "@/lib/supabase/user-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;

    try {
      await SendPasswordReset(email);
      setSent(true);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            {sent
              ? "Check your email for a reset link. If you don't see it, check your spam folder."
              : "Enter your email below to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="mt-2">
              <a href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">Back to Login</Button>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/auth/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
              <div className="mt-2">
                <a href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full">Back to Login</Button>
                </a>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
