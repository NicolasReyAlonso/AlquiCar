import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from '@/components/Theme';

const { width } = Dimensions.get('window');

type Incidence = {
  id: number;
  from_id: string;
  to_id: string | null;
  reservation_id: number | null;
  description: string;
  type: 'USER' | 'PLATFORM';
  status: 'Pending' | 'In Review' | 'Resolved' | 'Dismissed';
  created_at: string;
};

type RootStackParamList = {
  crearIncidencia: undefined;
};

export default function MisIncidencias() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [incidencias, setIncidencias] = useState<Incidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidencias = async () => {
      const userId = await AsyncStorage.getItem('userId');

      try {
        const response = await fetch(`https://tuservidor.com/api/incidences?from_id=${userId}`);
        const data = await response.json();
        setIncidencias(data);
      } catch (error) {
        console.error('Error al obtener incidencias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidencias();
  }, []);

  const renderItem = ({ item }: { item: Incidence }) => (
    <View style={styles.card}>
      <Text style={styles.label}>
        {t('ID de incidencia')}: <Text style={styles.value}>{item.id}</Text>
      </Text>
      <Text style={styles.label}>
        {t('Tipo')}: <Text style={styles.value}>{item.type === 'USER' ? t('Usuario') : t('Plataforma')}</Text>
      </Text>
      {item.to_id && (
        <Text style={styles.label}>
          {t('Contra usuario')}: <Text style={styles.value}>{item.to_id}</Text>
        </Text>
      )}
      {item.reservation_id && (
        <Text style={styles.label}>
          {t('Reserva')}: <Text style={styles.value}>#{item.reservation_id}</Text>
        </Text>
      )}
      <Text style={styles.label}>{t('Descripción')}:</Text>
      <Text style={styles.value}>{item.description}</Text>
      <Text style={styles.label}>
        {t('Estado')}: <Text style={styles.value}>{t(item.status)}</Text>
      </Text>
      <Text style={styles.label}>
        {t('Fecha')}: <Text style={styles.value}>{new Date(item.created_at).toLocaleString()}</Text>
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (incidencias.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.value}>{t('No tienes incidencias registradas')}</Text>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('crearIncidencia')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={incidencias}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('crearIncidencia')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  card: {
    width: width < 500 ? '100%' : 600,
    padding: 20,
    borderWidth: 2,
    borderColor: theme.colors.titles,
    borderRadius: 10,
    backgroundColor: theme.colors.secondary,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.titles,
    fontFamily: theme.fonts.bold,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
