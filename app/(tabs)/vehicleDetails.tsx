import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import VehicleCard from "@/components/templates/VehicleCard"; 
import { useRouter } from 'expo-router';

export default function VehicleDetails() {
  const { id } = useLocalSearchParams(); 
  const [vehicle, setVehicle] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`https://localhost:3000/vehicles/${id}`);
        const data = await response.json();
        setVehicle(data[0]); 
      } catch (error) {
        console.error("Error al obtener el vehículo:", error);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (!vehicle) return (
    <View style={styles.noVehiclesContainer}>
      <Text style={styles.noVehiclesText}>No hay vehículos disponibles en este momento.</Text>
    </View>
  );
  return (
    <View>

      <VehicleCard
        brand={vehicle.brand}
        seats={vehicle.capacity}
        type={vehicle.type}
        mileage={vehicle.mileage || "Desconocido"}
        pickupLocation={vehicle.city || "Ubicación no disponible"}
        price={`€${vehicle.daily_price}`}
        imageUrl={vehicle.imageUrl}
        onReserve={() => router.push({
          pathname: "reservarCoche", 
          params: {
            brand: vehicle.brand,
            seats: vehicle.capacity,
            type: vehicle.type,
            pickupLocation: vehicle.city || "Ubicación no disponible",
            price: `€${vehicle.daily_price}`,
            imageUrl: vehicle.imageUrl
          }
          
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noVehiclesContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 50,
  },
  noVehiclesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
  },
});
