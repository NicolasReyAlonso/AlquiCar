import React from "react";
import { View, ScrollView, Dimensions, StyleSheet } from "react-native";
import MyPublishedVehicles from "@/components/templates/MyPublishedVehicles";
import theme from "@/components/Theme";

const { width, height } = Dimensions.get('window');

const misCochesPublicados = () => {
  const publishedVehicles = [
    {
      brand: "Toyota",
      price: "€40",
      city: "Madrid",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
    {
      brand: "Honda",
      price: "€45",
      city: "Barcelona",
      imageUrl: "https://a.ccdn.es/cnet/contents/media/honda/civic/1159931.jpg"
    },
    {
      brand: "Ford",
      price: "€35",
      city: "Valencia",
      imageUrl: "https://images.prismic.io/carwow/1e66c2e9-e6b7-4d21-be92-79e80403feaf_LHD+Ford+Focus+2022+Exterior-1.jpg?auto=format&cs=tinysrgb&fit=crop&q=60&w=750.jpg"
    },
    {
      brand: "BMW",
      price: "€80",
      city: "Sevilla",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9KXga-3enJCVZRftu89iBe1LIyl0GYHvHMQ&s.jpg"
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {publishedVehicles.map((vehicle, index) => (
        <View key={index} style={styles.cardWrapper}>
          <MyPublishedVehicles
            brand={vehicle.brand}
            price={vehicle.price}
            city={vehicle.city}
            imageUrl={vehicle.imageUrl}
            onCancel={() => alert(`Vehículo eliminado: ${vehicle.brand}`)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
    padding: 20,
    backgroundColor: theme.colors.background, 
  },
  cardWrapper: {
    width: width < 500 ? "100%" : "48%", 
    marginBottom: 15, 
  },
});

export default misCochesPublicados;
