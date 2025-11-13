import { supabase } from "./supabaseClient";

export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message ?? "Sign up failed");
  }

  return data;
}
