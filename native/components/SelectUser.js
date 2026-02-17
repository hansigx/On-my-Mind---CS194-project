import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";
import { getAllUsers } from "../services/userService";

// component for selecting which board to post to, pass in state to use
export default function SelectUser({ targetUserID, setTargetUserID }) {
  const [allUsers, setAllUsers] = useState([]);

  // on load get all users
  useEffect(() => {
    // react doesn't like async useEffect funcs so we wiggle around it
    async function fetchUsers() {
      setAllUsers(await getAllUsers());
    }
    fetchUsers();
  }, []);

  // helper to render dropdown list of all users
  const UserDropdown = () => {
    console.log("All users:", allUsers);
    return allUsers.map((user) => (
      <Picker.Item key={user.id} label={user.name_display} value={user.id} />
    ));
  };

  return (
    <View>
      <Text>Select a user:</Text>
      <Picker
        selectedValue={targetUserID}
        onValueChange={(itemValue) => setTargetUserID(itemValue)}
      >
        <Picker.Item label="Select a user" value="" />
        {UserDropdown()}
      </Picker>
    </View>
  );
}
