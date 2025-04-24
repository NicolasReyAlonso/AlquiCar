import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import MyReservationCard from "@/components/templates/MyReservationCard";
import theme from "@/components/Theme";

const misReservas = () => {
  const [reservations, setReservations] = useState([]);

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`https://localhost:3000/reservations/${reservationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReservations(reservations.filter(reserva => reserva.id !== reservationId));
        alert("Reserva cancelada correctamente");
      } else {
        alert("Error al cancelar la reserva");
      }
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const response = await fetch("https://localhost:3000/reservations/customer/234e4567-e89b-12d3-a456-426614174111");
        const reservas = await response.json();
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
              price={`${reservation.total_price}€`}
              date={`${new Date(reservation.start_date).toLocaleDateString()} - ${new Date(reservation.end_date).toLocaleDateString()}`}
              status={reservation.status || "Activa"}
              imageUrl={reservation.imageUrl}
              onCancel={() => handleCancelReservation(reservation.id)}
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
