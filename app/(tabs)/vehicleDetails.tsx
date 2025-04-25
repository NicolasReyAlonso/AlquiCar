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
        console.log("ID del vehículo recibido:", id); 
        const response = await fetch(`https://localhost:3000/vehicles/${id}`); 
        const data = await response.json();
        if (data && data.length > 0) {
          setVehicle(data[0]); 
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
      <View style={styles.noVehiclesContainer}>
        <Text style={styles.noVehiclesText}>
          No hay vehículos disponibles en este momento.
        </Text>
      </View>
    );
  }

  return (
    <VehicleCard
      brand={vehicle.brand}
      model={vehicle.model}
      year={vehicle.year}
      seats={vehicle.capacity}
      type={vehicle.type}
      transmission={vehicle.transmission}
      fuelType={vehicle.fuel_type}
      numDoors={vehicle.num_doors}
      deposit={`€${vehicle.deposit}`}
      mileage={vehicle.mileage || "Desconocido"}
      pickupLocation={vehicle.city || "Ubicación no disponible"}
      price={`€${vehicle.daily_price}`}
      imageUrl={vehicle.imageUrl}
      onReserve={() => {
        console.log("Navegando al componente de reserva con ID:", id); 
        router.push({
          pathname: "reservarCoche", 
          params: {
            vehicleId: id, 
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            seats: vehicle.capacity,
            type: vehicle.type,
            transmission: vehicle.transmission,
            fuelType: vehicle.fuel_type,
            numDoors: vehicle.num_doors,
            deposit: `€${vehicle.deposit}`,
            price: `€${vehicle.daily_price}`,
            imageUrl: vehicle.imageUrl,
          },
        });
      }}
    />
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
