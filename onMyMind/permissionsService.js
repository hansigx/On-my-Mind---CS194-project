import { supabase } from "./supabaseClient";

// insert or update perms for a user on a board
// valid permissions are null, "read", "write"
// throws error if error, otherwise nothing
export async function updatePermsForUser(
  boardUserId,
  posterUserId,
  permissions = null,
) {
  const { data, error } = await supabase.from("board_permissions").upsert(
    {
      board_user_id: boardUserId,
      user_id: posterUserId,
      permissions: permissions,
    },
    { onConflict: "board_user_id,user_id" },
  );
  if (error) throw error;
}

// read perms for a user on a board
// returns "read", "write", null, or throws an error
export async function getPermsForUser(boardUserId, posterUserId) {
  const { data, error } = await supabase
    .from("board_permissions")
    .select("permissions")
    .eq("board_user_id", boardUserId)
    .eq("user_id", posterUserId)
    .maybeSingle();

  if (error) throw error;

  // if no perms, return null
  if (data.length === 0) {
    return null;
  }

  return data[0].permissions;
}

// check if user can read
// returns true if user has read or write perms, false otherwise
export async function canUserRead(boardUserId, posterUserId) {
  const perms = await getPermsForUser(boardUserId, posterUserId);
  // write implies read, if perms is null this returns false
  return perms === "read" || perms === "write";
}

export async function canUserWrite(boardUserId, posterUserId) {
  const perms = await getPermsForUser(boardUserId, posterUserId);
  return perms === "write";
}
