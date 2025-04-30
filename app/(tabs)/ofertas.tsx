import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import VehicleCard from "@/components/templates/VehicleCard";
import theme from "@/components/Theme";
import { useRouter } from "expo-router";

const Ofertas = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Asegúrate de que HTTPS está configurado correctamente en el backend
        const response = await fetch("http://localhost:3000/vehicles");
        const data = await response.json();

        if (Array.isArray(data)) {
          console.log("Datos de vehículos recibidos:", data); // Depuración
          setVehicles(data);
        } else {
          console.error("La respuesta no es un array:", data);
          setError("No se pudieron cargar los vehículos.");
        }
      } catch (err) {
        console.error("Error al cargar vehículos:", err);
        setError("Hubo un problema al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

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
          pickupLocation={vehicle.city || "Ubicación no disponible"}
          imageUrl={vehicle.imageUrl || "http://via.placeholder.com/150"} // Imagen predeterminada
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
