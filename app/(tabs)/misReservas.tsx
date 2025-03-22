import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import MyReservationCard from "@/components/templates/MyReservationCard";

const { width, height } = Dimensions.get('window');

const misReservas = () => {
  const reservations = [
    {
      brand: "Toyota",
      price: "€40/día",
      date: "18/03/2025",
      status: "Confirmada",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
    {
      brand: "Honda",
      price: "€45/día",
      date: "19/03/2025",
      status: "Pendiente",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
    {
      brand: "Ford",
      price: "€35/día",
      date: "20/03/2025",
      status: "Confirmada",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
    {
      brand: "BMW",
      price: "€80/día",
      date: "21/03/2025",
      status: "Confirmada",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Generar las tarjetas */}
      {reservations.map((reservation, index) => (
        <View key={index} style={styles.cardWrapper}>
          <MyReservationCard
            brand={reservation.brand}
            price={reservation.price}
            date={reservation.date}
            status={reservation.status}
            imageUrl={reservation.imageUrl}
            onCancel={() => alert(`Reserva cancelada para ${reservation.brand}`)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    flexWrap: "wrap", // que pasen a la siguiente fila si no caben
    justifyContent: "space-between", 
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  cardWrapper: {
    width: width < 500 ? "100%" : "48%", 
    marginBottom: 15, 
  },
});

export default misReservas;
