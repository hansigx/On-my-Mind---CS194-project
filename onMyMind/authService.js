import { supabase } from "./supabaseClient";

// Sign up a new user with email and password
// Sends a confirmation email if address is valid
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

// Sign in an existing user with email and password
// Returns session information and user data or an error
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Sign out the current user
export async function signOut() {
  const { data, error } = await supabase.auth.signOut();
  return { data, error };
}

// Get the current authenticated user
export function getCurrentUser() {
  return supabase.auth.getUser();
}
