import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DatePickerModal } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';

export default function ConfirmacionReserva() {
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const [pickupDatePickerVisible, setPickupDatePickerVisible] = useState(false);
  const [returnDatePickerVisible, setReturnDatePickerVisible] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [dias, setDias] = useState(1);
  const [precioCoche, setPrecioCoche] = useState(0);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [fechasReservadas, setFechasReservadas] = useState<{ start_date: string; end_date: string }[]>([]);

  const openPickupDatePicker = () => setPickupDatePickerVisible(true);
  const closePickupDatePicker = () => setPickupDatePickerVisible(false);
  const openReturnDatePicker = () => setReturnDatePickerVisible(true);
  const closeReturnDatePicker = () => setReturnDatePickerVisible(false);

  const onPickupDateConfirm = (params: { date: Date | undefined }) => {
    if (params.date) setPickupDate(params.date);
    closePickupDatePicker();
  };

  const onReturnDateConfirm = (params: { date: Date | undefined }) => {
    if (params.date) setReturnDate(params.date);
    closeReturnDatePicker();
  };

  const obtenerPrecioNumerico = (precio: string) => {
    const match = precio.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  const getUserId = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); 
      return payload.id;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  const handleConfirmReservation = async () => {
    if (!pickupDate || !returnDate) {
      alert("Faltan campos por rellenar");
      return;
    }

    if (!params.vehicleId) {
      alert("Error: el ID del vehículo no se recibió correctamente.");
      return;
    }

    const userId = await getUserId();
    if (!userId) {
      alert("Por favor, inicia sesión para realizar una reserva.");
      return;
    }

    const nuevaReserva = {
      vehicle_id: Number(params.vehicleId),
      customer_id: userId, 
      start_date: pickupDate.toISOString(),
      end_date: returnDate.toISOString(),
      total_price: Number(precioTotal),
    };

    try {
      const response = await fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaReserva),
      });

      if (response.ok) {
        alert("Reserva confirmada.");
      } else {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
        alert("Hubo un problema al guardar la reserva.");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("Error de conexión al servidor.");
    }
  };

  useEffect(() => {
    const cargarFechasReservadas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reservations?vehicle_id=${params.vehicleId}`);
        const data = await response.json();
        setFechasReservadas(data);
      } catch (error) {
        console.error("Error al cargar las fechas reservadas:", error);
      }
    };

    if (params.vehicleId) {
      cargarFechasReservadas();
    }
  }, [params.vehicleId]);

  const calcularFechasNoDisponibles = () => {
    const noDisponibles: Date[] = [];
    fechasReservadas.forEach(({ start_date, end_date }) => {
      const inicio = new Date(start_date);
      const fin = new Date(end_date);
      for (let d = inicio; d <= fin; d.setDate(d.getDate() + 1)) {
        noDisponibles.push(new Date(d));
      }
    });
    return noDisponibles;
  };

  const reserva = {
    marca: params.brand || "Desconocido",
    tipo: params.type || "Desconocido",
    plazas: params.seats || 0,
    transmision: "Manual",
    precioPorDia: obtenerPrecioNumerico(Array.isArray(params.price) ? params.price[0] : params.price || "0"),
    imagen: params.imageUrl || "http://via.placeholder.com/100",
    ciudad: params.pickupLocation || "Desconocido",
  };

  useEffect(() => {
    if (pickupDate && returnDate) {
      const diffTime = returnDate.getTime() - pickupDate.getTime();
      const newDias = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setDias(newDias);
      setPrecioCoche(reserva.precioPorDia * newDias);
      setPrecioTotal(reserva.precioPorDia * newDias);
    }
  }, [pickupDate, returnDate]);

  const calcularFechaCancelacion = () => {
    if (!pickupDate) return "";
    const fechaCancelacion = new Date(pickupDate);
    fechaCancelacion.setDate(pickupDate.getDate() - 7);
    return fechaCancelacion.toLocaleDateString();
  };

  const fechaCancelacionMax = calcularFechaCancelacion();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t("reserveVehicle.title")}</Text>
      <View style={styles.row}>
        <Image source={{ uri: reserva.imagen }} style={styles.image} />
        <View>
          <Text style={styles.title}>{reserva.marca}</Text>
          <Text style={styles.text}>{reserva.tipo} - {reserva.plazas} plazas</Text>
          <Text style={styles.text}>{reserva.transmision}</Text>
          <Text style={styles.text}>{t("reserveVehicle.city")}: {reserva.ciudad}</Text>
        </View>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.subtitle}>{t("reserveVehicle.startDate")}</Text>
        <View style={styles.dateRow}>
          <TextInput
            placeholder="Selecciona la fecha"
            placeholderTextColor="gray"
            value={pickupDate ? pickupDate.toLocaleDateString() : ""}
            editable={false}
            style={styles.dateInput}
          />
          <TouchableOpacity onPress={openPickupDatePicker}>
            <Icon name="calendar" size={22} color="#3B6ED5" />
          </TouchableOpacity>
        </View>
        <DatePickerModal
          locale="es"
          mode="single"
          visible={pickupDatePickerVisible}
          onDismiss={closePickupDatePicker}
          date={pickupDate || undefined}
          onConfirm={onPickupDateConfirm}
          validRange={{
            startDate: new Date(),
            disabledDates: calcularFechasNoDisponibles(),
          }}
        />
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.subtitle}>{t("reserveVehicle.finishDate")}</Text>
        <View style={styles.dateRow}>
          <TextInput
            placeholder="Selecciona la fecha"
            placeholderTextColor="gray"
            value={returnDate ? returnDate.toLocaleDateString() : ""}
            editable={false}
            style={styles.dateInput}
          />
          <TouchableOpacity onPress={openReturnDatePicker}>
            <Icon name="calendar" size={22} color="#3B6ED5" />
          </TouchableOpacity>
        </View>
        <DatePickerModal
          locale="es"
          mode="single"
          visible={returnDatePickerVisible}
          onDismiss={closeReturnDatePicker}
          date={returnDate || undefined}
          onConfirm={onReturnDateConfirm}
          validRange={{
            startDate: new Date(),
            disabledDates: calcularFechasNoDisponibles(),
          }}
        />
      </View>
      <Text style={styles.subtitle}>{t("reserveVehicle.duration")}</Text>
      <Text style={styles.text}>{dias} {t("reserveVehicle.days")}</Text>
      <Text style={styles.text}>{t("reserveVehicle.vehiclePrice")}: {reserva.precioPorDia}€/día × {dias} días = {precioCoche}€</Text>
      <Text style={styles.text}>——————</Text>
      <View style={styles.totalContainer}>
        <Text style={styles.total}>{t("reserveVehicle.totalPrice")}</Text>
        <Text style={styles.total}>{precioTotal}€</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleConfirmReservation}>
        <Text style={styles.buttonText}>{t("reserveVehicle.buttons.confirmation")}</Text>
      </TouchableOpacity>
      <Text style={styles.cancelText}>{t("reserveVehicle.cancelDate")}: {fechaCancelacionMax}</Text>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 30,
  },
  total: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "right",
    paddingLeft: 10,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    fontSize: 18,
    color: "#555",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginTop: 15,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 6,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dateInput: {
    fontSize: 18,
    flex: 1,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    marginRight: 10,
    marginLeft: 20,
  },
  button: {
    backgroundColor: "#3B6ED5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
  },
  cancelText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 15,
  },
  dateContainer: {
    marginBottom: 15,
  },
});
