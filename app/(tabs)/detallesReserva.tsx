import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from "expo-router";

export default function DetallesReserva() {
  const { id } = useLocalSearchParams();
  const [reservation, setReservation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [owner, setOwner] = useState(null); // Estado para el propietario
  const router = useRouter();

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const reservationResponse = await fetch(`http://localhost:3000/reservations/${id}`);
        const reservationData = await reservationResponse.json();

        const reservation = Array.isArray(reservationData) ? reservationData[0] : reservationData;
        setReservation(reservation);

        if (reservation && reservation.vehicle_id) {
          const vehicleResponse = await fetch(`http://localhost:3000/vehicles/${reservation.vehicle_id}`);
          const vehicleData = await vehicleResponse.json();

          const vehicle = Array.isArray(vehicleData) ? vehicleData[0] : vehicleData;
          setVehicle(vehicle);

          if (vehicle && vehicle.owner_id) {
            const ownerResponse = await fetch(`http://localhost:3000/users/${vehicle.owner_id}`,{
              method: 'GET',
              credentials: 'include'
            }); // Cambiar a /users/
            const ownerData = await ownerResponse.json();
            console.log("Datos del propietario:", ownerData); 
            setOwner(ownerData);
          }
        } else {
          console.error("El campo 'vehicle_id' está undefined en la reserva cargada:", reservation);
        }
      } catch (error) {
        console.error("Error al cargar los detalles de la reserva o del vehículo:", error);
      }
    };

    if (id) {
      fetchReservationDetails();
    }
  }, [id]);

  if (!reservation || !vehicle) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {reservation && !vehicle ? "No se pudieron cargar los datos del vehículo." : "Cargando detalles de la reserva..."}
        </Text>
      </View>
    );
  }

  const statusBackgroundColor = reservation.status === "Cancelled" ? "#F2DEDE" : "#DFF0D8";
  const statusTextColor = reservation.status === "Cancelled" ? "#A94442" : "#3C763D";

  return (
    <ScrollView style={styles.container}>
      {/* Imagen principal */}
      <Image source={{ uri: vehicle.imageUrl || "http://via.placeholder.com/150" }} style={styles.mainImage} />
      <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
      <Text style={styles.subtitle}>{vehicle.year}</Text>

      <View style={styles.detailsContainer}>
        <View style={[styles.statusContainer, { backgroundColor: statusBackgroundColor }]}>
          <Text style={[styles.statusText, { color: statusTextColor }]}>
            {reservation.status === "Cancelled" ? "Cancelada" : "Activa"}
          </Text>
        </View>
        <Text style={styles.sectionTitle}>Detalles de la Reserva:</Text>
        <Text style={styles.detailText}>
          Fechas: {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
        </Text>
        <Text style={styles.detailText}>Precio Total: {`€${reservation.total_price}`}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Detalles del Vehículo:</Text>
        <Text style={styles.detailText}>Capacidad: {vehicle.capacity} pasajeros</Text>
        <Text style={styles.detailText}>Tipo: {vehicle.type}</Text>
        <Text style={styles.detailText}>Transmisión: {vehicle.transmission}</Text>
        <Text style={styles.detailText}>Combustible: {vehicle.fuel_type}</Text>
        <Text style={styles.detailText}>Número de Puertas: {vehicle.num_doors}</Text>
        <Text style={styles.detailText}>Depósito: {`€${vehicle.deposit}`}</Text>
        <Text style={styles.detailText}>Precio por Día: {`€${vehicle.daily_price}`}</Text>
        <Text style={styles.detailText}>Publicado por: {owner?.name || "Desconocido"}</Text> {/* Mostrar el propietario */}
      </View>

      {/* Galería de fotos */}
      <View style={styles.galleryContainer}>
        <Text style={styles.sectionTitle}>Galería de Fotos:</Text>
        {vehicle.galleryImages?.length > 0 ? (
          vehicle.galleryImages.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
          ))
        ) : (
          <Text style={styles.noGalleryText}>No hay fotos adicionales disponibles.</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/misReservas")} // Navegar a MisReservas
      >
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  statusContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  galleryContainer: {
    marginBottom: 20,
  },
  galleryImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  noGalleryText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: "#3B6ED5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "gray",
  },
});
