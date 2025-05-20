import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import VehicleCard from "@/components/templates/VehicleCard";
import theme from "@/components/Theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getApiUrl } from "@/utils/getApiUrl";
import { useTranslation } from 'react-i18next';

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


const Ofertas = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { lat, lon } = useLocalSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const userLat = parseFloat(lat);
        const userLon = parseFloat(lon);

        if (isNaN(userLat) || isNaN(userLon)) {
          throw new Error("Ubicación inválida.");
        }

        const response = await fetch(`${getApiUrl()}/vehicles`);
        const data = await response.json();

        if (Array.isArray(data)) {
          let filtered = data
            .map(v => {
              if (v.latitude && v.longitude) {
                const distance = haversineDistance(
                  userLat,
                  userLon,
                  parseFloat(v.latitude),
                  parseFloat(v.longitude)
                );
                return { ...v, distance };
              }
              return null;
            })
            .filter(v => v && v.distance <= 30)
            .sort((a, b) => a.distance - b.distance);

          const vehiclesWithImages = await Promise.all(
            filtered.map(async (vehicle) => {
              let imageUrl = "http://via.placeholder.com/150";
              try {
                const imgRes = await fetch(`${getApiUrl()}/media/vehicles/${vehicle.owner_id}/${vehicle.id}`);
                const images = await imgRes.json();
                if (images.length > 0 && images[0].data) {
                  imageUrl = images[0].data;
                }
              } catch (imgError) {
                console.warn(`No se pudo cargar la imagen del vehículo ${vehicle.id}`, imgError);
              }

              return { ...vehicle, imageUrl };
            })
          );

          setVehicles(vehiclesWithImages);
        }
      } catch (err) {
        console.error("Error al cargar vehículos:", err);
        alert("Hubo un problema al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [lat, lon]);

  if (loading) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 18, color: theme.colors.primary }}>Cargando vehículos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text style={{ fontSize: 18, color: theme.colors.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20, backgroundColor: theme.colors.background }}>
      <Text style={{ fontSize: 16, color: theme.colors.primary, marginBottom: 10 }}>
      {t('Ofertas.radio')} </Text>

      {vehicles.map((vehicle, index) => (
        <VehicleCard
          key={index}
          brand={vehicle.brand || "Marca desconocida"}
          model={vehicle.model || "Modelo desconocido"}
          year={vehicle.year || "Año desconocido"}
          seats={vehicle.capacity || "Desconocido"}
          type={vehicle.type || "Desconocido"}
          transmission={vehicle.transmission || "No especificada"}
          fuelType={vehicle.fuel_type || "No especificado"}
          numDoors={vehicle.num_doors || "Sin información"}
          deposit={vehicle.deposit || "0.00"}
          price={vehicle.daily_price ? `€${vehicle.daily_price}` : "Desconocido"}
          mileage={vehicle.mileage || "Sin información"}
          pickupLocation={`${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}`}
          imageUrl={vehicle.imageUrl || "http://via.placeholder.com/150"} 
          vehicleId={vehicle.id}
          onReserve={() =>
            router.push({
              pathname: "/reservarCoche",
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
        />
      ))}
    </ScrollView>
  );
};

export default Ofertas;
