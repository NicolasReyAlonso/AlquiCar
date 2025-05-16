import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'Reserva confirmada', description: 'Tu reserva ha sido confirmada.', date: '2025-05-13' },
  { id: '2', title: 'Incidencia resuelta', description: 'Tu incidencia ha sido resuelta.', date: '2025-05-12' },
  { id: '3', title: 'Nuevo mensaje', description: 'Has recibido un nuevo mensaje.', date: '2025-05-11' },
];

export default function NotificacionesScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO LLAMADA AL BACK
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <Ionicons name="notifications-outline" size={24} color="#4472C4" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4472C4" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#4472C4',
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f1f4ff',
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
