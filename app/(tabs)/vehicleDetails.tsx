import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import VehicleCard from "@/components/templates/VehicleCard"; 
import { useRouter } from 'expo-router';

export default function VehicleDetails() {
  const { id, vehicles: vehiclesParam } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Si tenemos parámetro vehicles (búsqueda múltiple)
    if (vehiclesParam) {
      try {
        const parsedVehicles = JSON.parse(vehiclesParam);
        setVehicles(Array.isArray(parsedVehicles) ? parsedVehicles : []);
        return;
      } catch (error) {
        console.error("Error al parsear vehículos:", error);
      }
    }

    // Si tenemos ID (búsqueda individual)
    if (id) {
      const fetchVehicle = async () => {
        try {
          console.log("ID del vehículo recibido:", id); 
          const response = await fetch(`http://localhost:3000/vehicles/${id}`); 
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
      fetchVehicle();
    }
  }, [id, vehiclesParam]);

  // Mostrar lista si hay múltiples vehículos
  if (vehicles.length > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultsTitle}>Vehículos encontrados: {vehicles.length}</Text>
        
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <VehicleCard
              brand={item.brand}
              model={item.model}
              year={item.year}
              seats={item.capacity}
              type={item.type}
              transmission={item.transmission}
              fuelType={item.fuel_type}
              numDoors={item.num_doors}
              deposit={`€${item.deposit}`}
              mileage={item.mileage || "Desconocido"}
              pickupLocation={item.city || "Ubicación no disponible"}
              vehicleId={item.id}
              price={`€${item.daily_price}`}
              imageUrl={item.imageUrl}
              onReserve={() => {
                router.push({
                  pathname: "reservarCoche",
                  params: {
                    vehicleId: item.id,
                    brand: item.brand,
                    model: item.model,
                    year: item.year,
                    seats: item.capacity,
                    type: item.type,
                    transmission: item.transmission,
                    fuelType: item.fuel_type,
                    numDoors: item.num_doors,
                    deposit: `€${item.deposit}`,
                    price: `€${item.daily_price}`,
                    imageUrl: item.imageUrl,
                  },
                });
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }

  // Mostrar vehículo individual si existe
  if (vehicle) {
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
        vehicleId={id}
        price={`€${vehicle.daily_price}`}
        imageUrl={vehicle.imageUrl}
        onReserve={() => {
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

  // Mostrar mensaje si no hay vehículos
  return (
    <View style={styles.noVehiclesContainer}>
      <Text style={styles.noVehiclesText}>
        No hay vehículos disponibles con los criterios seleccionados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  noVehiclesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noVehiclesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#888",
    textAlign: "center",
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
});