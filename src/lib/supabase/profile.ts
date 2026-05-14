import { supabase } from "./supabase-client";

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, full_name, avatar")
    .eq("id", userId)
    .single();

  if (error) throw new Error("Failed to fetch profile.");
  return data;
}

export async function ChangeAvatar(userId: string, avatarId: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ avatar: avatarId })
    .eq("id", userId);

  if (error) throw new Error("Failed to update avatar. Please try again.");
}

export async function ChangeFullName(userId: string, fullName: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", userId);

  if (error) throw new Error("Failed to update name. Please try again.");
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
