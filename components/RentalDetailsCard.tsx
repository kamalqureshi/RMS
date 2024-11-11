import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  primaryBlue,
  primaryRed,
  primaryWhite,
  shadowGray,
} from "../constants/colors";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function RentalDetailsCard({ data }) {

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.containerColumn}>
          <View>
            <Text style={styles.assetName}>{data?.assetName}</Text>
            <Text style={styles.rentalAmount}>{`Rs ${data?.rentalAmount}`}</Text>
            <Text style={styles.commonText}>{data?.rentalPeriod}</Text>
            <Text style={styles.commonText}>{`${data?.startContract} - ${data?.endContract}`}</Text>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.phoneContainer}>
              <Ionicons name="call" size={10} />
              <Text>{`(+92) ${data?.tenantMobile}`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.containerColumn}>
          <View>
            <Text style={styles.incrementText}>* 20% increment/6 months</Text>

            <View style={styles.amountContainer}>
              <Text style={styles.tenantHeading}>Tenant Name: </Text>
              <Text style={styles.tenantText}>
                {`${data?.tenantFirstName} ${data?.tenantLastName}`}
              </Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.tenantHeading}>Tenant Email: </Text>
              <Text style={styles.tenantText}>{data?.tenantEmailAddress}</Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.tenantHeading}>Tenant Address: </Text>
              <Text style={styles.tenantText}>{data?.tenantAddress}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 10,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: primaryWhite,
    marginHorizontal: 15,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 5,
    shadowColor: shadowGray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 3,
  },
  containerColumn: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 6,
    marginTop: 15,
  },
  buttonContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    justifyContent: "center",
    fontWeight: "600",
  },
  amountContainer: {
    flexDirection: "column", 
    alignItems: "flex-start", 
    marginBottom: 3,
  },
  tenantHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: primaryBlue
  },
  tenantText: {
    fontSize: 13,
    fontWeight: "400",
  },
  assetName: {
    fontSize: 21,
    fontWeight: "600",
    marginBottom: 3,
  },
  rentalAmount: {
    color: primaryBlue,
    fontWeight: "600",
  },
  commonText: {
    fontWeight: "600",
  },
  incrementText: {
    marginBottom: 5,
    fontWeight: "500",
    color: primaryRed
  },
  bottomSection: {
    marginBottom: 60,
  },
});
