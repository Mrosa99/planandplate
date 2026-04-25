import { supabase } from "./supabase-client";

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (error) throw new Error("Failed to fetch profile.");
  return data;
}

export async function ChangeUsername(userId: string, username: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", userId);

  if (error) {
    if (error.code === "23505") throw new Error("Username is already taken.");
    throw new Error("Failed to update username. Please try again.");
  }
}
