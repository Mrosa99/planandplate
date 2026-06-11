import { supabase } from "./supabase-client";

export async function Login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error("Invalid email or password.");
  }

  return data.session;
}

export async function Signup(email: string, password: string, username: string) {
  const { data: isTaken } = await supabase.rpc("is_username_taken", { username_to_check: username });
  if (isTaken) throw new Error("Username is already taken.");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: { username },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("password")) {
      throw new Error("Password must be at least 6 characters.");
    }
    if (msg.includes("unable to validate email") || msg.includes("invalid email")) {
      throw new Error("Please enter a valid email address.");
    }
    throw new Error("Something went wrong. Please try again.");
  }

  if (data.user?.identities?.length === 0) {
    throw new Error("An account with this email already exists. Try logging in.");
  }

  return data;
}

export async function Logout() {
  await supabase.auth.signOut();
}

export async function ResendConfirmation(email: string) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw new Error("Failed to resend email. Please try again.");
}

export async function SendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
  });

  if (error) {
    throw new Error("Could not send reset email. Please try again.");
  }
}

export async function ChangePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
) {
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (verifyError) {
    throw new Error("Current password is incorrect.");
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error("Failed to update password. Please try again.");
  }
}

export async function ChangeEmail(
  currentEmail: string,
  newEmail: string,
  password: string,
) {
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: currentEmail,
    password: password,
  });

  if (verifyError) {
    throw new Error("Current password is incorrect.");
  }

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: `${window.location.origin}/auth/callback` },
  );

  if (error) {
    throw new Error("Failed to update email. Please try again.");
  }
}
