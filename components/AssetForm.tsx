import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Switch,
  SafeAreaView,
} from "react-native";
import { PageHeader } from "../components/PageHeader";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { database } from "../firebaseConfig";
import { ref, set, onValue, update } from "firebase/database";
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';


function setDateFormat(date){
  const dateSplit = date.split('/')
  return dayjs().date(dateSplit[0]).month(dateSplit[1]-1).year(dateSplit[2])
}

const AssetForm = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const [assetId, setAssetId] = useState(id)
  const [assetName, setAssetName] = useState("");
  const [assetAddress, setAssetAddress] = useState("");
  const [assetDesc, setAssetDesc] = useState("");
  const [rentalAmount, setRentalAmount] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  // Asset Dropdown
  const [assetTypeItems, setAssetTypeItems] = useState([
    { label: "House", value: "House" },
    { label: "Condo", value: "Condo" },
    { label: "Apartment", value: "Apartment" },
    { label: "Flat", value: "Flat" },
    { label: "Shop", value: "Shop" },
    { label: "Hall", value: "Hall" },
    { label: "Plaza", value: "Plaza" },
  ]);
  const [assetTypeOpen, setAssetTypeOpen] = useState(false);
  const [assetTypeValue, setAssetTypeValue] = useState(null);

  //Status Dropdown
  const [statusItems, setStatusItems] = useState([
    { label: "Rented", value: "Rented" },
    { label: "Available", value: "Available" },
  ]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState(null);
  const [startContract, setStartContract] = useState(dayjs())
  const [endContract, setEndContract] = useState(dayjs())

  //Rental Period Dropdown
  const [rentalPeriodItems, setRentalPeriodItems] = useState([
    { label: "Weekly", value: "Weekly" },
    { label: "Bi-Weekly", value: "Bi-Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Annually", value: "Annually" },
  ]);
  const [rentalPeriodOpen, setRentalPeriodOpen] = useState(false);
  const [rentalPeriodValue, setRentalPeriodValue] = useState(null);

  const tenantsRef = ref(database);
  const [tenantsList, setTenantsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  // Available Tenants Dropdown 
  const [availableTenantsItems, setAvailableTenantsItems] = useState([]);
  const [availableTenantsOpen, setAvailableTenantsOpen] = useState(false);
  const [availableTenantsValue, setAvailableTenantsValue] = useState(null);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handleSubmit = async () => {
    const assetId = uuidv4();
    const tenantId = availableTenantsValue
    const tenant = filteredList?.find(tenant => tenant.id === tenantId)
    const emailPromise = await AsyncStorage.getItem('@email').then(email => {
      return email
    })
    try {
      id
        ? await update(ref(database, `asset-${id}`), {
            assetType: assetTypeValue,
            assetName: assetName,
            assetAddress: assetAddress,
            assetDesc: assetDesc,
            assetStatus: statusValue,
            rentalAmount: rentalAmount,
            rentalPeriod: rentalPeriodValue,
            isActive: isEnabled,
            startContract: `${startContract.date()}/${startContract.month()+1}/${startContract.year()}`,
            endContract: `${endContract.date()}/${endContract.month()+1}/${endContract.year()}`,
            tenantId: tenantId,
            tenantFirstName: tenant?.firstName || "",
            tenantLastName: tenant?.lastName || "",
            tenantEmailAddress: tenant?.emailAddress || "",
            tenantMobile: tenant?.mobileNumber || "",
            tenantAddress: tenant?.tenantAddress || "",
            userEmail: emailPromise 
          })
        : await set(ref(database, `asset-${assetId}`), {
            id: assetId,
            assetType: assetTypeValue,
            assetName: assetName,
            assetAddress: assetAddress,
            assetDesc: assetDesc,
            assetStatus: statusValue,
            rentalAmount: rentalAmount,
            rentalPeriod: rentalPeriodValue,
            isActive: isEnabled,
            startContract: `${startContract.date()}/${startContract.month()+1}/${startContract.year()}`,
            endContract: `${endContract.date()}/${endContract.month()+1}/${endContract.year()}`,
            tenantId: tenantId,
            tenantFirstName: tenant?.firstName || "",
            tenantLastName: tenant?.lastName || "",
            tenantEmailAddress: tenant?.emailAddress || "",
            tenantMobile: tenant?.mobileNumber || "",
            tenantAddress: tenant?.tenantAddress || "",
            type: "Asset",
            userEmail: emailPromise 
          });
      console.log("Asset Data written to Firebase");
    } catch (error) {
      console.error("Error writing to Firebase:", error);
    }

    setAssetName("");
    setAssetAddress("");
    setAssetDesc("");
    setRentalAmount("");
    setIsEnabled(false);
    setAssetTypeValue(null);
    setStatusValue(null);
    setRentalPeriodValue(null);
    setAvailableTenantsValue(null);
    setStartContract(dayjs());
    setEndContract(dayjs());
    setAssetId(null)

    navigation.navigate("Assets");
  };

  useEffect(() => {
    if (id) {
      const updateRef = ref(database, `asset-${id}`);
      onValue(updateRef, (snapshot) => {
        const data = snapshot.val();
        data &&
          (setAssetName(data?.assetName),
          setAssetAddress(data?.assetAddress),
          setAssetDesc(data?.assetDesc),
          setRentalAmount(data?.rentalAmount),
          setIsEnabled(data?.isActive),
          setAssetTypeValue(data?.assetType),
          setStatusValue(data?.assetStatus),
          setRentalPeriodValue(data?.rentalPeriod),
          setAvailableTenantsValue(data?.tenantId),
          setStartContract(setDateFormat(data?.startContract)),
          setEndContract(setDateFormat(data?.endContract)),
          setAssetId(id)
        );
      });
    } else {
      setAssetName("");
      setAssetAddress("");
      setAssetDesc("");
      setRentalAmount("");
      setIsEnabled(false);
      setAssetTypeValue(null);
      setStatusValue(null);
      setRentalPeriodValue(null);
      setAvailableTenantsValue(null);
      setStartContract(dayjs());
      setEndContract(dayjs());
    }
  }, [id, assetId]);

  useEffect(() => {
    onValue(tenantsRef, (snapshot) => {
      const tenantsData = snapshot.val();
      setTenantsList(tenantsData);
    });
  }, [])

  useEffect(() => {
    if (tenantsList) {
      const dataArray = Object.keys(tenantsList).map((key) => ({
        id: key,
        ...tenantsList[key],
      }));
      setFilteredList(dataArray.filter((data) => data.type === "Tenant"));
    }
  }, [tenantsList]);

  const getAvailableTenants = async (filteredList) => {
    const emailPromise = await AsyncStorage.getItem('@email').then(email => {
      return email
    })
    const tenants = filteredList.map((tenant) => {
      return tenant.userEmail === emailPromise && 
      {
      label: `${tenant?.firstName} ${tenant?.lastName}`,
      value: tenant?.id
    }})
    setAvailableTenantsItems(tenants)
  }

  useEffect(() => {
    if(filteredList) {
      getAvailableTenants(filteredList)
    }
  }, [filteredList])

  const isSubmitDisabled = () => {
    if(statusValue === "Available") {
      return !(assetName && assetAddress && rentalAmount && startContract && endContract >= startContract) 
    } else if(statusValue === "Rented") {
      return !(assetName && assetAddress && rentalAmount && availableTenantsValue && startContract && endContract >= startContract)
    } else return true
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <PageHeader pageTitle={`${id ? 'Update Asset' : 'Add Asset'}`} />

        <View style={styles.container}>
          <Text style={styles.label}>Type</Text>
          <DropDownPicker
            open={assetTypeOpen}
            value={assetTypeValue}
            items={assetTypeItems}
            setOpen={setAssetTypeOpen}
            setValue={setAssetTypeValue}
            setItems={setAssetTypeItems}
            placeholder="Select a type"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            dropDownStyle={styles.dropdownStyle}
            labelStyle={styles.labelStyle}
            arrowStyle={styles.arrowStyle}
          />

          <Text style={styles.label}>Asset Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your asset's name"
            value={assetName}
            onChangeText={setAssetName}
          />

          <Text style={styles.label}>Address*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the address"
            value={assetAddress}
            onChangeText={setAssetAddress}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Please add description"
            value={assetDesc}
            onChangeText={setAssetDesc}
            multiline
            numberOfLines={50}
          />

          <Text style={styles.label}>Status*</Text>
          <DropDownPicker
            open={statusOpen}
            value={statusValue}
            items={statusItems}
            setOpen={setStatusOpen}
            setValue={setStatusValue}
            setItems={setStatusItems}
            placeholder="Select Status"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            dropDownStyle={styles.dropdownStyle}
            labelStyle={styles.labelStyle}
            arrowStyle={styles.arrowStyle}
          />

          <Text style={styles.label}>Rental Amount*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the rental amount"
            value={rentalAmount}
            onChangeText={setRentalAmount}
          />

          <Text style={styles.label}>Rental Period</Text>
          <DropDownPicker
            open={rentalPeriodOpen}
            value={rentalPeriodValue}
            items={rentalPeriodItems}
            setOpen={setRentalPeriodOpen}
            setValue={setRentalPeriodValue}
            setItems={setRentalPeriodItems}
            placeholder="Select Rental Period"
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            dropDownStyle={styles.dropdownStyle}
            labelStyle={styles.labelStyle}
            arrowStyle={styles.arrowStyle}
          />

          <SafeAreaProvider>
            <SafeAreaView style={{backfaceVisibility: "visible"}}>
              <Text style={styles.label}>
                Contract Start
              </Text>
              <DateTimePicker
                mode="single"
                date={startContract}
                onChange={(params) => setStartContract(params.date)}
              />
            </SafeAreaView>
          </SafeAreaProvider>

          <SafeAreaProvider>
            <SafeAreaView style={{backfaceVisibility: "visible"}}>
              <Text style={styles.label}>
                Contract Expiration
              </Text>
              <DateTimePicker
                mode="single"
                date={endContract}
                onChange={(params) => setEndContract(params.date)}
                minDate={startContract}
              />
            </SafeAreaView>
          </SafeAreaProvider>

          <Text style={styles.label}>Tenant*</Text>
          <DropDownPicker
            open={availableTenantsOpen}
            value={availableTenantsValue}
            items={availableTenantsItems}
            setOpen={setAvailableTenantsOpen}
            setValue={setAvailableTenantsValue}
            setItems={setAvailableTenantsItems}
            placeholder="Select a tenant"
            disabled={statusValue === "Available" || statusValue === null}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            dropDownStyle={styles.dropdownStyle}
            labelStyle={styles.labelStyle}
            arrowStyle={styles.arrowStyle}
          />

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.label}>Active</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>

          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={isSubmitDisabled()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    paddingBottom: 10,
  },
  dropdown: {
    borderColor: "gray",
    borderWidth: 1,
  },
  dropdownStyle: {
    backgroundColor: "#fafafa",
  },
  labelStyle: {
    fontSize: 16,
  },
  arrowStyle: {
    width: 20,
    height: 20,
  },

  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});

export default AssetForm;
