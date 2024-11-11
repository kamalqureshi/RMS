import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { primaryBlue } from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";

export function AddButton({ label = "Add", isAsset = false }) {
  const navigation = useNavigation();
  const { width: screenWidth } = Dimensions.get("window");

  const onPressHandler = () => {
    isAsset
      ? navigation.navigate("AssetForm")
      : navigation.navigate("TenantForm");
  };

  return (
    <View
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        onPress={onPressHandler}
        style={{
          display: "flex",
          padding: 8,
          backgroundColor: primaryBlue,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
          width: screenWidth * 0.3,
        }}
      >
        <Text style={{ fontWeight: 500 }}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}
