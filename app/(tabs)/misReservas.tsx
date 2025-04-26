import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import ReservationCard from "@/components/templates/MyReservationCard";
import theme from "@/components/Theme";

const MisReservas = () => {
  const [reservations, setReservations] = useState([]);

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`https://localhost:3000/reservations/${reservationId}`, {
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
        // Obtener reservas del cliente
        const response = await fetch(
          "https://localhost:3000/reservations/customer/234e4567-e89b-12d3-a456-426614174111"
        );
        const reservas = await response.json();

        console.log("Reservas obtenidas del backend:", reservas); // Depuración inicial

        const reservasConVehiculos = await Promise.all(
          reservas.map(async (reserva) => {
            try {
              // Obtener detalles del vehículo asociado
              const vehicleResponse = await fetch(`https://localhost:3000/vehicles/${reserva.vehicle_id}`);
              const vehicleData = await vehicleResponse.json();

              // Accede al primer elemento si es un array
              const vehicle = Array.isArray(vehicleData) ? vehicleData[0] : vehicleData;

              console.log(`Detalles del vehículo ID ${reserva.vehicle_id}:`, vehicle); // Depuración

              return {
                ...reserva,
                vehicleBrand: vehicle.brand || "Marca desconocida",
                imageUrl: vehicle.imageUrl || "https://via.placeholder.com/150",
              };
            } catch (vehicleError) {
              console.error(`Error al obtener detalles del vehículo con ID: ${reserva.vehicle_id}`, vehicleError);
              return {
                ...reserva,
                vehicleBrand: "Marca desconocida",
                imageUrl: "https://via.placeholder.com/150",
              };
            }
          })
        );

        console.log("Reservas con detalles de vehículos:", reservasConVehiculos); // Depuración final
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
              brand={reservation.vehicleBrand} // Marca obtenida del vehículo
              price={`${reservation.total_price}€`}
              date={`${new Date(reservation.start_date).toLocaleDateString()} - ${new Date(
                reservation.end_date
              ).toLocaleDateString()}`}
              status={reservation.status === "Pending" ? "Pendiente" : "Cancelada"}
              imageUrl={reservation.imageUrl || "https://via.placeholder.com/150"} // Imagen obtenida o predeterminada
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

export default MisReservas;
