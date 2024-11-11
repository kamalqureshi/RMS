import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { primaryBlue, primaryRed, primaryWhite } from "../constants/colors";
import { database } from "../firebaseConfig";
import { onValue, ref } from "firebase/database";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const LoginRef = ref(database);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorLogin, setIsErrorLogin] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    await AsyncStorage.setItem('@email', email);
    onValue(LoginRef, (snapshot) => {
      const loginData = snapshot.val();
      const dataArray = Object.keys(loginData).map((key) => ({
        id: key,
        ...loginData[key],
      }));
      const userFound = dataArray.find((data) => {
        if (data?.type === "user") {
          return data?.email === email && data?.password === password;
        }
        return false;
      });

      userFound
        ? (navigation.navigate("Home"),
          setEmail(""),
          setPassword(""),
          setIsErrorLogin(false))
        : setIsErrorLogin(true);
    })
  };

  const handleSignUp = () => {
    setEmail("");
    setPassword("");
    setIsErrorLogin(false);
    navigation.navigate("Signup");
  };

  useEffect(() => {
    setIsErrorLogin(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      {isErrorLogin && (
        <Text style={{ fontSize: 12, color: primaryRed }}>
          *Invalid Username/Password
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </View>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryBlue,
    marginBottom: 1
  },
  button: {
    backgroundColor: primaryBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: primaryWhite,
    fontSize: 16,
  },
});

export default LoginScreen;
