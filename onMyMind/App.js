import "react-native-url-polyfill/auto";
import { useAuthContext } from "./hooks/use-auth-context";
import AuthProvider from "./providers/auth-provider";
import Auth from "./Auth";
import { View, Text } from "react-native";

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

function Main() {
  const { session, profile, isLoggedIn, isLoading } = useAuthContext();

  return (
    <View>
      <Auth />
      <Text>User email:</Text>
      {session && <Text>{session.user.email}</Text>}
      <Text>User profile:</Text>
      {profile && <Text>{JSON.stringify(profile)}</Text>}
    </View>
  );
}
