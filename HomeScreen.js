import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { supabase } from "./supabase";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Error fetching products:", error.message);
    } else {
      setProducts(data);
    }

    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        CampusTrade Marketplace
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : products.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 18, color: "gray" }}>
          No products available. Add one!
        </Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetails", { product: item })}
              style={{
                flexDirection: "row",
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#ddd",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.image || "https://via.placeholder.com/100" }}
                style={{ width: 80, height: 80, marginRight: 10, borderRadius: 10 }}
              />
              <View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
                <Text style={{ color: "gray" }}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

<TouchableOpacity
  onPress={() => navigation.navigate("AddProduct")}
  style={{
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 50,
  }}
>
  <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>+</Text>
</TouchableOpacity>

    </View>
  );
};

export default HomeScreen;
