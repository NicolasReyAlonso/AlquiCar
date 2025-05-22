import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import VehicleCard from "@/components/templates/VehicleCard"; 
import { useRouter } from 'expo-router';
import { useTranslation } from "react-i18next";
import { getApiUrl } from "@/utils/getApiUrl";


export default function VehicleDetails() {
  const { id, vehicles: vehiclesParam, city } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {

    const getCityFromCoords = async (lat, lon) => {
      if(!city){
        return
      }
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        return data.address.city || data.address.town || data.address.village || "";
      } catch (err) {
        console.warn("Error al obtener ciudad desde coordenadas", err);
        return "";
      }
    };

    const fetchImageUrl = async (ownerId: string, vehicleId: string) => {
      try {
        const res = await fetch(`${getApiUrl()}/media/vehicles/${ownerId}/${vehicleId}`);
        const images = await res.json();
        return images.length > 0 && images[0].data ? images[0].data : "http://via.placeholder.com/150";
      } catch (err) {
        console.warn(`No se pudo cargar la imagen del vehículo ${vehicleId}`, err);
        return "http://via.placeholder.com/150";
      }
    };
  
    const loadVehiclesWithImages = async (vehiclesData) => {
      setLoading(true);  
      const filteredVehicles = [];

      for (const v of vehiclesData) {
        const vehicleCity = await getCityFromCoords(v.latitude, v.longitude);
        console.log(`Vehículo ID ${v.id}: ciudad obtenida = ${vehicleCity}, ciudad buscada = ${city}`);
        if (!city || vehicleCity.toLowerCase() === city.toLowerCase()) {
          const imageUrl = await fetchImageUrl(v.owner_id, v.id);
          filteredVehicles.push({ ...v, imageUrl });
        }
      }

      setVehicles(filteredVehicles);
      setLoading(false);
    };
  
    if (vehiclesParam) {
      try {
        const parsedVehicles = JSON.parse(vehiclesParam);
        if (Array.isArray(parsedVehicles)) {
          loadVehiclesWithImages(parsedVehicles); 
        } else {
          setVehicles([]);
        }
      } catch (error) {
        console.error("Error al parsear vehículos:", error);
      }
      return;
    }
  
    if (id) {
      const fetchVehicle = async () => {
        try {
          const response = await fetch(`${getApiUrl()}/vehicles/${id}`);
          const data = await response.json();
          if (data && data.length > 0) {
            loadSingleVehicleWithImage(data[0]); 
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

  if (loading) {
    return (
      <View style={styles.noVehiclesContainer}>
        <Text style={styles.noVehiclesText}>{t("Cargando...") || "Cargando..."}</Text>
      </View>
    );
  }

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