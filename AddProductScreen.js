import * as ImagePicker from "expo-image-picker"; 
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { supabase } from "./supabase";
import RNFetchBlob from "react-native-blob-util";
import { useNavigation } from "@react-navigation/native";

const AddProductScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick an image from the device
  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photos to proceed.');
      return;
    }
  
    // Launch image library to pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      console.log('Selected image URI:', result.assets[0].uri);
      setImage(result.assets[0].uri);
    } else {
      console.log('Image selection was canceled.');
    }
  };
  
  const uploadImage = async () => {
    if (!image) {
      console.error("❌ No image selected.");
      return null;
    }
  
    try {
      console.log("✅ Image URI:", image);
      const fileName = `products/${Date.now()}.jpg`;
  
      // Convert local image URI to a format Supabase accepts
      const imageData = await RNFetchBlob.fs.readFile(image.replace("file://", ""), "base64");
  
      // Upload to Supabase Storage
      console.log("🚀 Uploading image to Supabase...");
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageData, {
          contentType: "image/jpeg",
          upsert: true, // Overwrite if exists
        });
  
      if (error) {
        console.error("❌ Supabase Upload Error:", error.message);
        Alert.alert("Upload Failed", `Error: ${error.message}`);
        return null;
      }
  
      console.log("✅ Image uploaded successfully:", data);
  
      // Retrieve the public URL for the uploaded image
      const { data: urlData } = await supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
  
      if (!urlData) {
        throw new Error("❌ Failed to retrieve public URL");
      }
  
      console.log("✅ Public Image URL:", urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error("❌ Image Upload Failed:", error.message);
      Alert.alert("Upload Failed", "An error occurred while uploading.");
      return null;
    }
  };
  
  const addProduct = async () => {
    console.log("🚀 Starting product addition...");
  
    if (!title || !description || !price) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
  
    if (isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid number for the price.");
      return;
    }
  
    setLoading(true);
    let imageUrl = null;
  
    try {
      if (image) {
        console.log("📸 Uploading image...");
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error("❌ Image upload failed");
        }
        console.log("✅ Image uploaded successfully:", imageUrl);
      }
  
      console.log("📝 Inserting product into Supabase...");
      const { data, error } = await supabase.from("products").insert([
        { title, description, price: parseFloat(price), image: imageUrl },
      ]);
  
      if (error) {
        console.error("❌ Database Insert Error:", error.message);
        Alert.alert("Database Error", error.message);
        throw error;
      }
  
      console.log("✅ Product added successfully!", data);
      Alert.alert("Success", "Product added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error adding product:", error.message);
      Alert.alert("Error", `Failed to add product: ${error.message}`);
    }
  
    setLoading(false);
  };
  
  
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
          Add a New Product
        </Text>

        <TextInput
          placeholder="Product Title"
          onChangeText={setTitle}
          value={title}
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        <TextInput
          placeholder="Description"
          onChangeText={setDescription}
          value={description}
          multiline
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        <TextInput
          placeholder="Price ($)"
          onChangeText={setPrice}
          value={price}
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        />

        <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "gray", padding: 10, marginBottom: 10 }}>
          <Text style={{ color: "white", textAlign: "center" }}>Pick an Image</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={{ width: "100%", height: 200, marginBottom: 10 }} />}

        <TouchableOpacity
          onPress={addProduct}
          style={{ backgroundColor: "blue", padding: 15, borderRadius: 5, marginBottom: 20 }}
          disabled={loading}
        >
          <Text style={{ color: "white", textAlign: "center" }}>{loading ? "Adding..." : "Add Product"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default AddProductScreen;
