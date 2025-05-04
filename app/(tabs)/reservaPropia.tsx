import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const ReservaDetalles = () => {
  const params = useLocalSearchParams();
  const [customerName, setCustomerName] = useState("Cargando...");
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reservations/${params.id}`);
        const data = await response.json();
        setReservation(data);

        // Obtener el nombre del cliente usando customer_id
        if (data.customer_id) {
          const customerResponse = await fetch(`http://localhost:3000/users/${data.customer_id}`, {
            method: "GET",
            credentials: "include",
          });

          if (!customerResponse.ok) {
            throw new Error(`Error al obtener el cliente: ${customerResponse.status}`);
          }

          const customerData = await customerResponse.json();
          const customer = Array.isArray(customerData) ? customerData[0] : customerData;
          setCustomerName(customer.name || "Desconocido");
        } else {
          setCustomerName("Desconocido");
        }
      } catch (error) {
        console.error("Error al obtener los detalles de la reserva:", error);
        setCustomerName("Desconocido");
      }
    };

    if (params.id) {
      fetchReservation();
    }
  }, [params.id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Reserva</Text>
      <Text style={styles.detail}>Vehículo: {params.vehicleName}</Text>
      <Text style={styles.detail}>Cliente: {customerName}</Text>
      <Text style={styles.detail}>Fecha de inicio: {new Date(params.startDate).toLocaleDateString()}</Text>
      <Text style={styles.detail}>Fecha de fin: {new Date(params.endDate).toLocaleDateString()}</Text>
      <Text style={styles.detail}>Precio total: {params.totalPrice}€</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ReservaDetalles;
