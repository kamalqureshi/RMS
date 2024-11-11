import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { ScrollView, View, Text, StyleSheet, Button , TextInput} from "react-native";
import { database } from "../firebaseConfig";
import { onValue, ref, update } from "firebase/database";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileView() {

    const [isChangePassword, setIsChangePassword] = useState(false)
    const [isEditInformation, setIsEditInformation] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userList, setUserList] = useState([])
    const [user, setUser] = useState([])

    const setUserEmail = async (dataArray) => {
        const emailPromise = await AsyncStorage.getItem('@email').then(email => {
            return email
        })
        setUser(dataArray.filter((data) => data.type === "user" && data.email === emailPromise));
    }

    useEffect(() => {
        onValue(ref(database), (snapshot) => {
          const usersData = snapshot.val();
          setUserList(usersData);
        });
      }, []);
    
      useEffect(() => {
        if (userList) {
          const dataArray = Object.keys(userList).map((key) => ({
            id: key,
            ...userList[key],
          }));
          setUserEmail(dataArray)
        }
      }, [userList]);

    const onCancelEditInformation = () => {
        if(isEditInformation){
            setFirstName("")
            setLastName("")
        }
        setIsEditInformation(!isEditInformation)
    }

    const onEditInformation = async () => {
        try {
            await update(ref(database, `${user[0]?.id}`), {
                firstName: firstName,
                lastName: lastName
            })
        } catch(error) {
            console.error("Error writing to Firebase:", error);
        }

        setFirstName("")
        setLastName("")
        setIsEditInformation(!isEditInformation)
    }
    const onChangePassword = async() => {
        try {
            await update(ref(database, `${user[0]?.id}`), {
                password: password
            })
        } catch(error) {
            console.error("Error writing to Firebase:", error);
        }
        setIsChangePassword(!isChangePassword)
    }

    return (
        <>
            <ScrollView>
                <PageHeader pageTitle="My Profile" />

                <View>
                    <Text style={styles.heading}>Personal Information

                    <TouchableOpacity onPress={() => onCancelEditInformation()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>{isEditInformation ? 'Cancel' : 'Edit'}</Text>
                        </View>                    
                    </TouchableOpacity>
                </Text>
                </View>

                {isEditInformation 
                ? (<View> 
                    <Text style={styles.label}>First Name</Text>
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

                    <Button
                        title="Submit"
                        disabled={firstName === ""}
                        onPress={()=>onEditInformation()}
                    />
                </View>) 
                : (<View>
                    <Text style={styles.labelHeading}>
                        First Name: 
                        <Text style={styles.labelText}> {user[0]?.firstName ?? '-'}</Text>
                    </Text>
                    <Text style={styles.labelHeading}>
                        Last Name: 
                        <Text style={styles.labelText}> {user[0]?.lastName ?? '-'}</Text>
                    </Text>
                    <Text style={styles.labelHeading}>
                        Email: 
                        <Text style={styles.labelText}> {user[0]?.email}</Text>
                    </Text>
                    </View>
                )}

                <View style={{marginTop: 50}}>
                    <Text style={styles.heading}>Credentails</Text>
                </View>

                <View>
                    <TouchableOpacity onPress={()=>{setIsChangePassword(!isChangePassword)}}>
                        <View style={styles.passwordButton}>
                            <Text style={styles.buttonText}>{isChangePassword ? "Cancel" : "Change Password"}</Text>
                        </View>                    
                    </TouchableOpacity>
                </View>
                {isChangePassword && (
                    <View style={styles.container}>
                        <TextInput 
                            placeholder="Enter new password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                        /> 
                        <TextInput 
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            style={styles.input}
                        /> 
                        <Button
                            title="Submit"
                            disabled={password === "" || password !== confirmPassword}
                            onPress={()=>onChangePassword()}
                        />
                    </View>
                )}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    labelStyle: {
      fontSize: 16,
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
      fontWeight: "500",
      marginBottom: 5,
      marginTop: 10,
      textAlign: "left"
    },
    labelHeading: {
      fontSize: 20,
      fontWeight: "400",
      marginBottom: 10,
      
    },
    labelText: {
        fontSize: 20,   
        fontWeight: "200",
        marginBottom: 5,
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginLeft: 25
    },
    buttonText: {
        color: '#FFFFFF', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    passwordButton: {
        backgroundColor: '#1E90FF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: 600,
        alignSelf: 'center',
        marginBottom: 10
    },
    input: {
      height: 50,
      borderColor: "#ccc",
      borderWidth: 1.5,
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
  });