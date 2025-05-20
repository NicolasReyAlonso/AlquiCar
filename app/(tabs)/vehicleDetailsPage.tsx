import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para obtener el userId del usuario actual
import { useTranslation } from "react-i18next";
import { getApiUrl } from "@/utils/getApiUrl";

export default function VehicleDetailsPage() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState(null);
  const [owner, setOwner] = useState(null); // Estado para el propietario
  const [direccion, setDireccion] = useState("Dirección desconocida");
  const [userId, setUserId] = useState(null); // Estado para el userId del usuario actual
  const router = useRouter();
  const { t } = useTranslation();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
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

    const fetchVehicle = async () => {
      try {
        console.log("ID del vehículo recibido:", id);
        const response = await fetch(`${getApiUrl()}/vehicles/${id}`, {
          method: "GET",
          credentials: "include", // Usar credenciales para autenticación
        });
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
            console.warn(`No se pudo cargar la imagen del vehículo ${vehicleData.id}`, imgError);
          }
          vehicleData.imageUrl = imageUrl;

          setVehicle(vehicleData);
          console.log("Datos del vehículo asignados:", vehicleData);

          if (vehicleData.latitude && vehicleData.longitude) {
            const direccionObtenida = await convertirCoordenadasADireccion(vehicleData.latitude, vehicleData.longitude);
            setDireccion(direccionObtenida);
          }

          // Obtener datos del propietario
          if (vehicleData.owner_id) {
            const ownerResponse = await fetch(`${getApiUrl()}/users/${vehicleData.owner_id}`, {
              method: "GET",
              credentials: "include", // Usar credenciales para autenticación
            });

            if (!ownerResponse.ok) {
              throw new Error(`Error al obtener el propietario: ${ownerResponse.status}`);
            }

            const ownerData = await ownerResponse.json();
            const ownerInfo = Array.isArray(ownerData) ? ownerData[0] : ownerData; // Manejar respuesta como array
            setOwner(ownerInfo);
            console.log("Datos del propietario asignados:", ownerInfo);
          }
        } else {
          console.error("No se encontraron datos del vehículo con este ID");
        }
      } catch (error) {
        console.error("Error al obtener el vehículo o el propietario:", error);
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

  const availabilityBackgroundColor = vehicle.availability === 1 ? "#DFF0D8" : "#F2DEDE";
  const availabilityTextColor = vehicle.availability === 1 ? "#3C763D" : "#A94442";

  return (
    <ScrollView 
    style={styles.container}
    contentContainerStyle={styles.scrollContent} 
    >
    
      <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
        <Image source={{ uri: vehicle.imageUrl }} style={styles.mainImage} />
      </TouchableOpacity>
      <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
      <Text style={styles.subtitle}>{vehicle.year}</Text>

      <View style={styles.detailsContainer}>
        {/* Disponibilidad destacada */}
        <View style={[styles.availabilityContainer, { backgroundColor: availabilityBackgroundColor }]}>
          <Text style={[styles.availabilityText, { color: availabilityTextColor }]}>
            {vehicle.availability === 1 ? "¡Disponible!" : "No disponible"}
          </Text>
        </View>

        {/* Otros detalles */}
        <Text style={styles.sectionTitle}>{t("reservaPropia.detallesVehículo")}:</Text>
        <Text style={styles.detailText}>{t("reservaPropia.capacidad")}: {vehicle.capacity} {t("reservaPropia.pasajeros")}</Text>
        <Text style={styles.detailText}>{t("reservaPropia.tipo")}: {vehicle.type}</Text>
        <Text style={styles.detailText}>{t("reservaPropia.transmisión")}: {vehicle.transmission}</Text>
        <Text style={styles.detailText}>{t("reservaPropia.combustible")}: {vehicle.fuel_type}</Text>
        <Text style={styles.detailText}>{t("reservaPropia.puertas")}: {vehicle.num_doors}</Text>
        <Text style={styles.detailText}>{t("reservaPropia.dirección")}: {direccion}</Text>
        <Text style={styles.detailText}>{t("reservaPropia.depósito")}: {`€${vehicle.deposit}`}</Text>
        <Text style={styles.detailText}>{t("reservaPropia.precio")}: {`€${vehicle.daily_price}`}</Text>
      </View>

      {/* Información del propietario */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>{t("reservaPropia.propietario")}:</Text>
        {owner ? (
          <>
            <Text style={styles.detailText}>{t("reservaPropia.nombre")}: {owner.name}</Text>
            <Text style={styles.detailText}>Email: {owner.email}</Text>
            <Text style={styles.detailText}>{t("reservaPropia.teléfono")}: {owner.phone}</Text>
          </>
        ) : (
          <Text style={styles.detailText}>{t("reservaPropia.noCarga")}</Text>
        )}
      </View>

{/* Botón de reservar (solo si el vehículo no pertenece al usuario actual) */}
{vehicle.owner_id !== userId && (
  <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={styles.reserveButton}
      onPress={() =>
        router.push({
          pathname: "reservarCoche",
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
    >
      <Text style={styles.reserveButtonText}>{t("VehicleCard.buttons.reservation")}</Text>
    </TouchableOpacity>
  </View>
)}  
{isImageModalVisible && (
  <Modal
    transparent={true}
    animationType="fade" // Agrega una animación para que se vea más fluido
    visible={isImageModalVisible}
    onRequestClose={() => setIsImageModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => setIsImageModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>✖</Text>
      </TouchableOpacity>
      
      <Image 
        source={{ uri: vehicle.imageUrl }} 
        style={styles.fullSizeImage}
        resizeMode="contain"
      />
    </View>
  </Modal>
)}



    </ScrollView>
    
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
    scrollContent: {
    padding: 15,
    paddingBottom: 80, // Espacio extra para el botón
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 30, // Espacio adicional en dispositivos con notch
  },
  reserveButton: {
    backgroundColor: "#3B6ED5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  reserveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
  availabilityContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  availabilityText: {
    fontSize: 20,
    fontWeight: "bold",
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
  galleryContainer: {
    marginBottom: 20,
  },
  galleryImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  noGalleryText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: "#3B6ED5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
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
  modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.9)',
  justifyContent: 'center',
  alignItems: 'center',
},
fullSizeImage: {
  width: '100%',
  height: '80%',
},
closeButton: {
  position: 'absolute',
  top: 40,
  right: 20,
  backgroundColor: 'rgba(255,255,255,0.3)',
  borderRadius: 20,
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},
closeButtonText: {
  color: 'white',
  fontSize: 20,
  fontWeight: 'bold',
},
});