import { supabase } from "./supabaseClient";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("Login error:", error);
    throw new Error(error.message ?? "Login failed");
  }

  return data;
}
