import React from "react";
import { View, ScrollView, Dimensions, StyleSheet } from "react-native";
import MyPublishedVehicles from "@/components/templates/MyPublishedVehicles";

const { width, height } = Dimensions.get('window');

const misCochesPublicados = () => {
  const publishedVehicles = [
    {
      brand: "Toyota",
      price: "€40/día",
      city: "Madrid",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
    {
      brand: "Honda",
      price: "€45/día",
      city: "Barcelona",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
    {
      brand: "Ford",
      price: "€35/día",
      city: "Valencia",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
    {
      brand: "BMW",
      price: "€80/día",
      city: "Sevilla",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
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
    backgroundColor: "white", 
  },
  cardWrapper: {
    width: width < 500 ? "100%" : "48%", 
    marginBottom: 15, 
  },
});

export default misCochesPublicados;
