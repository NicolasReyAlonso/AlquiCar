import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Dimensions, StyleSheet } from "react-native";
import MyPublishedVehicles from "@/components/templates/MyPublishedVehicles";
import theme from "@/components/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('window');

const misCochesPublicados = () => {
  const [vehicles, setVehicles] = useState([]);

  const cargarVehiculos = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Usuario no autenticado");
        return;
      }

      const userRes = await fetch(`https://localhost:3000/users/getdata/${token}`);
      const userData = await userRes.json();
      const userId = userData[0].id;

      console.log(userId);
      
      const response = await fetch(`https://localhost:3000/vehicles/`);
      const allVehicles = await response.json();

      console.log(allVehicles);

      const userVehicles = allVehicles.filter(v => v.owner_id === userId);
      setVehicles(userVehicles);
    } catch (error) {
      console.error("Error al cargar los vehículos:", error);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const response = await fetch(`https://localhost:3000/vehicles/${vehicleId}`, {
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

  useEffect(() => {
    cargarVehiculos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {vehicles.length === 0 ? (
        <Text style={styles.emptyText}>No has publicado ningún vehículo aún.</Text>
      ) : (
        vehicles.map((vehicle, index) => (
          <View key={index} style={styles.cardWrapper}>
            <MyPublishedVehicles
              brand={vehicle.brand}
              price={`${vehicle.daily_price}€`}
              city={vehicle.city || "Ciudad desconocida"}
              imageUrl="https://via.placeholder.com/150"
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
