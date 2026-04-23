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

export async function Signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error("Could not create account. Please try again.");
  }

  return data;
}

export async function Logout() {
  await supabase.auth.signOut();
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

  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    throw new Error("Failed to update email. Please try again.");
  }
}
