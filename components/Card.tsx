import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { primaryBlue, primaryRed, primaryYellow } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { database } from "../firebaseConfig";
import { ref, remove } from "firebase/database";

export function Card({ isAsset, data }) {
  const navigation = useNavigation();

  async function onDeleteHandler(id) {
    await remove(
      ref(database, isAsset ? `asset-${id}` : `tenant-${id}`)
    );
  }

  function onCardHandler(id) {
    navigation.navigate(isAsset ? "AssetForm" : "TenantForm", { id });
  }

  return(
    data.map((data, index) => (
      <TouchableOpacity key={index} onPress={() => onCardHandler(data?.id)}>
      <View style={styles.CardContainer}>
        <View style={styles.ImageContainer}>
          <Image source={require("../assets/images/react-logo.png")} />
        </View>

        <View style={styles.DataContainer}>
          <View style={styles.HeadingContainer}>
            <Text style={styles.Heading}>
              {isAsset
                ? data?.assetName
                : `${data?.firstName} ${data.lastName}`}
            </Text>
            <TouchableOpacity onPress={() => onDeleteHandler(data?.id)}>
              <Ionicons name="trash" size={20} style={styles.DeleteIcon} />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={styles.SubHeading}>
              {isAsset
                ? `${data?.rentalPeriod} - ${data.assetType}`
                : data?.emailAddress}
            </Text>
          </View>

          <View>
            <Text style={styles.Text}>
              {isAsset ? data.assetAddress : data.tenantAddress}
            </Text>
          </View>

          <View style={styles.HighlightedTextContainer}>
            <View
              style={[
                styles.HighlightedText,
                { backgroundColor: primaryBlue, borderRadius: 5 },
              ]}
            >
              <Text style={styles.Text}>
                {isAsset
                  ? `Rs ${data?.rentalAmount}`
                  : `(+92) ${data?.mobileNumber}`}
              </Text>
            </View>
            {isAsset && (
              <View
                style={[
                  styles.HighlightedText,
                  {
                    backgroundColor: `${
                      data?.assetStatus === "available"
                        ? primaryBlue
                        : primaryYellow
                    }`,
                    borderRadius: 50,
                  },
                ]}
              >
                <Text style={styles.Text}>{data?.assetStatus}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ))
)}

const styles = StyleSheet.create({
  CardContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    paddingBottom: 5,
  },
  ImageContainer: {
    flex: 1,
  },
  DataContainer: {
    flex: 2,
    flexDirection: "column",
  },
  HeadingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  Heading: {
    // fontWeight: 500,
    fontSize: 26,
  },
  DeleteIcon: {
    color: primaryRed,
    marginTop: 5,
    paddingRight: 10,
  },
  SubHeading: {
    // fontWeight: 400,
    fontSize: 22,
  },
  Text: {
    fontSize: 14,
  },
  HighlightedTextContainer: {
    display: "flex",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 15,
  },
  HighlightedText: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
