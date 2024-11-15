import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { database } from "../firebaseConfig";
import { onValue, ref, set, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import { primaryBlue, primaryWhite, primaryRed } from "../constants/Colors";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false)
  const navigation = useNavigation();

  const handleLogin = async () => {
    navigation.navigate("Login");
  };

  const handleSignUp = async () => {
    const userId = uuidv4();

    try {
      await set(ref(database, `user-${userId}`), {
        email: email,
        password: password,
        type: "user",
      });
    } catch (error) {
      console.log("Error Writing to Firebase: ", error);
    }

    navigation.navigate("Login");
  };

  const validate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setEmail(text)
      setError(true)
    }
    else {
      setEmail(text)
      setError(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signup</Text>
      {error && (
        <Text style={{ fontSize: 12, color: primaryRed }}>
          Please enter a valid email
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => validate(text)}
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
      
      <TouchableOpacity style={styles.buttonContainer} disabled={error || !(email && password)} onPress={handleSignUp}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            Signup
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.LoginText}>
        User already exists.
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.Login}>Login here</Text>
        </TouchableOpacity>
      </Text>
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
    // fontWeight: "bold",
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
  LoginText: {
    display: "flex",
    marginTop: 10,
    justifyContent: "center",
  },
  Login: {
    marginTop: 3,
    marginLeft: 5,
    // fontWeight: 500,
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

export default SignupScreen;
