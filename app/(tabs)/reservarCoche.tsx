import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Image, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DatePickerModal } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ConfirmacionReserva() {
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const [seguro, setSeguro] = useState(false);
  const [pickupDatePickerVisible, setPickupDatePickerVisible] = useState(false);
  const [returnDatePickerVisible, setReturnDatePickerVisible] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [dias, setDias] = useState(1);
  const [precioCoche, setPrecioCoche] = useState(0);
  const [precioSeguro, setPrecioSeguro] = useState(0);
  const [precioTotal, setPrecioTotal] = useState(0);

  const openPickupDatePicker = () => setPickupDatePickerVisible(true);
  const closePickupDatePicker = () => setPickupDatePickerVisible(false);
  const openReturnDatePicker = () => setReturnDatePickerVisible(true);
  const closeReturnDatePicker = () => setReturnDatePickerVisible(false);

  const onPickupDateConfirm = (params: { date: Date | undefined }) => {
    if (params.date) {
      setPickupDate(params.date);
    }
    closePickupDatePicker();
  };

  const onReturnDateConfirm = (params: { date: Date | undefined }) => {
    if (params.date) {
      setReturnDate(params.date);
    }
    closeReturnDatePicker();
  };

  const obtenerPrecioNumerico = (precio: string) => {
    const match = precio.match(/\d+/); 
    return match ? Number(match[0]) : 0;
  };

  const handleConfirmReservation = async () => {
    if (!pickupDate || !returnDate){
      alert('Faltan campos por rellenar');
      return;
    }
  
    const nuevaReserva = {
      brand: reserva.marca,
      price: `${precioTotal}€`,
      date: pickupDate.toLocaleDateString(),
      status: "Confirmada",
      imageUrl: reserva.imagen
    };
  
    try {
      const reservasGuardadas = await AsyncStorage.getItem('reservas');
      const reservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : [];
      reservas.push(nuevaReserva);
      await AsyncStorage.setItem('reservas', JSON.stringify(reservas));
      alert("Reserva confirmada y guardada en Mis Reservas");
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
    }
  };
  
  const reserva = {
    marca: params.brand || 'Desconocido',
    tipo: params.type || 'Desconocido',
    plazas: params.seats || 0,
    transmision: 'Manual',
    precioPorDia: obtenerPrecioNumerico(Array.isArray(params.price) ? params.price[0] : params.price || '0'),
    imagen: params.imageUrl || 'https://via.placeholder.com/100',
    precioSeguroBase: 20,
    ciudad: params.pickupLocation || 'Desconocido',
  };

  useEffect(() => {
    if (pickupDate && returnDate) {
      const diffTime = returnDate.getTime() - pickupDate.getTime();
      const newDias = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setDias(newDias);
      setPrecioCoche(reserva.precioPorDia * newDias);
    }
  }, [pickupDate, returnDate]);

  useEffect(() => {
    setPrecioSeguro(seguro ? reserva.precioSeguroBase : 0);
    setPrecioTotal(precioCoche + (seguro ? reserva.precioSeguroBase : 0));
  }, [seguro, precioCoche]);

  const calcularFechaCancelacion = () => {
    if (!pickupDate) return ''; 
    const fechaCancelacion = new Date(pickupDate);
    fechaCancelacion.setDate(pickupDate.getDate() - 7);
    return fechaCancelacion.toLocaleDateString(); 
  };

  const fechaCancelacionMax = calcularFechaCancelacion();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{t('reserveVehicle.title')}</Text>

      <View style={styles.row}>
        <Image
          source={{ uri: Array.isArray(reserva.imagen) ? reserva.imagen[0] : reserva.imagen }}
          style={styles.image}
        />
        <View>
          <Text style={styles.title}>{reserva.marca}</Text>
          <Text style={styles.text}>{reserva.tipo} - {reserva.plazas} plazas</Text>
          <Text style={styles.text}>{reserva.transmision}</Text>
          <Text style={styles.text}>{t('reserveVehicle.city')}: {reserva.ciudad}</Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <Text style={styles.subtitle}>{t('reserveVehicle.startDate')}</Text> {/* Título separado */}
        <View style={styles.dateRow}>
          <TextInput
            placeholder="Selecciona la fecha"
            placeholderTextColor="gray"
            value={pickupDate ? pickupDate.toLocaleDateString() : ''}
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
          validRange={{ startDate: new Date() }}
        />
      </View>


      <View style={styles.dateContainer}>
        <Text style={styles.subtitle}>{t('reserveVehicle.finishDate')}</Text> {/* Título separado */}
        <View style={styles.dateRow}>
          <TextInput
            placeholder="Selecciona la fecha"
            placeholderTextColor="gray"
            value={returnDate ? returnDate.toLocaleDateString() : ''}
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
          validRange={{ startDate: new Date() }}
        />
      </View>


      <Text style={styles.subtitle}>{t('reserveVehicle.duration')}</Text>
      <Text style={styles.text}>{dias} {t('reserveVehicle.days')}</Text>



      <Text style={styles.text}>{t('reserveVehicle.vehiclePrice')}: {reserva.precioPorDia}€/{t('reserveVehicle.day')} × {dias} {t('reserveVehicle.days')} = {precioCoche}€</Text>
      <Text style={styles.text}>+</Text>
      <Text style={styles.text}>{t('reserveVehicle.insurancePrice')}: {precioSeguro}€</Text>
      <Text style={styles.text}>——————</Text>

      <View style={styles.totalContainer}>
        <Text style={styles.total}>{t('reserveVehicle.totalPrice')}</Text>
        <Text style={styles.total}>{precioTotal}€</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirmReservation}>
        <Text style={styles.buttonText}>{t('reserveVehicle.buttons.confirmation')}</Text>
      </TouchableOpacity>


      <Text style={styles.cancelText}>{t('reserveVehicle.cancelDate')}: {fechaCancelacionMax}</Text>
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
    justifyContent: "flex-end", // Alinea a la derecha
    alignItems: "center", // Asegura que los textos estén alineados verticalmente
    marginTop: 30,
  },
total: {
    fontSize: 28, // Tamaño más grande
    fontWeight: "bold",
    color: "#FFFFFF", // Color blanco para destacar
    textAlign: "right",
    paddingLeft: 10, // Separación con otros elementos
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
    marginRight: 800,
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
  seguro: {
    flexDirection: 'row',
    alignItems:'center',
  },
  dateContainer: {
    marginBottom: 15, // Separación entre el título y el input
  },
});

