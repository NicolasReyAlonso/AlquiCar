import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import VehicleCard from "@/components/templates/VehicleCard"; // Importamos VehicleCard

export default function VehicleDetails() {
  const { id } = useLocalSearchParams(); // Obtiene el ID del vehículo desde la URL
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`http://localhost:3000/vehicles/${id}`);
        const data = await response.json();
        setVehicle(data[0]); // Obtiene el primer vehículo del array
      } catch (error) {
        console.error("Error al obtener el vehículo:", error);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (!vehicle) return <Text style={{ color: 'red', fontSize: 20 }}>Cargando vehículo...</Text>;

  return (
    <View>
      <VehicleCard
        brand={vehicle.brand}
        seats={vehicle.capacity}
        type={vehicle.type}
        mileage={vehicle.mileage || "Desconocido"}
        pickupLocation={vehicle.city || "Ubicación no disponible"}
        price={`€${vehicle.daily_price}`}
        imageUrl={vehicle.imageUrl || "https://via.placeholder.com/150"}
        onReserve={() => console.log("Reserva confirmada")}
      />
    </View>
  );
}
