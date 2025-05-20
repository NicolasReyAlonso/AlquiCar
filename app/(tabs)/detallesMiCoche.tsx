import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { getApiUrl } from "@/utils/getApiUrl";

export default function DetallesMiCoche() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState(null);
  const [owner, setOwner] = useState(null);
  const [direccion, setDireccion] = useState("Dirección desconocida");
  const [userId, setUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const convertirCoordenadasADireccion = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          {
            headers: {
              'User-Agent': 'MiAppDeAlquiler/1.0',
              'Accept-Language': 'es',
            },
          }
        );
        const data = await res.json();
        return data.display_name || "Dirección desconocida";
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
        return "Dirección desconocida";
      }
    };

    const fetchVehicle = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/vehicles/${id}`, { method: "GET" });
        const data = await response.json();
        
        if (data && data.length > 0) {
          const vehicleData = data[0];
          let imageUrl = "http://via.placeholder.com/150";

          try {
            const imgRes = await fetch(`${getApiUrl()}/media/vehicles/${vehicleData.owner_id}/${vehicleData.id}`);
            const images = await imgRes.json();
            if (images.length > 0 && images[0].data) {
              imageUrl = images[0].data;
            }
          } catch (imgError) {
            console.warn("No se pudo cargar la imagen del vehículo", imgError);
          }

          vehicleData.imageUrl = imageUrl;
          setVehicle(vehicleData);

          if (vehicleData.latitude && vehicleData.longitude) {
            const direccionObtenida = await convertirCoordenadasADireccion(vehicleData.latitude, vehicleData.longitude);
            setDireccion(direccionObtenida);
          }

          if (vehicleData.owner_id) {
            const ownerResponse = await fetch(`${getApiUrl()}/users/${vehicleData.owner_id}`, { method: "GET" });
            const ownerData = await ownerResponse.json();
            setOwner(ownerData);
          }
        } else {
          console.error("No se encontraron datos del vehículo.");
        }
      } catch (error) {
        console.error("Error al obtener los datos del vehículo:", error);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (!vehicle) {
    return (
      <View style={styles.noVehicleContainer}>
        <Text style={styles.noVehicleText}>No se encuentran datos del vehículo.</Text>
      </View>
    );
  }


  if (!vehicle) {
    return (
      <View style={styles.noVehicleContainer}>
        <Text style={styles.noVehicleText}>No se encuentran datos del vehículo.</Text>
      </View>
    );
  }

    const handleDeleteVehicle = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/vehicles/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Vehículo eliminado correctamente");
        router.push("/(tabs)/misCochesPublicados");
      } else {
        alert("Error al eliminar el vehículo");
      }
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: vehicle.imageUrl }} style={styles.mainImage} />
      <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
      <Text style={styles.subtitle}>{vehicle.year}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Ubicación: {direccion}</Text>
        <Text style={styles.detailText}>Precio por día: {vehicle.daily_price}€</Text>
        <Text style={styles.detailText}>Depósito: {vehicle.deposit}€</Text>
        <Text style={styles.detailText}>Transmisión: {vehicle.transmission}</Text>
        <Text style={styles.detailText}>Combustible: {vehicle.fuel_type}</Text>
        <Text style={styles.detailText}>Puertas: {vehicle.num_doors}</Text>
        <Text style={styles.detailText}>Publicado el: {new Date(vehicle.registration_date).toLocaleDateString("es-ES")}</Text>


      </View>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteVehicle}>
            <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
    deleteButton: {
    backgroundColor: "#d9534f",
    width: 100, 
    paddingVertical: 8, 
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center", 
    marginVertical: 5,
    },
    button: {
    backgroundColor: "#3B6ED5",
    width: 100, 
    paddingVertical: 8, 
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center", 
    marginVertical: 5,
    },
    buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12, 
    },

  noVehicleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noVehicleText: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
  },
});
