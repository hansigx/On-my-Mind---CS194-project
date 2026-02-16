import "react-native-url-polyfill/auto";
import { useAuthContext } from "../hooks/use-auth-context";
import AuthProvider from "../providers/auth-provider";
import SelectUser from "./SelectUser";
import Auth from "./Auth";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import {
  getImageBlobFromLibrary,
  getImagesForBoard,
  uploadBlobToUserBoard,
  getPubURLFromPath,
} from "../services/imageService";
import {
  addContributor,
  removeContributor,
  isContributor,
  getContributorsForOwner,
  getOwnersForContributor,
} from "../services/contributorService";

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { session, profile, isLoggedIn, isLoading } = useAuthContext();
  const [targetUserID, setTargetUserID] = useState("");
  const [imageURLs, setImageURLs] = useState([]);
  const [userContributors, setUserContributors] = useState([]);
  const [usersContributedTo, setUsersContributedTo] = useState([]);

  async function updateContributors() {
    if (profile) {
      const userContributors = await getContributorsForOwner(profile.id);
      setUserContributors(userContributors);
      const usersContributedTo = await getOwnersForContributor(profile.id);
      setUsersContributedTo(usersContributedTo);
    }
  }
  useEffect(() => {
    updateContributors();
  }, [profile]);

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
      <Text>Your contributors:</Text>
      {profile && <Text>{JSON.stringify(userContributors)}</Text>}
      <Text>Users you contribute to:</Text>
      {profile && <Text>{JSON.stringify(usersContributedTo)}</Text>}

      {isLoggedIn && (
        <SelectUser
          targetUserID={targetUserID}
          setTargetUserID={setTargetUserID}
        />
      )}
      <Text>Selected user ID: {targetUserID}</Text>

      <TouchableOpacity
        onPress={async () => {
          if (profile) {
            await addContributor(profile.id, targetUserID);
            updateContributors();
          }
        }}
      >
        <Text>Add contributor</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          if (profile) {
            await removeContributor(profile.id, targetUserID);
            updateContributors();
          }
        }}
      >
        <Text>Remove contributor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          const images = await getImagesForBoard(targetUserID);
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
          uploadBlobToUserBoard(blob, targetUserID, session.user.id);
        }}
      >
        <Text>Upload image to board</Text>
      </TouchableOpacity>
    </View>
  );
}
