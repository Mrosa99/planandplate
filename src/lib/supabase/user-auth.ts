import { supabase } from "./supabase-client";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error("Invalid email or password.");
  }

  return data;
}
