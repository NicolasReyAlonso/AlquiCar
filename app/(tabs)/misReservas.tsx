import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import ReservationCard from "@/components/templates/MyReservationCard";
import theme from "@/components/Theme";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MisReservas = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);

  const getUserId = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el JWT
      return payload.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

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
        const userId = await getUserId();
        if (!userId) {
          alert("Por favor, inicia sesión para ver tus reservas.");
          router.push("/login");
          return;
        }

        const response = await fetch(`http://localhost:3000/reservations/customer/${userId}`);
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