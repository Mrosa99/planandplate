"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ChangePassword, ChangeEmail } from "@/lib/supabase/user-auth";
import {
  fetchProfile,
  ChangeUsername,
  ChangeAvatar,
} from "@/lib/supabase/profile";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
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

const AVATARS = [
  { id: "chef", emoji: "👨‍🍳", bg: "bg-orange-400" },
  { id: "bowl", emoji: "🍜", bg: "bg-yellow-400" },
  { id: "salad", emoji: "🥗", bg: "bg-green-400" },
  { id: "pizza", emoji: "🍕", bg: "bg-red-400" },
  { id: "taco", emoji: "🌮", bg: "bg-amber-400" },
  { id: "sushi", emoji: "🍱", bg: "bg-blue-400" },
  { id: "cake", emoji: "🎂", bg: "bg-pink-400" },
  { id: "fruit", emoji: "🍓", bg: "bg-rose-400" },
];

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export function SettingsPage() {
  const { session, refreshProfile } = useAuth();
  const email = session?.user.email ?? "";

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  // Avatar picker
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  // Username dialog
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameConfirmOpen, setUsernameConfirmOpen] = useState(false);

  // Email dialog
  const [emailOpen, setEmailOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailConfirmOpen, setEmailConfirmOpen] = useState(false);

  // Password dialog
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!session?.user.id) return;
    fetchProfile(session.user.id)
      .then((data) => {
        setUsername(data.username ?? "");
        setAvatar(data.avatar ?? "");
      })
      .catch(() => toast.error("Failed to load profile"));
  }, [session?.user.id]);

  const selectedAvatar = AVATARS.find((a) => a.id === avatar);

  async function handleAvatarSelect(id: string) {
    try {
      await ChangeAvatar(session!.user.id, id);
      setAvatar(id);
      refreshProfile();
      toast.success("Avatar updated");
    } catch {
      toast.error("Failed to update avatar");
    } finally {
      setAvatarPickerOpen(false);
    }
  }

  // --- Username handlers ---
  function handleUsernameUpdateClick() {
    setUsernameError(null);
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
      toast.success("Username updated");
      setUsernameOpen(false);
    } catch (err: unknown) {
      setUsernameError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setNewUsername("");
      setUsernameLoading(false);
      setUsernameConfirmOpen(false);
    }
  }

  // --- Email handlers ---
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
    } catch (err: unknown) {
      setEmailError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setNewEmail("");
      setEmailPassword("");
      setEmailLoading(false);
      setEmailConfirmOpen(false);
    }
  }

  // --- Password handlers ---
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
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
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
        <div className="flex flex-col items-center gap-2">
          <button
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onClick={() => setAvatarPickerOpen(true)}
          >
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl select-none ${
                selectedAvatar ? selectedAvatar.bg : "bg-primary"
              }`}
            >
              {selectedAvatar ? (
                selectedAvatar.emoji
              ) : (
                <span className="text-primary-foreground text-3xl font-bold">
                  {email ? getInitials(email) : "?"}
                </span>
              )}
            </div>
          </button>
          <p className="text-xs text-muted-foreground">Click to change</p>
          <div className="text-center mt-1">
            <p className="text-lg font-semibold">{username || "—"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        {/* Account settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Username</p>
                <p className="text-sm text-muted-foreground">
                  {username || "Not set"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsernameError(null);
                  setNewUsername("");
                  setUsernameOpen(true);
                }}
              >
                Change
              </Button>
            </div>
            <div className="border-t" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmailError(null);
                  setEmailSuccess(false);
                  setNewEmail("");
                  setEmailPassword("");
                  setEmailOpen(true);
                }}
              >
                Change
              </Button>
            </div>
            <div className="border-t" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPasswordError(null);
                  setPasswordSuccess(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordOpen(true);
                }}
              >
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar picker dialog */}
      <Dialog open={avatarPickerOpen} onOpenChange={setAvatarPickerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose an Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 mt-2">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => handleAvatarSelect(a.id)}
                className={`rounded-full w-16 h-16 flex items-center justify-center text-3xl mx-auto transition-transform hover:scale-110 focus:outline-none ${a.bg} ${
                  avatar === a.id ? "ring-2 ring-ring ring-offset-2" : ""
                }`}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Username dialog */}
      <Dialog
        open={usernameOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewUsername("");
            setUsernameError(null);
          }
          setUsernameOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {usernameError && (
              <p className="text-sm text-red-500">{usernameError}</p>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-username">New Username</Label>
              <Input
                id="new-username"
                placeholder="johndoe"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setUsernameOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUsernameUpdateClick}>
                Update Username
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={usernameConfirmOpen} onOpenChange={setUsernameConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Username Change</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to change your username to{" "}
            <span className="font-medium text-foreground">@{newUsername}</span>?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="ghost"
              onClick={() => setUsernameConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUsernameConfirm} disabled={usernameLoading}>
              {usernameLoading ? "Updating..." : "Yes, change username"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Email dialog */}
      <Dialog
        open={emailOpen}
        onOpenChange={(open) => {
          if (!open) {
            setNewEmail("");
            setEmailPassword("");
            setEmailError(null);
            setEmailSuccess(false);
          }
          setEmailOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Email</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {emailSuccess && (
              <p className="text-sm text-green-500">
                Email updated. Check your new inbox for a confirmation link. If you don&apos;t see it, check your spam folder.
              </p>
            )}
            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            <div className="flex flex-col gap-2">
              <Label htmlFor="new-email">New Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="new@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email-password">Confirm with Password</Label>
              <Input
                id="email-password"
                type="password"
                placeholder="••••••••"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEmailOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEmailUpdateClick}>Update Email</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={emailConfirmOpen} onOpenChange={setEmailConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Email Change</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to change your email to{" "}
            <span className="font-medium text-foreground">{newEmail}</span>? You
            will receive a confirmation link at your new address.
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

      {/* Change Password dialog */}
      <Dialog
        open={passwordOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordError(null);
            setPasswordSuccess(false);
          }
          setPasswordOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          {passwordSuccess ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-green-500">
                Password updated successfully.
              </p>
              <div className="flex justify-end">
                <Button onClick={() => setPasswordOpen(false)}>Close</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <PasswordInput
                  id="current-password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <PasswordInput
                  id="new-password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <PasswordInput
                  id="confirm-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateClick}>Update Password</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Password Change</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to change your password? You will need to use
            your new password next time you log in.
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
