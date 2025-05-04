import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Dimensions, StyleSheet } from "react-native";
import MyPublishedVehicles from "@/components/templates/MyPublishedVehicles";
import theme from "@/components/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

const misCochesPublicados = () => {
  const [vehicles, setVehicles] = useState([]);
  const [addresses, setAddresses] = useState<{ [id: number]: string }>({});
  const [reservations, setReservations] = useState([]);
  const [notifiedReservations, setNotifiedReservations] = useState([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const convertirCoordenadasADireccion = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await res.json();
      return data.display_name || "Dirección desconocida";
    } catch (error) {
      console.error("Error al convertir coordenadas:", error);
      return "Dirección desconocida";
    }
  };

  const cargarVehiculos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Usuario no autenticado");
        return;
      }

      const userRes = await fetch('http://localhost:3000/users/getdata/', {
        method: 'GET',
        credentials: 'include',
      });
      const userData = await userRes.json();
      const userId = userData[0].id;

      const response = await fetch(`http://localhost:3000/vehicles/`);
      const allVehicles = await response.json();

      const userVehicles = await Promise.all(
        allVehicles
          .filter(v => v.owner_id === userId)
          .map(async (vehicle) => {
            const vImgRes = await fetch(`http://localhost:3000/media/vehicles/${userId}/${vehicle.id}`);
            const images = await vImgRes.json();
            const imageUrl = images.length > 0 ? images[0].data : null;

            let address = "Dirección desconocida";
            if (vehicle.latitude && vehicle.longitude) {
              address = await convertirCoordenadasADireccion(vehicle.latitude, vehicle.longitude);
            }

            return { ...vehicle, imageUrl, address };
          })
      );
      setVehicles(userVehicles);
      console.log("Vehículos cargados:", userVehicles);
    } catch (error) {
      console.error("Error al cargar los vehículos:", error);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/vehicles/${vehicleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVehicles(prev => prev.filter(v => v.id !== vehicleId));
        alert("Vehículo eliminado correctamente");
      } else {
        alert("Error al eliminar el vehículo");
      }
    } catch (error) {
      console.error("Error al eliminar el vehículo:", error);
    }
  };

  const checkReservations = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reservations/`);
      const allReservations = await response.json();
      console.log("Todas las reservas:", allReservations);
  
      // Filtrar reservas para los vehículos del usuario
      const userReservations = allReservations.filter(reservation =>
        vehicles.some(vehicle => vehicle.id === reservation.vehicle_id)
      );
      console.log("Reservas para mis vehículos:", userReservations);
  
      // Detectar nuevas reservas
      const newReservations = userReservations.filter(
        reservation => !notifiedReservations.includes(reservation.id)
      );
      console.log("Nuevas reservas detectadas:", newReservations);
  
      if (newReservations.length > 0) {
        newReservations.forEach(reservation => {
          // Buscar el vehículo correspondiente para obtener su nombre
          const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
          const vehicleName = vehicle ? vehicle.brand : "Vehículo desconocido";
  
          // Agregar la notificación con el nombre del vehículo
          setNotifications(prev => [
            ...prev,
            `Tu vehículo "${vehicleName}" ha sido reservado.`,
          ]);
        });
  
        // Actualizar las reservas notificadas
        setNotifiedReservations(prev => {
          const updated = Array.from(new Set([...prev, ...newReservations.map(r => r.id)]));
          console.log("Reservas notificadas actualizadas:", updated);
          return updated;
        });
      }
  
      setReservations(userReservations);
    } catch (error) {
      console.error("Error al verificar las reservas:", error);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Verificando reservas...");
      checkReservations();
    }, 2000); // Verificar cada 30 segundos
  
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [vehicles, notifiedReservations]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Mostrar notificaciones */}
      {notifications.length > 0 && (
        <View style={styles.notificationsContainer}>
          {notifications.map((notification, index) => (
            <Text key={index} style={styles.notificationText}>
              {notification}
            </Text>
          ))}
        </View>
      )}

      {/* Mostrar vehículos */}
      {vehicles.length === 0 ? (
        <Text style={styles.emptyText}>No has publicado ningún vehículo aún.</Text>
      ) : (
        vehicles.map((vehicle, index) => (
          <View key={index} style={styles.cardWrapper}>
            <MyPublishedVehicles
              brand={vehicle.brand}
              price={`${vehicle.daily_price}€`}
              city={vehicle.address || "Dirección desconocida"}
              imageUrl={vehicle.imageUrl}
              onCancel={() => handleDeleteVehicle(vehicle.id)}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  notificationsContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  notificationText: {
    color: "black",
    fontSize: 16,
    marginBottom: 5,
  },
  cardWrapper: {
    width: width < 500 ? "100%" : "48%",
    marginBottom: 15,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
});

export default misCochesPublicados;