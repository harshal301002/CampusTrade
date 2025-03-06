import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "./supabase";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validate email
    if (!email.endsWith(".edu")) {
      Alert.alert("Error", "Only university emails are allowed (must end with .edu)");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Signup Failed", error.message);
    } else {
      Alert.alert("Success!", "Check your email to verify your account.");
      navigation.replace("Auth"); // Redirect to login page after signup
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>CampusTrade Signup</Text>
      
      <TextInput
        placeholder="University Email"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        placeholder="Password (min 6 characters)"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <TextInput
        placeholder="Confirm Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      
      <TouchableOpacity onPress={handleSignUp} style={{ backgroundColor: "blue", padding: 15, borderRadius: 5 }}>
        <Text style={{ color: "white", textAlign: "center" }}>{loading ? "Signing up..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Auth")} style={{ marginTop: 10 }}>
        <Text style={{ color: "blue", textAlign: "center" }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
