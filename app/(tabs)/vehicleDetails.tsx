import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import VehicleCard from "@/components/templates/VehicleCard"; 
import { useRouter } from 'expo-router';

export default function VehicleDetails() {
  const { id } = useLocalSearchParams(); // Obtiene el ID del vehículo de los parámetros
  const [vehicle, setVehicle] = useState(null);
  const router = useRouter(); // Para navegación

  useEffect(() => {
    // Función para obtener los detalles del vehículo desde el backend
    const fetchVehicle = async () => {
      try {
        console.log("ID del vehículo recibido:", id); // Depuración del ID
        const response = await fetch(`https://localhost:3000/vehicles/${id}`); // Cambia a HTTP si SSL no está configurado
        const data = await response.json();
        if (data && data.length > 0) {
          setVehicle(data[0]); // Asigna los datos del vehículo al estado
        } else {
          console.error("No se encontraron datos del vehículo con este ID");
        }
      } catch (error) {
        console.error("Error al obtener el vehículo:", error);
      }
    };

    if (id) {
      fetchVehicle(); // Llama a la función solo si el ID está definido
    }
  }, [id]);

  // Manejo de errores o ausencia de datos
  if (!vehicle) {
    return (
      <View style={styles.noVehiclesContainer}>
        <Text style={styles.noVehiclesText}>
          No hay vehículos disponibles en este momento.
        </Text>
      </View>
    );
  }

  // Renderiza la tarjeta del vehículo con la opción de reservar
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
      // Navegación al componente de reserva al presionar "Reservar"
      onReserve={() => {
        console.log("Navegando al componente de reserva con ID:", id); // Confirmación de depuración
        router.push({
          pathname: "reservarCoche", // Ruta al componente de reserva
          params: {
            vehicleId: id, // Pasa el ID del vehículo como parámetro
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
