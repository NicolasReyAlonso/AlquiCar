import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyReservationCard from "@/components/templates/MyReservationCard";
import theme from "@/components/Theme";

const misReservas = () => {
  const [reservations, setReservations] = useState([]);

  const handleCancelReservation = async (brand) => {
    try {
      const reservasGuardadas = await AsyncStorage.getItem("reservas");
      let reservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : [];
      reservas = reservas.filter(reserva => reserva.brand !== brand);
      
      await AsyncStorage.setItem("reservas", JSON.stringify(reservas));
      setReservations(reservas);
  
      alert(`Reserva cancelada para ${brand}`);
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };
  

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const reservasGuardadas = await AsyncStorage.getItem("reservas");
        const reservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : [];

        console.log("Reservas recuperadas en MisReservas.js:", reservas); 

        setReservations(reservas);
      } catch (error) {
        console.error("Error al cargar las reservas:", error);
      }
    };

    cargarReservas();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {reservations.length === 0 ? (
        <Text style={styles.emptyText}>No tienes reservas aún.</Text>
      ) : (
        reservations.map((reservation, index) => (
          <View key={index} style={styles.cardWrapper}>
            <MyReservationCard
              brand={reservation.brand}
              price={reservation.price}
              date={reservation.date}
              status={reservation.status}
              imageUrl={reservation.imageUrl}
              onCancel={() => handleCancelReservation(reservation.brand)}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: theme.colors.background,
  },
  cardWrapper: {
    marginBottom: 15,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
});

export default misReservas;
