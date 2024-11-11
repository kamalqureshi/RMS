import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { RentalDetailsCard } from "../components/RentalDetailsCard";
import { ScrollView } from "react-native-gesture-handler";
import { database } from "../firebaseConfig";
import { onValue, ref } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';


const RentalView = () => {
  const rentalsRef = ref(database);
  const [rentalsList, setRentalsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  const getFilteredList = async(dataArray) => {
    const emailPromise = await AsyncStorage.getItem('@email').then(email => {
      return email
    })
    setFilteredList(
      dataArray.filter((data) => {
        return data?.assetStatus === "Rented" && data?.userEmail === emailPromise})
    );
  }

  useEffect(() => {
    onValue(rentalsRef, (snapshot) => {
      const rentalsData = snapshot.val();
      setRentalsList(rentalsData);
    });
  }, []);

  useEffect(() => {
    if (rentalsList) {
      const dataArray = Object.keys(rentalsList).map((key) => ({
        id: key,
        ...rentalsList[key],
      }));
      getFilteredList(dataArray)
    }
  }, [rentalsList]);


  return (
    <ScrollView>
      <PageHeader pageTitle="Home" />
      {filteredList.map((data, index) => (
        <RentalDetailsCard key={index} data={data} />
      ))}
    </ScrollView>
  );
};

export default RentalView;
