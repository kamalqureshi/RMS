import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Switch,
  TouchableOpacity,
} from "react-native";
import { PageHeader } from "../components/PageHeader";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { database } from "../firebaseConfig";
import { onValue, ref, set, update } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TenantForm = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { id } = route.params || {};

  const [tenantId, setTenantId] = useState(id)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [tenantAddress, setTenantAddress] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isReference, setIsReference] = useState(false);
  const [referenceName, setReferenceName] = useState("");
  const [referenceMobile, setReferenceMobile] = useState("");
  const [referenceAddress, setReferenceAddress] = useState("");
  const [assetsList, setAssetsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const toggleSwitch = () => setIsActive((previousState) => !previousState);
  
  const referenceButtonHandler = () =>
    setIsReference((previousState) => !previousState);

  useEffect(() => {
    onValue(ref(database), (snapshot) => {
      const assetsData = snapshot.val();
      setAssetsList(assetsData);
    });
  }, []);

  useEffect(() => {
    if (assetsList) {
      const dataArray = Object.keys(assetsList).map((key) => ({
        id: key,
        ...assetsList[key],
      }));
      setFilteredList(dataArray.filter((data) => data.type === "Asset"));
    }
  }, [assetsList]);

  const handleSubmit = async () => {
    const tenantId = uuidv4();
    const emailPromise = await AsyncStorage.getItem('@email').then(email => {
      return email
    })
    try {
      id
        ? await update(ref(database, `tenant-${id}`), {
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            emailAddress: emailAddress,
            tenantAddress: tenantAddress,
            isActive: isActive,
            referenceName: referenceName,
            referenceMobile: referenceMobile,
            referenceAddress: referenceAddress,
            userEmail: emailPromise
          })
        : await set(ref(database, `tenant-${tenantId}`), {
            id: tenantId,
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            emailAddress: emailAddress,
            tenantAddress: tenantAddress,
            isActive: isActive,
            referenceName: referenceName,
            referenceMobile: referenceMobile,
            referenceAddress: referenceAddress,
            type: "Tenant",
            userEmail: emailPromise
          });

      if(id) {    
      const assetToUpdate = filteredList.map(asset => 
        { if (asset.tenantId === id) return asset }
      )
      await assetToUpdate.length && id && assetToUpdate.forEach( asset => 
          update(ref(database, `asset-${asset.id}`), {
          tenantFirstName: firstName || "",
          tenantLastName: lastName || "",
          tenantEmailAddress: emailAddress || "",
          tenantMobile: mobileNumber || "",
          tenantAddress: tenantAddress || ""
        })
      )
    }

      console.log("Tenant Data written to Firebase");
    } catch (error) {
      console.error("Error writing to Firebase:", error);
    }

    setFirstName("");
    setLastName("");
    setMobileNumber("");
    setTenantAddress("");
    setEmailAddress("");
    setIsActive(false);
    setReferenceName("");
    setReferenceMobile("");
    setReferenceAddress("");
    setTenantId(null);

    navigation.navigate("Tenants");
  };

  useEffect(() => {
    if (id) {
      const updateRef = ref(database, `tenant-${id}`);
      onValue(updateRef, (snapshot) => {
        const data = snapshot.val();
        data &&
          (setFirstName(data?.firstName),
          setLastName(data?.lastName),
          setMobileNumber(data?.mobileNumber),
          setTenantAddress(data?.tenantAddress),
          setEmailAddress(data?.emailAddress),
          setIsActive(data?.isActive),
          setReferenceName(data?.referenceName),
          setReferenceMobile(data?.referenceMobile),
          setReferenceAddress(data?.referenceAddress),
          setTenantId(id)
        );
      });
    } else {
      setFirstName("");
      setLastName("");
      setMobileNumber("");
      setTenantAddress("");
      setEmailAddress("");
      setIsActive(false);
      setReferenceName("");
      setReferenceMobile("");
      setReferenceAddress("");
    }
  }, [id, tenantId]);

  return (
    <ScrollView>
      <PageHeader pageTitle={`${id ? 'Update Tenant' : 'Add Tenant'}`} />

      <View style={styles.container}>
        <Text style={styles.label}>First Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Mobile Number*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Email Address*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={emailAddress}
          onChangeText={setEmailAddress}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Address*</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          placeholder="Enter the address"
          value={tenantAddress}
          onChangeText={setTenantAddress}
          multiline
          numberOfLines={50}
        />

        {/* <View style={styles.toggle}>
          <Text style={styles.label}>Active</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isActive ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isActive}
          />
        </View> */}

        {/* <TouchableOpacity onPress={referenceButtonHandler}>
          <View style={styles.reference}>
            <Text style={styles.label}>Reference</Text>
            <Ionicons
              style={{ paddingLeft: 10 }}
              name={
                isReference ? "remove-circle-outline" : "add-circle-outline"
              }
              size={25}
            />
          </View>
        </TouchableOpacity> */}

        {isReference && (
          <View style={styles.container}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter the Reference Name"
              value={referenceName}
              onChangeText={setReferenceName}
            />

            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              value={referenceMobile}
              onChangeText={setReferenceMobile}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Address"
              value={referenceAddress}
              onChangeText={setReferenceAddress}
            />
          </View>
        )}

        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={
            !(firstName && (mobileNumber || emailAddress) && tenantAddress)
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  toggle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reference: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
    borderTopWidth: 1,
  },
});

export default TenantForm;
