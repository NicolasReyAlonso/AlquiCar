import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from "expo-router";

export default function VehicleDetailsPage() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        console.log("ID del vehículo recibido:", id);
        const response = await fetch(`https://localhost:3000/vehicles/${id}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setVehicle(data[0]);
          console.log("Datos del vehículo asignados:", data[0]);
        } else {
          console.error("No se encontraron datos del vehículo con este ID");
        }
      } catch (error) {
        console.error("Error al obtener el vehículo:", error);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (!vehicle) {
    return (
      <View style={styles.noVehicleContainer}>
        <Text style={styles.noVehicleText}>No se encuentran datos del vehículo.</Text>
      </View>
    );
  }

  const availabilityBackgroundColor = vehicle.availability === 1 ? "#DFF0D8" : "#F2DEDE";
  const availabilityTextColor = vehicle.availability === 1 ? "#3C763D" : "#A94442";

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: vehicle.imageUrl }} style={styles.mainImage} />
      <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
      <Text style={styles.subtitle}>{vehicle.year}</Text>

      <View style={styles.detailsContainer}>
        {/* Disponibilidad destacada */}
        <View style={[styles.availabilityContainer, { backgroundColor: availabilityBackgroundColor }]}>
          <Text style={[styles.availabilityText, { color: availabilityTextColor }]}>
            {vehicle.availability === 1 ? "¡Disponible!" : "No disponible"}
          </Text>
        </View>

        {/* Otros detalles */}
        <Text style={styles.sectionTitle}>Detalles del Vehículo:</Text>
        <Text style={styles.detailText}>Capacidad: {vehicle.capacity} pasajeros</Text>
        <Text style={styles.detailText}>Tipo: {vehicle.type}</Text>
        <Text style={styles.detailText}>Transmisión: {vehicle.transmission}</Text>
        <Text style={styles.detailText}>Combustible: {vehicle.fuel_type}</Text>
        <Text style={styles.detailText}>Número de Puertas: {vehicle.num_doors}</Text>
        <Text style={styles.detailText}>Depósito: {`€${vehicle.deposit}`}</Text>
        <Text style={styles.detailText}>Precio por Día: {`€${vehicle.daily_price}`}</Text>
      </View>

      <View style={styles.galleryContainer}>
        <Text style={styles.sectionTitle}>Galería de Fotos:</Text>
        {vehicle.galleryImages?.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
        )) || <Text style={styles.noGalleryText}>No hay fotos adicionales disponibles.</Text>}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          router.push({
            pathname: "reservarCoche",
            params: {
              vehicleId: vehicle.id,
              brand: vehicle.brand,
              model: vehicle.model,
              year: vehicle.year,
              seats: vehicle.capacity,
              type: vehicle.type,
              transmission: vehicle.transmission,
              fuelType: vehicle.fuel_type,
              numDoors: vehicle.num_doors,
              deposit: vehicle.deposit,
              price: vehicle.daily_price,
              imageUrl: vehicle.imageUrl,
            },
          })
        }
      >
        <Text style={styles.backButtonText}>Reservar</Text>
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
  availabilityContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  availabilityText: {
    fontSize: 20,
    fontWeight: "bold",
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
  noVehicleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVehicleText: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
  },
});
