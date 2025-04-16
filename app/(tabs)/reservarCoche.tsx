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

      <View style={styles.dateRow}>
        <Text style={styles.subtitle}>{t('reserveVehicle.startDate')}</Text>
        <TextInput
          placeholder={t('reserveVehicle.startDate')}
          placeholderTextColor="gray"
          value={pickupDate ? pickupDate.toLocaleDateString() : ''}
          editable={false}
          style={styles.dateInput}
        />
        <TouchableOpacity onPress={openPickupDatePicker}>
          <Icon name="calendar" size={24} color="gray" />
        </TouchableOpacity>
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

      <View style={styles.dateRow}>
        <Text style={styles.subtitle}>{t('reserveVehicle.finishDate')}</Text>
        <TextInput
          placeholder={t('reserveVehicle.finishDate')}
          placeholderTextColor="gray"
          value={returnDate ? returnDate.toLocaleDateString() : ''}
          editable={false}
          style={styles.dateInput}
        />
        <TouchableOpacity onPress={openReturnDatePicker}>
          <Icon name="calendar" size={24} color="gray" />
        </TouchableOpacity>
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

      <Text style={styles.subtitle}>{t('reserveVehicle.totalPrice')}</Text>
      <Text style={styles.text}>{t('reserveVehicle.vehiclePrice')}: {reserva.precioPorDia}€/{t('reserveVehicle.day')} × {dias} {t('reserveVehicle.days')} = {precioCoche}€</Text>
      <Text style={styles.text}>+</Text>
      <Text style={styles.text}>{t('reserveVehicle.insurancePrice')}: {precioSeguro}€</Text>
      <Text style={styles.text}>——————</Text>
      <Text style={styles.total}>{t('reserveVehicle.total')}: {precioTotal}€</Text>

      <TouchableOpacity style={styles.button} onPress={handleConfirmReservation}>
        <Text style={styles.buttonText}>{t('reserveVehicle.buttons.confirmation')}</Text>
      </TouchableOpacity>


      <Text style={styles.cancelText}>{t('reserveVehicle.cancelDate')}: {fechaCancelacionMax}</Text>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  text: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  
  },
  dateInput: {
    fontSize: 18,
    padding: 10,
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    flex: 1,
  },
  total: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  button: {
    backgroundColor: '#4472C4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "white",
    fontFamily: theme.fonts.bold,
  },
  cancelText: {
    fontSize: 20,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
    marginBottom:30,
  },
  seguro: {
    flexDirection: 'row',
    alignItems:'center',
  },
});

