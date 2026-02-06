import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { canUserWrite } from "./permissionsService";
import { supabase } from "../supabaseClient";

// get image blob from either camera or library, helper for other abstractions
// returns blob
async function getImageBlob(from) {
  let response;
  // get user input
  if (from === "library") {
    response = await launchImageLibrary({ mediaType: "photo" });
  } else if (from === "camera") {
    response = await launchCamera({ mediaType: "photo" });
  } else {
    console.error("Invalid image source specified. Use 'library' or 'camera'.");
    throw new Error(
      "Invalid image source specified. Use 'library' or 'camera'.",
    );
  }

  // check user input
  if (response.didCancel) console.log("User cancelled camera");
  else if (response.errorCode) {
    console.log("Camera Error: ", response.errorMessage);
    throw new Error("Camera error: " + response.errorMessage);
  } else {
    // convert uri to blob
    console.log("Got image:", response);
    const uriResponse = await fetch(response.assets[0].uri);
    const blob = await uriResponse.blob();
    return blob;
  }
}

// get image blob from user library
// returns blob
export async function getImageBlobFromLibrary() {
  return getImageBlob("library");
}

// get image blob from user camera
// returns blob
export async function getImageBlobFromCamera() {
  return getImageBlob({ from: "camera" });
}

// upload image blob to supabase and create row in posts table
// returns 1 if successful, throws error
export async function uploadBlobToUserBoard(blob, boardUserID, posterUserID) {
  if (!blob) throw new Error("No image blob provided.");
  // check if poster has write perms
  if (!(await canUserWrite(boardUserID, posterUserID)))
    throw new Error("User does not have write permissions for this board.");

  // unique path in bucket, by what board is being posted to, who is posting, then timestamp to avoid collisions
  const bucketPath = `${boardUserID}/${posterUserID}/${Date.now()}.jpg`;
  // upload to posts storage bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("posts")
    .upload(bucketPath, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });
  if (uploadError)
    throw new Error("Error uploading image: " + uploadError.message);

  // insert into posts table
  try {
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        board_user_id: boardUserID,
        author_id: posterUserID,
        image_path: bucketPath,
      });
    if (postError) {
      throw new Error("Error creating post record: " + postError.message);
    }
  } catch (error) {
    // if error when creating row, first remove uploaded image to avoid orphaned files
    await supabase.storage.from("posts").remove([bucketPath]);
  }
}

export async function getPubURLFromPath(imagePath) {
  const { data, error } = await supabase.storage
    .from("posts")
    .getPublicUrl(imagePath);

  if (error) throw new Error("Error downloading image: " + error.message);

  return data;
}

export async function getImagesForBoard(boardUserID) {
  // get all rows for posts (future TODO: pagination if too many posts)
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("board_user_id", boardUserID);

  if (error) throw new Error("Error fetching posts: " + error.message);

  return data;
}
