import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { primaryBlue } from "../constants/colors";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-between",
    height: 100,
    backgroundColor: primaryBlue,
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 55,
    fontSize: 25,
    marginLeft: 15,
  },
});

export function PageHeader({ pageTitle }) {
  const navigation = useNavigation();
  const navigateBackHandler = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pageTitle}</Text>

      <View style={{ display: "flex", justifyContent: "space-around" }}>
        <TouchableOpacity onPress={navigateBackHandler}>
          <Ionicons name="log-out-outline" size={40} style={{marginTop: 50}} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
