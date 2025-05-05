import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import VehicleCard from "@/components/templates/VehicleCard"; 
import { useRouter } from 'expo-router';
import { useTranslation } from "react-i18next";


export default function VehicleDetails() {
  const { id, vehicles: vehiclesParam } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const router = useRouter();
  const { t } = useTranslation();
  

  useEffect(() => {
    const fetchImageUrl = async (ownerId: string, vehicleId: string) => {
      try {
        const res = await fetch(`http://localhost:3000/media/vehicles/${ownerId}/${vehicleId}`);
        const images = await res.json();
        return images.length > 0 && images[0].data ? images[0].data : "http://via.placeholder.com/150";
      } catch (err) {
        console.warn(`No se pudo cargar la imagen del vehículo ${vehicleId}`, err);
        return "http://via.placeholder.com/150";
      }
    };
  
    const loadVehiclesWithImages = async (vehiclesData) => {
      const enrichedVehicles = await Promise.all(
        vehiclesData.map(async (v) => ({
          ...v,
          imageUrl: await fetchImageUrl(v.owner_id, v.id),
        }))
      );
      setVehicles(enrichedVehicles);
    };
  
    const loadSingleVehicleWithImage = async (vehicleData) => {
      const imageUrl = await fetchImageUrl(vehicleData.owner_id, vehicleData.id);
      setVehicle({ ...vehicleData, imageUrl });
    };
  
    // Si tenemos parámetro vehicles (búsqueda múltiple)
    if (vehiclesParam) {
      try {
        const parsedVehicles = JSON.parse(vehiclesParam);
        if (Array.isArray(parsedVehicles)) {
          loadVehiclesWithImages(parsedVehicles); // ← AQUÍ se llama correctamente
        } else {
          setVehicles([]);
        }
      } catch (error) {
        console.error("Error al parsear vehículos:", error);
      }
      return; // ← importante para no ejecutar también el bloque de ID
    }
  
    // Si tenemos ID (búsqueda individual)
    if (id) {
      const fetchVehicle = async () => {
        try {
          const response = await fetch(`http://localhost:3000/vehicles/${id}`);
          const data = await response.json();
          if (data && data.length > 0) {
            loadSingleVehicleWithImage(data[0]); // ← AQUÍ también se llama correctamente
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
        <Text style={styles.resultsTitle}>{t("ResultadosFiltrados.search")}: {vehicles.length}</Text>
        
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
        {t("ResultadosFiltrados.noSearch")}
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