import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import ReservationCard from "@/components/templates/MyReservationCard";
import theme from "@/components/Theme";
import { useRouter } from "expo-router";

import {  } from "expo-router"; 

const MisReservas = () => {
  const router = useRouter(); 
  const [reservations, setReservations] = useState([]);

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:3000/reservations/${reservationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReservations(reservations.filter((reserva) => reserva.id !== reservationId));
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
        const response = await fetch(
          "http://localhost:3000/reservations/customer/234e4567-e89b-12d3-a456-426614174111"
        );
        const reservas = await response.json();

        const reservasConVehiculos = await Promise.all(
          reservas.map(async (reserva) => {
            try {
              const vehicleResponse = await fetch(`http://localhost:3000/vehicles/${reserva.vehicle_id}`);
              const vehicleData = await vehicleResponse.json();

              const vehicle = Array.isArray(vehicleData) ? vehicleData[0] : vehicleData;

              return {
                ...reserva,
                vehicleBrand: vehicle.brand || "Marca desconocida",
                imageUrl: vehicle.imageUrl || "http://via.placeholder.com/150",
              };
            } catch (vehicleError) {
              return {
                ...reserva,
                vehicleBrand: "Marca desconocida",
                imageUrl: "http://via.placeholder.com/150",
              };
            }
          })
        );

        setReservations(reservasConVehiculos);
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
        reservations.map((reservation) => (
          <View key={reservation.id} style={styles.cardWrapper}>
            <ReservationCard
              brand={reservation.vehicleBrand}
              price={`${reservation.total_price}€`}
              date={`${new Date(reservation.start_date).toLocaleDateString()} - ${new Date(
                reservation.end_date
              ).toLocaleDateString()}`}
              status={reservation.status === "Pending" ? "Pendiente" : "Cancelada"}
              imageUrl={reservation.imageUrl || "http://via.placeholder.com/150"}
              onCancel={() => handleCancelReservation(reservation.id)}
              onPress={() => router.push({ pathname: "/detallesReserva", params: { id: reservation.id } })}
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

export default MisReservas;
