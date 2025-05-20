import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator} from "react-native";
import MyPublishedVehicles from "@/components/templates/MyPublishedVehicles";
import theme from "@/components/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getApiUrl } from "@/utils/getApiUrl";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const misCochesPublicados = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState([]);
  const [addresses, setAddresses] = useState<{ [id: number]: string }>({});
  const [reservations, setReservations] = useState([]);
  const [notifiedReservations, setNotifiedReservations] = useState([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const convertirCoordenadasADireccion = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'MiAppDeAlquiler/1.0 (contacto@tuapp.com)',
            'Accept-Language': 'es',
          },
        }
      );
      const data = await res.json();
      return data.display_name || "Dirección desconocida";
    } catch (error) {
      console.error("Error al convertir coordenadas:", error);
      return "Dirección desconocida";
    }
  };

  const cargarVehiculos = async () => {
  setIsLoading(true);
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
  } finally {
    setIsLoading(false);
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

  const handleVehiclePress = (vehicle) => {
    router.push({
      pathname: "/(tabs)/detallesMiCoche",
      params: {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        capacity: vehicle.capacity,
        type: vehicle.type,
        transmission: vehicle.transmission,
        fuel_type: vehicle.fuel_type,
        num_doors: vehicle.num_doors,
        deposit: vehicle.deposit,
        daily_price: vehicle.daily_price,
        imageUrl: vehicle.imageUrl,
        address: vehicle.address,
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
        availability: vehicle.availability,
      }
    });
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

        const previousReservation = notifiedReservations.find(r => r.id === reservation.id);

        if (!previousReservation) {
          newNotifications.push(`Tu vehículo "${vehicleName}" ha sido reservado.`);
        } else {
          if (previousReservation.status !== reservation.status) {
            const statusMessage = reservation.status === "Cancelled"
              ? `La reserva de tu vehículo "${vehicleName}" ha sido cancelada.`
              : `El estado de la reserva de "${vehicleName}" ha cambiado a ${reservation.status}.`;
            newNotifications.push(statusMessage);
          }

          if (previousReservation.start_date !== reservation.start_date || previousReservation.end_date !== reservation.end_date) {
            newNotifications.push(`Las fechas de la reserva de "${vehicleName}" han sido modificadas.`);
          }

          if (previousReservation.total_price !== reservation.total_price) {
            newNotifications.push(`El precio de la reserva de "${vehicleName}" ha cambiado a €${reservation.total_price}.`);
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications]);
      }

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
    }, 1000); 

    return () => clearInterval(interval); 
  }, [vehicles]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {notifications.length > 0 && (
        <View style={styles.notificationsContainer}>
          {reservations.map((reservation, index) => {
            const vehicle = vehicles.find(v => v.id === reservation.vehicle_id);
            const vehicleName = vehicle ? vehicle.brand : "Vehículo desconocido";

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/reservaPropia",
                    params: {
                      id: reservation.id,
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

      {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 10, color: theme.colors.text, fontSize: 16 }}>{t('MisCochesPublicados.Cargando')}</Text>
          </View>
      ) : vehicles.length === 0 ? (
        <Text style={styles.emptyText}>{t('MisCochesPublicados.NoPublicado')}</Text>
      ) : (
        vehicles.map((vehicle, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.cardWrapper}
            onPress={() => handleVehiclePress(vehicle)}
          >
            <MyPublishedVehicles
              brand={vehicle.brand}
              price={`${vehicle.daily_price}€`}
              city={vehicle.address || "Dirección desconocida"}
              imageUrl={vehicle.imageUrl}
              onCancel={() => handleDeleteVehicle(vehicle.id)}
              onEdit={() => navigation.navigate('alquilaCoche', { vehicleId: vehicle.id, vehicleData: vehicle })}
            />
          </TouchableOpacity>
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

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get('window').height * 0.5,
  },
});

export default misCochesPublicados;