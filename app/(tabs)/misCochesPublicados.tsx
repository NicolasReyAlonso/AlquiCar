import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import MyPublishedVehicles from "@/components/templates/MyPublishedVehicles";
import theme from "@/components/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getApiUrl } from "@/utils/getApiUrl";

const { width } = Dimensions.get('window');

const misCochesPublicados = () => {
  const router = useRouter();
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

      const userRes = await fetch(`${getApiUrl()}/users/getdata/`, {
        method: 'GET',
        credentials: 'include',
      });
      const userData = await userRes.json();
      const userId = userData[0].id;

      const response = await fetch(`${getApiUrl()}/vehicles/`);
      const allVehicles = await response.json();

      const userVehicles = await Promise.all(
        allVehicles
          .filter(v => v.owner_id === userId)
          .map(async (vehicle) => {
            const vImgRes = await fetch(`${getApiUrl()}/media/vehicles/${userId}/${vehicle.id}`);
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
    } catch (error) {
      console.error("Error al cargar los vehículos:", error);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/vehicles/${vehicleId}`, {
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
      const response = await fetch(`${getApiUrl()}/reservations/`);
      const allReservations = await response.json();

      const userReservations = allReservations.filter(reservation =>
        vehicles.some(vehicle => vehicle.id === reservation.vehicle_id)
      );

      const newNotifications = [];

      userReservations.forEach(reservation => {
        const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
        const vehicleName = vehicle ? vehicle.brand : "Vehículo desconocido";

        // Buscar la reserva anterior en la lista de notificadas
        const previousReservation = notifiedReservations.find(r => r.id === reservation.id);

        if (!previousReservation) {
          // Nueva reserva
          newNotifications.push(`Tu vehículo "${vehicleName}" ha sido reservado.`);
        } else {
          // Detectar cambios en estado
          if (previousReservation.status !== reservation.status) {
            const statusMessage = reservation.status === "Cancelled"
              ? `La reserva de tu vehículo "${vehicleName}" ha sido cancelada.`
              : `El estado de la reserva de "${vehicleName}" ha cambiado a ${reservation.status}.`;
            newNotifications.push(statusMessage);
          }

          // Detectar cambios en fechas
          if (previousReservation.start_date !== reservation.start_date || previousReservation.end_date !== reservation.end_date) {
            newNotifications.push(`Las fechas de la reserva de "${vehicleName}" han sido modificadas.`);
          }

          // Detectar cambios en precio
          if (previousReservation.total_price !== reservation.total_price) {
            newNotifications.push(`El precio de la reserva de "${vehicleName}" ha cambiado a €${reservation.total_price}.`);
          }
        }
      });

      console.log("Nueva notificación generada:", newNotifications); // Verificar qué cambios se están detectando

      if (newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications]);
      }

      // Solo actualizar `notifiedReservations` después de verificar los cambios
      setNotifiedReservations(userReservations);
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
      checkReservations();
    }, 1000); // Verificar cada 30 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [vehicles]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Mostrar notificaciones */}
      {notifications.length > 0 && (
        <View style={styles.notificationsContainer}>
          {reservations.map((reservation, index) => {
            const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
            const vehicleName = vehicle ? vehicle.brand : "Vehículo desconocido";

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  console.log("Navegando a reservaPropia con:", reservation); // Agregar aquí
                  router.push({
                    pathname: "/(tabs)/reservaPropia",
                    params: {
                      id: reservation.id, // Agregar el ID de la reserva explícitamente
                      vehicleName,
                      customerId: reservation.customer_id,
                      startDate: reservation.start_date,
                      endDate: reservation.end_date,
                      totalPrice: reservation.total_price,
                    },
                  });
                }}
              >

              
                <Text style={styles.notificationText}>
                  {`Tu vehículo "${vehicleName}" ha sido reservado.`}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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