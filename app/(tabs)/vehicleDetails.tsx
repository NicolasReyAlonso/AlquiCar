import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
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
        const response = await fetch(`http://localhost:3000/vehicles/${id}`);
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
        onReserve={() => router.push({
          pathname: "reservarCoche", 
          params: {
            brand: vehicle.brand,
            seats: vehicle.capacity,
            type: vehicle.type,
            pickupLocation: vehicle.city || "Ubicación no disponible",
            price: `€${vehicle.daily_price}`,
            imageUrl: vehicle.imageUrl || "https://via.placeholder.com/150"
          }
        })}
      />
    </View>
  );
}
