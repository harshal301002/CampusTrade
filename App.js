import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./AuthScreen";
import SignupScreen from "./SignupScreen";
import HomeScreen from "./HomeScreen";
import ProductDetailsScreen from "./ProductDetailsScreen";
import AddProductScreen from "./AddProductScreen"; // ✅ Ensure this is correctly imported

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Sign Up" }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: "Product Details" }} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: "Add Product" }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
