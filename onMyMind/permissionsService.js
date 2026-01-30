import { supabase } from "./supabaseClient";

// valid permissions are null, "read", "write"
export async function updatePermsForUser(
  boardUserId,
  posterUserId,
  permissions = null,
) {
  const { data, error } = await supabase.from("board_permissions").upsert({
    board_user_id: boardUserId,
    user_id: posterUserId,
    permissions: permissions,
  });
  if (error) console.error("Error updating permissions:", error);
}

export async function getPermsForUser(boardUserId, posterUserId) {
  const { data, error } = await supabase
    .from("board_permissions")
    .select("permissions")
    .eq("board_user_id", boardUserId)
    .eq("user_id", posterUserId);

  if (error) {
    console.error("Error fetching permissions:", error);
    return null;
  }
  return data?.[0]?.permissions ?? null;
}

export async function canUserRead(boardUserId, posterUserId) {
  const perms = await getPermsForUser(boardUserId, posterUserId);
  return perms === "read" || perms === "write";
}

export async function canUserWrite(boardUserId, posterUserId) {
  const perms = await getPermsForUser(boardUserId, posterUserId);
  return perms === "write";
}
