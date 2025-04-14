import React from "react";
import { View, ScrollView, StyleSheet, Dimensions } from "react-native";
import MyReservationCard from "@/components/templates/MyReservationCard";
import theme from "@/components/Theme";

const { width, height } = Dimensions.get('window');

const misReservas = () => {
  const reservations = [
    {
      brand: "Toyota",
      price: "€40",
      date: "18/03/2025",
      status: "Confirmada",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
    },
    {
      brand: "Honda",
      price: "€45",
      date: "19/03/2025",
      status: "Pendiente",
      imageUrl: "https://a.ccdn.es/cnet/contents/media/honda/civic/1159931.jpg"
    },
    {
      brand: "Ford",
      price: "€35",
      date: "20/03/2025",
      status: "Confirmada",
      imageUrl: "https://images.prismic.io/carwow/1e66c2e9-e6b7-4d21-be92-79e80403feaf_LHD+Ford+Focus+2022+Exterior-1.jpg?auto=format&cs=tinysrgb&fit=crop&q=60&w=750.jpg"
    },
    {
      brand: "BMW",
      price: "€80",
      date: "21/03/2025",
      status: "Confirmada",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9KXga-3enJCVZRftu89iBe1LIyl0GYHvHMQ&s.jpg"
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
    backgroundColor: theme.colors.background,
  },
  cardWrapper: {
    width: width < 500 ? "100%" : "48%", 
    marginBottom: 15, 
  },
});

export default misReservas;
