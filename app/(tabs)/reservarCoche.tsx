import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ConfirmacionReserva() {
  const [seguro, setSeguro] = useState(false);
  const router = useRouter();

  // Datos fijos de la reserva
  const reserva = {
    marca: 'Toyota',
    tipo: 'Turismo',
    plazas: 5,
    transmision: 'Automático',
    fechaRecogida: '10/04/2025',
    fechaDevolucion: '15/04/2025',
    precioPorDia: 50,
    dias: 5,
    precioSeguroBase: 20,
    fechaCancelacionMax: '08/04/2025',
    imagen: 'https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg',
  };

  const precioCoche = reserva.precioPorDia * reserva.dias;
  const precioSeguro = seguro ? reserva.precioSeguroBase : 0;
  const precioTotal = precioCoche + precioSeguro;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resumen de la reserva</Text>
      <View style={styles.carInfo}>
      <Image source={{ uri: reserva.imagen }} style={styles.carImage} />
        <View>
          <Text style={styles.carBrand}>{reserva.marca}</Text>
          <Text style={styles.carType}>{reserva.tipo} - {reserva.plazas} plazas</Text>
          <Text style={styles.carTransmission}>{reserva.transmision}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Fecha de recogida</Text>
      <Text style={styles.information}>{reserva.fechaRecogida}</Text>
      
      <Text style={styles.sectionTitle}>Fecha de devolución</Text>
      <Text style={styles.information}>{reserva.fechaDevolucion}</Text>

      <Text style={styles.sectionTitle}>Precio del seguro</Text>
      <Text style={styles.information}>Precio: {reserva.precioSeguroBase}€</Text>
      <Switch value={seguro} onValueChange={setSeguro} />
      <Text style={styles.information}>Añadir seguro</Text>

      <Text style={styles.sectionTitle}>Precio total</Text>
      <Text style={styles.information}>Precio coche: {reserva.precioPorDia}€/día × {reserva.dias} días = {precioCoche}€</Text>
      <Text style={styles.information}>+</Text>
      <Text style={styles.information}>Precio seguro: {precioSeguro}€</Text>
      <Text style={styles.information}>——————</Text>
      <Text style={styles.totalPrice}>Total: {precioTotal}€</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={() => alert('Reserva confirmada')}>
        <Text style={styles.confirmButtonText}>Confirmar Reserva</Text>
      </TouchableOpacity>
      <Text style={styles.cancelText}>Fecha de cancelación máxima: {reserva.fechaCancelacionMax}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'white',
  },
  information: {
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  carInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  carImage: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  carBrand: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  carType: {
    fontSize: 20,
    color: 'gray',
  },
  carTransmission: {
    fontSize: 20,
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#4472C4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    fontSize: 20,
    color: 'gray',
    marginTop: 10,
    textAlign: 'center',
  },
});
