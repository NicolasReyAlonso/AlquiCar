import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import ReservationCard from "@/components/templates/MyReservationCard";
import theme from "@/components/Theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { use } from "i18next";

interface Reservation {
  id: number;
  status: string;
  vehicleBrand: string;
  imageUrl: string;
  total_price: number;
  start_date: string;
  end_date: string;
  vehicle_id: number;
  ownerId?: string;
}

const MisReservas = () => {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeTab, setActiveTab] = useState("Activas"); 
  const {id, status} = useLocalSearchParams(); 

  const getUserId = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      return payload.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/reservations/${reservationId}`, {
        method: "PATCH",
        credentials: "include", //cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }), 
      });
  
      if (response.ok) {
        const updatedReservation = await response.json();
        console.log("Reserva actualizada:", updatedReservation);
  
        setReservations(
          reservations.map((reserva) =>
            reserva.id === reservationId ? { ...reserva, status: "Cancelled" } : reserva
          )
        );
        alert("Reserva cancelada correctamente");
      } else {
        const errorData = await response.json();
        console.error("Error en la respuesta del backend:", errorData);
        alert("Error al cancelar la reserva");
      }
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      alert("Hubo un problema al cancelar la reserva.");
    }
  };

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reservations/customer`, {
          method: "GET",
          credentials: "include", 
        });
    
        if (!response.ok) {
          console.error("Error en la respuesta del servidor:", response.status, response.statusText);
          alert("Hubo un problema al cargar las reservas.");
          return;
        }
    
        const reservas = await response.json();
    
        const reservasConVehiculos = await Promise.all(
          reservas.map(async (reserva: Reservation) => {
            let imageUrl = "http://via.placeholder.com/150";
            try {
              const vehicleResponse = await fetch(`http://localhost:3000/vehicles/${reserva.vehicle_id}`);
              const vehicleData = await vehicleResponse.json();
    
              const vehicle = Array.isArray(vehicleData) ? vehicleData[0] : vehicleData;

              const imgRes = await fetch(`http://localhost:3000/media/vehicles/${vehicle.owner_id}/${vehicle.id}`);
              const images = await imgRes.json();
              if (images.length > 0 && images[0].data) {
                imageUrl = images[0].data;
              }
    
              return {
                ...reserva,
                vehicle_id: reserva.vehicle_id,
                vehicleBrand: vehicle.brand || "Marca desconocida",
                imageUrl,
                ownerId: vehicle.owner_id || null
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
  }, [id]);


  const filteredReservations =
  activeTab === "Activas"
    ? reservations.filter(
        (reserva) =>
          reserva.status.toLowerCase() === "pending" || reserva.status.toLowerCase() === "confirmed"
      )
    : reservations.filter((reserva) => reserva.status.toLowerCase() === "cancelled");
    
  return (
    
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Activas" && styles.activeTab]}
          onPress={() => setActiveTab("Activas")}
        >
          <Text style={[styles.tabText, activeTab === "Activas" && styles.activeTabText]}>Activas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Canceladas" && styles.activeTab]}
          onPress={() => setActiveTab("Canceladas")}
        >
          <Text style={[styles.tabText, activeTab === "Canceladas" && styles.activeTabText]}>Canceladas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de reservas */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredReservations.length === 0 ? (
          <Text style={styles.emptyText}>
            {activeTab === "Activas" ? "No tienes reservas activas." : "No tienes reservas canceladas."}
          </Text>
        ) : (
          filteredReservations.map((reservation) => (
            <View key={reservation.id} style={styles.cardWrapper}>
              <ReservationCard
                brand={reservation.vehicleBrand}
                price={`${reservation.total_price}€`}
                date={`${new Date(reservation.start_date).toLocaleDateString()} - ${new Date(
                  reservation.end_date
                ).toLocaleDateString()}`}
                status={reservation.status}
                imageUrl={reservation.imageUrl || "http://via.placeholder.com/150"}
                onCancel={
                  reservation.status === "Pending"
                    ? () => handleCancelReservation(reservation.id)
                    : undefined
                } 
                onPress={() => router.push({ pathname: "/detallesReserva", params: { id: reservation.id } })}
                onChatPress={() => router.push({ pathname: "/chat", params: { contactId: reservation.ownerId } })}

              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingHorizontal: 10,
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