import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, TextInput, Alert, Platform, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DatePickerModal } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import { getApiUrl, getAppUrl } from '@/utils/getApiUrl';

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
  const [direccion, setDireccion] = useState("Dirección desconocida");
  const [vehicle, setVehicle] = useState<any>(null);
  const fetchImageUrl = async (ownerId: string, vehicleId: string) => {
    try {
      const res = await fetch(`${getApiUrl()}/media/vehicles/${ownerId}/${vehicleId}`);
      const images = await res.json();
      return images.length > 0 && images[0].data ? images[0].data : "http://via.placeholder.com/150";
    } catch (err) {
      console.warn(`No se pudo cargar la imagen del vehículo ${vehicleId}`, err);
      return "http://via.placeholder.com/150";
    }
  };

  const openPickupDatePicker = () => setPickupDatePickerVisible(true);
  const closePickupDatePicker = () => setPickupDatePickerVisible(false);
  const openReturnDatePicker = () => setReturnDatePickerVisible(true);
  const closeReturnDatePicker = () => setReturnDatePickerVisible(false);

const onPickupDateConfirm = (params: { date: Date | undefined }) => {
  if (params.date) {
    setPickupDate(params.date);
    if (returnDate && returnDate < params.date) {
      setReturnDate(null);
    }
  }
  closePickupDatePicker();
};

  const onReturnDateConfirm = (params: { date: Date | undefined }) => {
    if (params.date) setReturnDate(params.date);
    closeReturnDatePicker();
  };

  const obtenerPrecioNumerico = (precio: string) => {
    if (!precio) return 0;
    const valorLimpio = precio.toString().replace(/[^\d.,]/g, '');
    const valorNormalizado = valorLimpio.replace(',', '.');
    return parseFloat(valorNormalizado) || 0;
  };

  const obtenerDepositoNumerico = (deposito: string) => {
    if (!deposito) return 0;
    const valorLimpio = deposito.toString().replace(/[^\d.,]/g, '');
    const valorNormalizado = valorLimpio.replace(',', '.');
    return parseFloat(valorNormalizado) || 0;
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

  if (returnDate < pickupDate) {
    alert("La fecha de devolución no puede ser anterior a la fecha de recogida");
    return;
  }

  const userId = await getUserId();
  if (!userId) {
    alert("Por favor, inicia sesión para realizar una reserva.");
    return;
  }

  try {
    const pagoResponse = await fetch(`${getApiUrl()}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reservationid: params.vehicleId,
        apiurl: `${getAppUrl()}`
      }),
    });

    if (!pagoResponse.ok) {
      const errorData = await pagoResponse.json();
      throw new Error(errorData.message || "Error al iniciar el pago.");
    }

    const pagoData = await pagoResponse.json();
    const checkoutUrl = pagoData.url;

    if (Platform.OS === "web") {
      window.location.href = checkoutUrl;
    } else {
      Linking.openURL(checkoutUrl);
    }

    const nuevaReserva = {
      vehicle_id: Number(params.vehicleId),
      customer_id: userId,
      start_date: pickupDate.toISOString(),
      end_date: returnDate.toISOString(),
      total_price: precioTotal,
    };

    const reservaResponse = await fetch(`${getApiUrl()}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaReserva),
    });

    if (!reservaResponse.ok) {
      throw new Error("Error al confirmar la reserva después del pago.");
    }

    alert("Reserva confirmada y pago completado con éxito.");
  } catch (error) {
    console.error("Error en el proceso de reserva:", error);
    alert(error.message || "Ocurrió un error durante la reserva.");
  }
};


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

    const cargarDatosVehiculo = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/vehicles/${params.vehicleId}`);
        const data = await response.json();
    
        if (data && data.length > 0) {
          const vehiculo = data[0];
          const imageUrl = await fetchImageUrl(vehiculo.owner_id, vehiculo.id);
          setVehicle({ ...vehiculo, imageUrl }); 
          
          if (vehiculo.latitude && vehiculo.longitude) {
            const direccionObtenida = await convertirCoordenadasADireccion(
              parseFloat(vehiculo.latitude),
              parseFloat(vehiculo.longitude)
            );
            setDireccion(direccionObtenida);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos del vehículo:", error);
      }
    };

const cargarFechasReservadas = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/reservations?vehicle_id=${params.vehicleId}`);
    const data = await response.json();

    // Filtrar por vehículo actual Y por reservas activas (no canceladas)
    const reservasActivas = data.filter((reserva: any) => {
      return reserva.vehicle_id === Number(params.vehicleId) && 
             reserva.status !== "Cancelled";
    });
    
    setFechasReservadas(reservasActivas);
  } catch (error) {
    console.error("Error al cargar las fechas reservadas:", error);
  }
};
  
    if (params.vehicleId) {
      cargarDatosVehiculo();
      cargarFechasReservadas();
    }
  }, [params.vehicleId]);

const calcularFechasNoDisponibles = () => {
  const noDisponibles: Date[] = [];
  
  // Verificar si hay fechas reservadas
  if (!fechasReservadas || fechasReservadas.length === 0) {
    return noDisponibles;
  }

  fechasReservadas.forEach(({ start_date, end_date }) => {
    if (!start_date || !end_date) return;
    
    const inicio = new Date(start_date);
    const fin = new Date(end_date);
    
    if (isNaN(inicio.getTime())) {
      console.warn("Fecha de inicio inválida:", start_date);
      return;
    }
    if (isNaN(fin.getTime())) {
      console.warn("Fecha de fin inválida:", end_date);
      return;
    }

    const currentDate = new Date(inicio);
    while (currentDate <= fin) {
      noDisponibles.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return noDisponibles;
};

  useEffect(() => {
    if (pickupDate && returnDate && vehicle?.daily_price) {
      const diffTime = returnDate.getTime() - pickupDate.getTime();
      const newDias = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      
      const precioPorDia = obtenerPrecioNumerico(vehicle.daily_price);
      const precioBase = precioPorDia * newDias;
      const deposito = obtenerDepositoNumerico(vehicle.deposit);
      const precioFinal = precioBase + deposito;

      console.log('Cálculo de precio:', {
        precioPorDia,
        newDias,
        precioBase,
        deposito,
        precioFinal,
        dailyPrice: vehicle.daily_price,
        deposit: vehicle.deposit
      });

      setDias(newDias);
      setPrecioCoche(precioBase);
      setPrecioTotal(precioFinal);
    }
  }, [pickupDate, returnDate, vehicle]);

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
        <Image 
          source={{ uri: vehicle?.imageUrl || "http://via.placeholder.com/100" }} 
          style={styles.image} 
        />
        <View>
          <Text style={styles.title}>{vehicle?.brand || "Desconocido"}</Text>
          <Text style={styles.text}>
            {vehicle?.type || "Desconocido"} - {vehicle?.capacity || 0} plazas
          </Text>
          <Text style={styles.text}>
            {vehicle?.transmission === "Automatic" ? "Automático" : "Manual"}
          </Text>
          <Text style={styles.text}>
            {t("reservaPropia.dirección")}: {direccion}
          </Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.subtitle}>{t("reserveVehicle.startDate")}</Text>
        <View style={styles.dateRow}>
          <TextInput
            placeholder={t("reserveVehicle.selecciona")}
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
            placeholder={t("reserveVehicle.selecciona")}
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
            startDate: pickupDate || new Date(), // Fecha mínima es la de recogida o hoy
            disabledDates: calcularFechasNoDisponibles(),
          }}
        />
      </View>

      <View style={styles.priceDetails}>
        <Text style={styles.subtitle}>{t("reserveVehicle.duration")}</Text>
        <Text style={styles.priceRow}>
          {t("reserveVehicle.vehiclePrice")}: {obtenerPrecioNumerico(vehicle?.daily_price || "0").toFixed(2)}€ × {dias} días = {precioCoche.toFixed(2)}€
        </Text>
        <Text style={styles.priceRow}>
          Depósito: {vehicle?.deposit ? `${vehicle.deposit}` : '0.00€'}
        </Text>
        <View style={styles.divider} />
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{t("reserveVehicle.totalPrice")}:</Text>
          <Text style={styles.totalPrice}>{precioTotal.toFixed(2)}€</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirmReservation}>
        <Text style={styles.buttonText}>{t("reserveVehicle.buttons.confirmation")}</Text>
      </TouchableOpacity>
      
      <Text style={styles.cancelText}>
        {t("reserveVehicle.cancelDate")}: {fechaCancelacionMax}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3B6ED5",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B6ED5",
    marginBottom: 10,
  },
  dateContainer: {
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  priceDetails: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  priceRow: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginVertical: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3B6ED5",
  },
  button: {
    backgroundColor: "#3B6ED5",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  cancelText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});