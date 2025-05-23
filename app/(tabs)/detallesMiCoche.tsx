import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { getApiUrl } from "@/utils/getApiUrl";
import { useTranslation } from "react-i18next"; // Añade esta importación

export default function DetallesMiCoche() {
  const { id } = useLocalSearchParams();
  const [vehicle, setVehicle] = useState(null);
  const [owner, setOwner] = useState(null);
  const [direccion, setDireccion] = useState("Dirección desconocida");
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const { t } = useTranslation(); // Añade el hook de traducción

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
        return data.display_name || t("detallesMiCoche.direccionDesconocida");
      } catch (error) {
        console.error(t("detallesMiCoche.errorDireccion"), error);
        return t("detallesMiCoche.direccionDesconocida");
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
            console.warn(t("detallesMiCoche.errorImagen"), imgError);
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
          console.error(t("detallesMiCoche.noDatos"));
        }
      } catch (error) {
        console.error(t("detallesMiCoche.errorDatos"), error);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (!vehicle) {
    return (
      <View style={styles.noVehicleContainer}>
        <Text style={styles.noVehicleText}>{t("detallesMiCoche.noDatos")}</Text>
      </View>
    );
  }

  const handleDeleteVehicle = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/vehicles/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert(t("detallesMiCoche.vehiculoEliminado"));
        router.push("/(tabs)/misCochesPublicados");
      } else {
        alert(t("detallesMiCoche.errorEliminar"));
      }
    } catch (error) {
      console.error(t("detallesMiCoche.errorEliminar"), error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
        <Image source={{ uri: vehicle.imageUrl }} style={styles.mainImage} />
      </TouchableOpacity>
      <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
      <Text style={styles.subtitle}>{vehicle.year}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>{t("detallesMiCoche.ubicacion")}: {direccion}</Text>
        <Text style={styles.detailText}>{t("detallesMiCoche.precioPorDia")}: {vehicle.daily_price}€</Text>
        <Text style={styles.detailText}>{t("detallesMiCoche.deposito")}: {vehicle.deposit}€</Text>
        <Text style={styles.detailText}>{t("detallesMiCoche.transmision")}: {vehicle.transmission}</Text>
        <Text style={styles.detailText}>{t("detallesMiCoche.combustible")}: {vehicle.fuel_type}</Text>
        <Text style={styles.detailText}>{t("detallesMiCoche.puertas")}: {vehicle.num_doors}</Text>
        <Text style={styles.detailText}>{t("detallesMiCoche.publicadoEl")}: {new Date(vehicle.registration_date).toLocaleDateString("es-ES")}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteVehicle}>
        <Text style={styles.buttonText}>{t("detallesMiCoche.eliminar")}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push("/(tabs)/misCochesPublicados")}
      >
        <Text style={styles.buttonText}>{t("detallesMiCoche.volver")}</Text>
      </TouchableOpacity>

      {isImageModalVisible && (
        <Modal
          transparent={true}
          animationType="fade" 
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