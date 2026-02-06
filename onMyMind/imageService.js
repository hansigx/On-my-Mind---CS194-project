import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { canUserWrite } from "./permissionsService";
import { supabase } from "./supabaseClient";

// get image blob from either camera or library, helper for other abstractions
// returns blob
export async function getImageBlob(from) {
  // get user input
  if (from === "library") {
    const response = await launchImageLibrary({ mediaType: "photo" });
  } else if (from === "camera") {
    const response = await launchCamera({ mediaType: "photo" });
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
  return getImageBlob((from = "library"));
}

// get image blob from user camera
// returns blob
export async function getImageBlobFromCamera() {
  return getImageBlob((from = "camera"));
}

// upload image blob to supabase and create row in posts table
// returns 1 if successful, throws error
export async function uploadBlobToUserBoard(blob, boardUserID, posterUserID) {
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
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .insert({
      board_user_id: boardUserID,
      author_id: posterUserID,
      image_path: bucketPath,
    });
  // if error when creating row, first remove uploaded image to avoid orphaned files
  if (postError) {
    await supabase.storage.from("posts").remove([bucketPath]);
    throw new Error("Error creating post record: " + postError.message);
  }
}
