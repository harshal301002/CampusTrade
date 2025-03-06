import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "./supabase";

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      navigation.replace("Home");
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>CampusTrade Login</Text>
      
      <TextInput
        placeholder="University Email"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: "blue", padding: 15, borderRadius: 5 }}>
        <Text style={{ color: "white", textAlign: "center" }}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={{ marginTop: 10 }}>
        <Text style={{ color: "blue", textAlign: "center" }}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;
