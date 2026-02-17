import { supabase } from "../supabaseClient";

// add a contributor to an owner
export async function addContributor(ownerUserId, contributorUserId) {
  const { data, error } = await supabase.from("contributors").insert({
    owner_id: ownerUserId,
    contributor_id: contributorUserId,
  });
  if (error) throw error;
}

// remove a contributor from an owner
export async function removeContributor(ownerUserId, contributorUserId) {
  const { data, error } = await supabase
    .from("contributors")
    .delete()
    .eq("owner_id", ownerUserId)
    .eq("contributor_id", contributorUserId);
  if (error) throw error;
}

// check if a user is a contributor to an owner
// returns true if contributor, false otherwise
export async function isContributor(ownerUserId, contributorUserId) {
  const { data, error } = await supabase
    .from("contributors")
    .select("*")
    .eq("owner_id", ownerUserId)
    .eq("contributor_id", contributorUserId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

// get all contributors for a given owner
export async function getContributorsForOwner(ownerUserId) {
  const { data, error } = await supabase
    .from("contributors")
    .select("contributor_id")
    .eq("owner_id", ownerUserId);
  if (error) throw error;
  return data.map((row) => row.contributor_id);
}

// get all owners who have a given contributor
export async function getOwnersForContributor(contributorUserId) {
  const { data, error } = await supabase
    .from("contributors")
    .select("owner_id")
    .eq("contributor_id", contributorUserId);
  if (error) throw error;
  return data.map((row) => row.owner_id);
}
