import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const ReservaDetalles = () => {
  const params = useLocalSearchParams();
  const [customer, setCustomer] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [modificada, setModificada] = useState(false); 
  const { t } = useTranslation();

  useEffect(() => {
    console.log("ID recibido en ReservaDetalles:", params.id);

    const fetchReservation = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reservations/${params.id}`);
        const data = await response.json();
        console.log("Datos de la reserva:", data);

        const reservationDetails = Array.isArray(data) ? data[0] : data;

        // Verificar si la reserva ha sido modificada
        if (reservation && JSON.stringify(reservation) !== JSON.stringify(reservationDetails)) {
          setModificada(true);
        } else {
          setModificada(false);
        }

        setReservation(reservationDetails);

        const customerId = reservationDetails.customer_id;
        if (!customerId) {
          console.warn("Customer ID es inválido o vacío.");
          setCustomer({ name: "Desconocido" });
          return;
        }

        console.log("Customer ID recibido:", customerId);

        const token = await AsyncStorage.getItem("token");
        const customerResponse = await fetch(`http://localhost:3000/users/${customerId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!customerResponse.ok) {
          throw new Error(`Error al obtener el cliente: ${customerResponse.status}`);
        }

        const customerData = await customerResponse.json();
        console.log("Datos del cliente recibidos:", customerData);

        if (Array.isArray(customerData) && customerData.length > 0) {
          setCustomer(customerData[0]);
        } else {
          setCustomer(customerData);
        }
      } catch (error) {
        console.error("Error al obtener los detalles de la reserva:", error);
        setCustomer({ name: "Desconocido" });
      }
    };

    if (params.id) {
      fetchReservation();
    }
  }, [params.id]);

  return (
    <View style={styles.container}>
      <View style={[styles.card, modificada ? styles.modified : null]}>
        <Text style={styles.title}>{t('reservaPropia.detallesReserva')}</Text>

        <View style={[styles.statusBox, reservation?.status === "Cancelled" ? styles.cancelled : styles.active]}>
          <Text style={styles.statusText}>
            {reservation?.status === "Cancelled" ? "Cancelada" : "Activa"}
          </Text>
        </View>

        <Text style={styles.detail}><Text style={styles.label}>{t('reservaPropia.vehículo')}:</Text> {params.vehicleName}</Text>
        <Text style={styles.detail}><Text style={styles.label}>{t('reservaPropia.fechaIn')}:</Text> {new Date(params.startDate).toLocaleDateString()}</Text>
        <Text style={styles.detail}><Text style={styles.label}>{t('reservaPropia.fechaFin')}:</Text> {new Date(params.endDate).toLocaleDateString()}</Text>
        <Text style={styles.detail}><Text style={styles.label}>{t('reservaPropia.precio')}</Text> {params.totalPrice}€</Text>
      </View>

      {customer && (
        <View style={styles.card}>
          <Text style={styles.title}>{t('reservaPropia.datos')}</Text>
          <Text style={styles.detail}><Text style={styles.label}>{t('reservaPropia.nombre')}:</Text> {customer.name || "Desconocido"}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Email:</Text> {customer.email || "No disponible"}</Text>
          <Text style={styles.detail}><Text style={styles.label}>{t('reservaPropia.teléfono')}:</Text> {customer.phone || "No disponible"}</Text>
          <Text style={styles.detail}><Text style={styles.label}>{t('reservaPropia.dirección')}:</Text> {customer.address || "No disponible"}</Text>
        </View>
      )}
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
    marginBottom: 15,
  },
  modified: {
    backgroundColor: "#FFE57F", 
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
