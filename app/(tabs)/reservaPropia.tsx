import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from 'react-i18next';

const ReservaDetalles = () => {
  const params = useLocalSearchParams();
  const [customerName, setCustomerName] = useState("Cargando...");
  const [reservation, setReservation] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    console.log("ID recibido en ReservaDetalles:", params.id);

    const fetchReservation = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reservations/${params.id}`);
        const data = await response.json();
        console.log("Datos de la reserva:", data);

        setReservation(data);

        if (data.customer_id) {
          console.log("Customer ID recibido:", data.customer_id);
          const customerResponse = await fetch(`http://localhost:3000/users/${data.customer_id}`, {
            method: "GET",
            credentials: "include",
          });

          if (!customerResponse.ok) {
            throw new Error(`Error al obtener el cliente: ${customerResponse.status}`);
          }

          const customerData = await customerResponse.json();
          console.log("Datos del cliente:", customerData);

          setCustomerName(customerData.name || "Desconocido");
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
      <View style={styles.card}>
        <Text style={styles.title}>{t("reservaPropia.detallesReserva")}</Text>
        
        <View style={[styles.statusBox, reservation?.status === "Cancelled" ? styles.cancelled : styles.active]}>
          <Text style={styles.statusText}>
            {reservation?.status === "Cancelled" ? "Cancel" : "Active"}
          </Text>
        </View>

        <Text style={styles.detail}><Text style={styles.label}>{t("reservaPropia.vehículo")}:</Text> {params.vehicleName}</Text>
        <Text style={styles.detail}><Text style={styles.label}>{t("reservaPropia.cliente")}:</Text> {customerName}</Text>
        <Text style={styles.detail}><Text style={styles.label}>{t("reservaPropia.fechaIn")}:</Text> {new Date(params.startDate).toLocaleDateString()}</Text>
        <Text style={styles.detail}><Text style={styles.label}>{t("reservaPropia.fechaFin")}:</Text> {new Date(params.endDate).toLocaleDateString()}</Text>
        <Text style={styles.detail}><Text style={styles.label}>{t("reservaPropia.precio")}:</Text> {params.totalPrice}€</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  statusBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: "center",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  active: {
    backgroundColor: "#DFF0D8",
    borderColor: "#3C763D",
  },
  cancelled: {
    backgroundColor: "#F2DEDE",
    borderColor: "#A94442",
  },
});

export default ReservaDetalles;
