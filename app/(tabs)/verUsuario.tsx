import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

const UserProfileScreen = () => {
  interface Vehicle {
    id: string;
    brand: string;
    model: string;
    owner_id: string;
    registration_date: string;
    daily_price: number;
  }

  interface Reservation {
    id: string;
    customer_id: string;
    to_id: string;
    total_price: number;
    status: string;
    start_date: string;
    end_date: string;
  }

  interface Incidence {
    id: string;
    from_id: string;
    to_id: string;
    description: string;
    created_at: string;
  }

  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [incidences, setIncidences] = useState<Incidence[]>([]);
  const { t } = useTranslation();


  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Usuario no autenticado');
        return;
      }

      // Obtener datos del usuario
      const userUrl = `http://localhost:3000/users/${userId}`;
      const userResponse = await fetch(userUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const user = await userResponse.json();
      setUserData(user[0]);

      // Vehículos del usuario
      const vehicleResponse = await fetch(`http://localhost:3000/vehicles`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const allVehicles = await vehicleResponse.json();
      const userVehicles = allVehicles.filter((id: any) => id.owner_id === userId);
      setVehicles(userVehicles);

      // Reservas del usuario
      const reservationsResponse = await fetch(`http://localhost:3000/reservations`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const allReservations = await reservationsResponse.json();
      const userReservations = allReservations.filter((id: any) => id.customer_id === userId);
      setReservations(userReservations);

      // Incidencias del usuario
      const incidencesResponse = await fetch(`http://localhost:3000/incidences`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const allIncidences = await incidencesResponse.json();
      const userIncidences = allIncidences.filter((id: any) => id.from_id === userId);
      setIncidences(userIncidences);

    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading || !userData) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {t('Perfil.perfil')} {userData.name}</Text>

      <Text style={styles.sectionTitle}>{t('Perfil.vehiculos.vehiculos')}</Text>
      <FlatList
        data={vehicles}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>
            {t('Perfil.vehiculos.marca')}: {item.brand}{"\n"}
            {t('Perfil.vehiculos.modelo')}: {item.model}{"\n"}
            {t('Perfil.vehiculos.registro')} {new Date(item.registration_date).toLocaleDateString()}{"\n"}
            {t('Perfil.vehiculos.precio')} {item.daily_price}€
          </Text>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('Perfil.vehiculos.sinVehiculos')}</Text>}
      />

      <Text style={styles.sectionTitle}>{t('Perfil.reservas.reservas')}</Text>
      <FlatList
        data={reservations}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>
            {t('Perfil.reservas.precio')} {item.total_price}{"\n"}
            {t('Perfil.reservas.estado')} {item.status}{"\n"}
            {t('Perfil.reservas.fechaIn')} {new Date(item.start_date).toLocaleDateString()}{"\n"}
            {t('Perfil.reservas.fechaFin')} {new Date(item.end_date).toLocaleDateString()}
          </Text>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('Perfil.reservas.sinReservas')}</Text>}
      />

      <Text style={styles.sectionTitle}>{t('Perfil.incidencias.incidencias')}</Text>
      <FlatList
        data={incidences}
        renderItem={({ item }) => (
          <Text style={styles.itemText}>
            {t('Perfil.incidencias.id')} {item.id}{"\n"}
            {t('Perfil.incidencias.descripcion')} {item.description}{"\n"}
            {t('Perfil.incidencias.creado')} {new Date(item.created_at).toLocaleDateString()}
          </Text>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>{t('Perfil.incidencias.sinIncidencias')}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'white',
  },
  itemText: {
    color: 'white',
    marginBottom: 10,
  },
  emptyText: {
    color: 'gray',
  },
});

export default UserProfileScreen;
