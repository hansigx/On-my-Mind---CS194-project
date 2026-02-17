import { supabase } from "../supabaseClient";

// get circles a user owns
export async function getCirclesForOwner(ownerId) {
  const { data, error } = await supabase
    .from("circles")
    .select("*")
    .eq("owner_id", ownerId);
  if (error) throw error;
  return data.map((row) => row.circle_id);
}

// create circle
export async function createCircle(ownerId, circleName, circleColor) {
  const { data, error } = await supabase.from("circles").insert({
    owner_id: ownerId,
    name: circleName,
    color: circleColor,
  });
  if (error) throw error;
}

// update circle
export async function updateCircle(circleId, circleName, circleColor) {
  const { data, error } = await supabase
    .from("circles")
    .update({ name: circleName, color: circleColor })
    .eq("id", circleId);
  if (error) throw error;
}

// delete circle
export async function deleteCircle(circleId) {
  const { data, error } = await supabase
    .from("circles")
    .delete()
    .eq("id", circleId);
  if (error) throw error;
}

// add user to circle
export async function addUserToCircle(circleId, userId) {
  const { data, error } = await supabase.from("circle_members").insert({
    circle_id: circleId,
    member_id: userId,
  });
  if (error) throw error;
}

// remove user from circle
export async function removeUserFromCircle(circleId, userId) {
  const { data, error } = await supabase
    .from("circle_members")
    .delete()
    .eq("circle_id", circleId)
    .eq("member_id", userId);
  if (error) throw error;
}

// get users in circle
export async function getUsersInCircle(circleId) {
  const { data, error } = await supabase
    .from("circle_members")
    .select("member_id")
    .eq("circle_id", circleId);
  if (error) throw error;
  return data.map((row) => row.member_id);
}

// get all users in circle
export async function getAllUsersInCircle(circleId) {
  const { data, error } = await supabase
    .from("circle_members")
    .select("member_id")
    .eq("circle_id", circleId);
  if (error) throw error;
  return data.map((row) => row.member_id);
}

// check if user in circle
export async function isUserInCircle(circleId, userId) {
  const { data, error } = await supabase
    .from("circle_members")
    .select("circle_id, member_id")
    .eq("circle_id", circleId)
    .eq("member_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

// add post to circle
export async function addPostToCircle(circleId, postId) {
  const { data, error } = await supabase.from("post_circles").insert({
    post_id: postId,
    circle_id: circleId,
  });
  if (error) throw error;
}

// remove post from circle
export async function removePostFromCircle(circleId, postId) {
  const { data, error } = await supabase
    .from("post_circles")
    .delete()
    .eq("circle_id", circleId)
    .eq("post_id", postId);
  if (error) throw error;
}

// get circles for post
export async function getCirclesForPost(postId) {
  const { data, error } = await supabase
    .from("post_circles")
    .select("circle_id")
    .eq("post_id", postId);
  if (error) throw error;
  return data.map((row) => row.circle_id);
}

// get posts from circle(s)
export async function getPostsFromCircles(circleIds) {
  const { data, error } = await supabase
    .from("post_circles")
    .select("post_id")
    .in("circle_id", circleIds);
  if (error) throw error;
  return data.map((row) => row.post_id);
}
