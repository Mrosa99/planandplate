"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { useAuthSession } from "@/lib/supabase/use-auth-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function SettingsPage() {
  const { session } = useAuthSession();
  const email = session?.user.email ?? "";

  const [profileEditing, setProfileEditing] = useState(false);
  const [securityEditing, setSecurityEditing] = useState(false);

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* Avatar + identity */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold select-none">
            {email ? getInitials(email) : "?"}
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">Your Name</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription className="mt-1">
                  {profileEditing ? "Make your changes below." : "View and update your personal details."}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setProfileEditing((v) => !v)}
              >
                {profileEditing ? (
                  <><X className="size-4" /> Cancel</>
                ) : (
                  <><Pencil className="size-4" /> Edit</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  readOnly={!profileEditing}
                  className={!profileEditing ? "opacity-60 cursor-not-allowed" : ""}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  readOnly={!profileEditing}
                  className={!profileEditing ? "opacity-60 cursor-not-allowed" : ""}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                readOnly={!profileEditing}
                className={!profileEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                readOnly
                className="opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                readOnly={!profileEditing}
                className={!profileEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={3}
                placeholder="Tell us a little about yourself..."
                readOnly={!profileEditing}
                className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none ${!profileEditing ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </div>
          </CardContent>
          {profileEditing && (
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => setProfileEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => setProfileEditing(false)}>
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Security</CardTitle>
                <CardDescription className="mt-1">
                  {securityEditing ? "Enter your current and new password." : "Manage your password."}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setSecurityEditing((v) => !v)}
              >
                {securityEditing ? (
                  <><X className="size-4" /> Cancel</>
                ) : (
                  <><Pencil className="size-4" /> Edit</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                readOnly={!securityEditing}
                className={!securityEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                readOnly={!securityEditing}
                className={!securityEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                readOnly={!securityEditing}
                className={!securityEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
          </CardContent>
          {securityEditing && (
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => setSecurityEditing(false)}>
                Cancel
              </Button>
              <Button variant="outline" onClick={() => setSecurityEditing(false)}>
                Update Password
              </Button>
            </CardFooter>
          )}
        </Card>

      </div>
    </main>
  );
}
