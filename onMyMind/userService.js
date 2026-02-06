import { supabase } from "./supabaseClient";

export async function getAllUsers() {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
}

export async function getAllOtherUsers(currentUserId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .neq("id", currentUserId);
  if (error) throw error;
  return data;
}

// get row from users table for given id
// returns user data
// errors if no user with id
export async function getUser(userID) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userID)
    .single();
  if (error) throw error;
  return data;
}

// update row for user
// data is object with keys matching cols in profiles table
// e.g. name_first, name_last, name_display, settings, pfp_path
// errors if no user with id
export async function updateUser(userID, data) {
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", userID);
  if (error) throw error;
}

// get row from private users table for given id
export async function getPrivateUser(userID) {
  const { data, error } = await supabase
    .from("private_users")
    .select("*")
    .eq("id", userID)
    .single();
  if (error) throw error;
  return data;
}

// update row in private users table for given id
export async function updatePrivateUser(userID, data) {
  const { error } = await supabase
    .from("private_users")
    .update(data)
    .eq("id", userID);
  if (error) throw error;
}
