import {
  detailGreen,
  primaryBlue,
  primaryRed,
  secondaryYellow,
} from "../constants/colors";
import React from "react";
import { StyleSheet, View, Text } from "react-native";

export function DetailsBar() {
  return (
    <View style={styles.Container}>
      <View style={styles.DetailCard}>
        <Text style={styles.Heading}>Earnings</Text>
        <Text style={[styles.Heading, { color: detailGreen }]}>$ 96000.00</Text>
      </View>
      <View style={styles.DetailCard}>
        <Text style={styles.Heading}>Expenses</Text>
        <Text style={[styles.Heading, { color: primaryBlue }]}>$ 0.00</Text>
      </View>
      <View style={styles.DetailCard}>
        <Text style={styles.Heading}>Dues</Text>
        <Text style={[styles.Heading, { color: primaryRed }]}>$ 18000.00</Text>
      </View>
      <View style={styles.DetailCard}>
        <Text style={styles.Heading}>Deposits</Text>
        <Text style={[styles.Heading, { color: secondaryYellow }]}>$ 0.00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "row",
    backgroundColor: "white",
    height: 50,
    alignItems: "center",
  },
  DetailCard: {
    display: "flex",
    alignItems: "center",
  },
  Heading: {
    fontSize: 14,
    fontWeight: 700,
  },
});
