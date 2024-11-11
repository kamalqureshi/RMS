import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "../components/Card";
import { ScrollView, Text } from "react-native";
import { AddButton } from "../components/AddButton";
import { database } from "../firebaseConfig";
import { onValue, ref } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function AssetView() {
  const assetsRef = ref(database);
  const [assetsList, setAssetsList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    onValue(assetsRef, (snapshot) => {
      const assetsData = snapshot.val();
      setAssetsList(assetsData);
    });
  }, []);

  const getFilteredList = async(dataArray) => {
    const emailPromise = await AsyncStorage.getItem('@email').then(email => {
      return email
    })
    setFilteredList(
      dataArray.filter((data) => {
        return data.type === "Asset" && data?.userEmail === emailPromise})
    );
    setIsLoading(false)
  }

  useEffect(() => {
    if (assetsList) {
      const dataArray = Object.keys(assetsList).map((key) => ({
        id: key,
        ...assetsList[key],
      }));
      getFilteredList(dataArray)
    }
  }, [assetsList]);

  return (
    <>
      <PageHeader pageTitle="Assets" />
      <ScrollView>
      { isLoading 
          ? <Text>Loading</Text> 
          : <Card isAsset={true} data={filteredList} />
        }
        <AddButton label="Add Asset" isAsset={true} />
      </ScrollView>
    </>
  );
}
