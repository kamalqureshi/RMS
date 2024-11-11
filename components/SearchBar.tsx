import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { primaryBlue, primaryWhite, shadowGray } from "../constants/colors";

export function SearchBar() {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = () => {};

  return (
    <View style={styles.Container}>
      <View style={styles.SearchContainer}>
        <Ionicons name="search-outline" size={25} style={{ marginRight: 30 }} />
        <TextInput
          style={{ width: 200 }}
          placeholder="Search Asset..."
          value={searchInput}
          onChangeText={setSearchInput}
        />
      </View>

      <TouchableOpacity onPress={handleSubmit}>
        <View style={styles.SearchButton}>
          <Text style={{ fontWeight: 500 }}>Search</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: primaryWhite,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    margin: 5,
    borderRadius: 30,
    shadowColor: shadowGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  SearchContainer: {
    display: "flex",
    flexDirection: "row",
  },
  SearchButton: {
    backgroundColor: primaryBlue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    opacity: 0.9,
  },
});
