import "react-native-url-polyfill/auto";
import { useAuthContext } from "../hooks/use-auth-context";
import AuthProvider from "../providers/auth-provider";
import UploadToBoard from "./SelectBoard";
import Auth from "./Auth";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import {
  getImageBlobFromLibrary,
  getImagesForBoard,
  uploadBlobToUserBoard,
  getPubURLFromPath,
} from "../services/imageService";

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { session, profile, isLoggedIn, isLoading } = useAuthContext();
  const [targetBoardUserID, setTargetBoardUserID] = useState("");
  const [imageURLs, setImageURLs] = useState([]);

  const AllImages = () => {
    return imageURLs.map((image) => (
      <View key={image.id}>
        <Text>{image.id}</Text>
        <Image
          style={{ width: 200, height: 200 }}
          source={{ uri: image.url }}
        />
      </View>
    ));
  };

  return (
    <View>
      <Auth />
      <Text>User email:</Text>
      {session && <Text>{session.user.email}</Text>}
      <Text>User profile:</Text>
      {profile && <Text>{JSON.stringify(profile)}</Text>}
      {isLoggedIn && (
        <UploadToBoard
          targetBoardUserID={targetBoardUserID}
          setTargetBoardUserID={setTargetBoardUserID}
        />
      )}
      <Text>Selected board user ID: {targetBoardUserID}</Text>
      <TouchableOpacity
        onPress={async () => {
          const images = await getImagesForBoard(targetBoardUserID);
          // get map of image paths to public urls
          const imageURLs = await Promise.all(
            images.map(async (image) => {
              const { publicUrl } = await getPubURLFromPath(image.image_path);
              return { id: image.id, url: publicUrl };
            }),
          );
          setImageURLs(imageURLs);
        }}
      >
        <Text>Get board images</Text>
      </TouchableOpacity>
      <AllImages />
      <TouchableOpacity
        onPress={async () => {
          const blob = await getImageBlobFromLibrary();
          uploadBlobToUserBoard(blob, targetBoardUserID, session.user.id);
        }}
      >
        <Text>Upload image to board</Text>
      </TouchableOpacity>
    </View>
  );
}
