"use client";

import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { ChangePassword, ChangeEmail } from "@/lib/supabase/user-auth";
import { fetchProfile, ChangeUsername } from "@/lib/supabase/profile";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function SettingsPage() {
  const { session } = useAuth();
  const email = session?.user.email ?? "";

  const [username, setUsername] = useState("");
  const [usernameEditing, setUsernameEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [usernameConfirmOpen, setUsernameConfirmOpen] = useState(false);

  const [profileEditing, setProfileEditing] = useState(false);

  useEffect(() => {
    if (!session?.user.id) return;
    fetchProfile(session.user.id)
      .then(data => setUsername(data.username ?? ""))
      .catch(() => {});
  }, [session?.user.id]);

  function handleUsernameUpdateClick() {
    setUsernameError(null);
    setUsernameSuccess(false);
    if (!newUsername.trim()) {
      setUsernameError("Please enter a new username.");
      return;
    }
    if (newUsername.trim() === username) {
      setUsernameError("New username must be different from your current one.");
      return;
    }
    setUsernameConfirmOpen(true);
  }

  async function handleUsernameConfirm() {
    setUsernameLoading(true);
    try {
      await ChangeUsername(session!.user.id, newUsername.trim());
      setUsername(newUsername.trim());
      setUsernameSuccess(true);
      setUsernameEditing(false);
    } catch (err: unknown) {
      setUsernameError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setNewUsername("");
      setUsernameLoading(false);
      setUsernameConfirmOpen(false);
    }
  }
  const [securityEditing, setSecurityEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [emailEditing, setEmailEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailConfirmOpen, setEmailConfirmOpen] = useState(false);

  function handleEmailUpdateClick() {
    setEmailError(null);
    setEmailSuccess(false);

    if (!newEmail.trim()) {
      setEmailError("Please enter a new email address.");
      return;
    }
    if (newEmail === email) {
      setEmailError("New email must be different from your current email.");
      return;
    }
    if (!emailPassword) {
      setEmailError("Please enter your password to confirm.");
      return;
    }

    setEmailConfirmOpen(true);
  }

  async function handleEmailConfirm() {
    setEmailLoading(true);
    try {
      await ChangeEmail(email, newEmail, emailPassword);
      setEmailSuccess(true);
      setEmailEditing(false);
    } catch (err: unknown) {
      setEmailError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setNewEmail("");
      setEmailPassword("");
      setEmailLoading(false);
      setEmailConfirmOpen(false);
    }
  }

  function handleUpdateClick() {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setConfirmOpen(true);
  }

  async function handleConfirm() {
    setPasswordLoading(true);
    try {
      await ChangePassword(email, currentPassword, newPassword);
      setPasswordSuccess(true);
      setSecurityEditing(false);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordLoading(false);
      setConfirmOpen(false);
    }
  }

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

        {profileEditing && <>
        {/* Username */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Username</CardTitle>
                <CardDescription className="mt-1">
                  {usernameEditing ? "Enter your new username." : "Manage your username."}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setUsernameEditing((v) => !v)}
              >
                {usernameEditing ? (
                  <><X className="size-4" /> Cancel</>
                ) : (
                  <><Pencil className="size-4" /> Edit</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {usernameSuccess && (
              <p className="text-sm text-green-500">Username updated successfully.</p>
            )}
            {usernameError && (
              <p className="text-sm text-red-500">{usernameError}</p>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-username">Current Username</Label>
              <Input
                id="current-username"
                value={username || "Not set"}
                readOnly
                className="opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-username">New Username</Label>
              <Input
                id="new-username"
                placeholder="johndoe"
                readOnly={!usernameEditing}
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                className={!usernameEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
          </CardContent>
          {usernameEditing && (
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => setUsernameEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUsernameUpdateClick}>
                Update Username
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Email Address</CardTitle>
                <CardDescription className="mt-1">
                  {emailEditing ? "Enter your new email and confirm with your password." : "Manage your email address."}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={() => setEmailEditing((v) => !v)}
              >
                {emailEditing ? (
                  <><X className="size-4" /> Cancel</>
                ) : (
                  <><Pencil className="size-4" /> Edit</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {emailSuccess && (
              <p className="text-sm text-green-500">Email updated. Check your new inbox for a confirmation link.</p>
            )}
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-email">Current Email</Label>
              <Input
                id="current-email"
                type="email"
                value={email}
                readOnly
                className="opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-email">New Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="new@example.com"
                readOnly={!emailEditing}
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className={!emailEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email-password">Confirm with Password</Label>
              <Input
                id="email-password"
                type="password"
                placeholder="••••••••"
                readOnly={!emailEditing}
                value={emailPassword}
                onChange={e => setEmailPassword(e.target.value)}
                className={!emailEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
          </CardContent>
          {emailEditing && (
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => setEmailEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleEmailUpdateClick}>
                Update Email
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
            {passwordSuccess && (
              <p className="text-sm text-green-500">Password updated successfully.</p>
            )}
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                readOnly={!securityEditing}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
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
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
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
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={!securityEditing ? "opacity-60 cursor-not-allowed" : ""}
              />
            </div>
          </CardContent>
          {securityEditing && (
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost" onClick={() => setSecurityEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateClick}>
                Update Password
              </Button>
            </CardFooter>
          )}
        </Card>
        </>}

      </div>

      <Dialog open={usernameConfirmOpen} onOpenChange={setUsernameConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Username Change</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to change your username to <span className="font-medium text-foreground">@{newUsername}</span>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setUsernameConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUsernameConfirm} disabled={usernameLoading}>
              {usernameLoading ? "Updating..." : "Yes, change username"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={emailConfirmOpen} onOpenChange={setEmailConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Email Change</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to change your email to <span className="font-medium text-foreground">{newEmail}</span>? You will receive a confirmation link at your new address.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setEmailConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEmailConfirm} disabled={emailLoading}>
              {emailLoading ? "Updating..." : "Yes, change email"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Password Change</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to change your password? You will need to use your new password next time you log in.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={passwordLoading}>
              {passwordLoading ? "Updating..." : "Yes, change password"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
