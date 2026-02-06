import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { canUserWrite } from "./permissionsService";
import { supabase } from "./supabaseClient";

export async function getImageBlob(from) {
  if (from === "library") {
    const response = await launchImageLibrary({ mediaType: "photo" });
  } else if (from === "camera") {
    const response = await launchCamera({ mediaType: "photo" });
  } else {
    console.error("Invalid image source specified. Use 'library' or 'camera'.");
    return;
  }
  if (response.didCancel) console.log("User cancelled camera");
  else if (response.errorCode)
    console.log("Camera Error: ", response.errorMessage);
  else {
    console.log("Got image:", response);
    const uriResponse = await fetch(response.assets[0].uri);
    const blob = await uriResponse.blob();
    return blob;
  }
}

export async function getImageBlobFromLibrary() {
  return getImageBlob((from = "library"));
}

export async function getImageBlobFromCamera() {
  return getImageBlob((from = "camera"));
}

export async function uploadBlobToUserBoard(blob, boardUserID, posterUserID) {
  // check if poster has write perms
  if (!(await canUserWrite(boardUserID, posterUserID))) {
    console.error("User does not have write permissions for this board.");
    return;
  }

  const bucketPath = `${boardUserID}/${posterUserID}/${Date.now()}.jpg`;
  // upload to posts storage bucket, with path of boardUserID/posterUserID/timestamp.jpg
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("posts")
    .upload(bucketPath, blob, {
      contentType: "image/jpeg",
      upsert: false,
    });
  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    console.error("Aborting post creation.");
    return;
  }

  // insert into posts table
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .insert({
      board_user_id: boardUserID,
      author_id: posterUserID,
      image_path: bucketPath,
    });
  if (postError) {
    console.error("Error inserting post record:", postError);
    console.error("Removing uploaded image.");
    await supabase.storage.from("posts").remove([bucketPath]);
    return;
  }

  return uploadData;
}
