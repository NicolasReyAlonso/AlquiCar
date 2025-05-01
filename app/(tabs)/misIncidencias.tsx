import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView
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
  misIncidencias: undefined;
};

export default function MisIncidencias() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [incidencias, setIncidencias] = useState<Incidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminView, setAdminView] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchIncidencias = async (token: string, isAdminUser: boolean, uid: string, viewAll: boolean) => {
    try {
      let url = 'http://localhost:3000/incidences/';
      if (!isAdminUser || (isAdminUser && !viewAll)) {
        url += `?from_id=${uid}`;
      }

      const incidenciasResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const incidenciasData = await incidenciasResponse.json();
      setIncidencias(incidenciasData);
    } catch (error) {
      console.error('Error al obtener incidencias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.error('Usuario no autenticado');
          return;
        }

        const userResponse = await fetch('http://localhost:3000/users/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(user.message || 'Error al obtener datos del usuario');
        }

        const isAdminUser = user[0].role === 'admin';
        setIsAdmin(isAdminUser);
        setUserId(user.id);

        await fetchIncidencias(token, isAdminUser, user.id, true);
      } catch (error) {
        console.error('Error inicial:', error);
      }
    };

    init();
  }, []);

  const toggleAdminView = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || userId === null) return;

    const newView = !adminView;
    setAdminView(newView);
    setLoading(true);
    await fetchIncidencias(token, true, userId, newView);
  };

  const handleAccionIncidencia = async (id: number, action: 'resolve' | 'dismiss') => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const response = await fetch(`http://localhost:3000/incidences/${id}/${action}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error al realizar la acción: ${action}`);
      }

      setIncidencias((prev) =>
        prev.map((inc) =>
          inc.id === id ? { ...inc, status: action === 'resolve' ? 'Resolved' : 'Dismissed' } : inc
        )
      );
    } catch (error) {
      console.error('Error en handleAccionIncidencia:', error);
    }
  };

  const renderItem = ({ item }: { item: Incidence }) => (
    <View style={styles.card}>
      <Text style={styles.label}>
        {t('Incidencias.id')}: <Text style={styles.value}>{item.id}</Text>
      </Text>
      <Text style={styles.label}>
        {t('Incidencias.tipo')}:{' '}
        <Text style={styles.value}>
          {item.type === 'USER' ? t('Incidencias.usuario') : t('Incidencias.platform')}
        </Text>
      </Text>
      {item.reservation_id && (
        <Text style={styles.label}>
          {t('Incidencias.reserva')}: <Text style={styles.value}>#{item.reservation_id}</Text>
        </Text>
      )}
      <Text style={styles.label}>{t('Incidencias.descripcion')}:</Text>
      <Text style={styles.value}>{item.description}</Text>
      <Text style={styles.label}>
        {t('Incidencias.estado')}: <Text style={styles.value}>{t(item.status)}</Text>
      </Text>
      <Text style={styles.label}>
        {t('Incidencias.fecha')}:{' '}
        <Text style={styles.value}>{new Date(item.created_at).toLocaleString()}</Text>
      </Text>

      {isAdmin && item.status === 'Pending' && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAccionIncidencia(item.id, 'resolve')}
          >
            <Text style={styles.buttonText}>{t('Incidencias.resolver')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAccionIncidencia(item.id, 'dismiss')}
          >
            <Text style={styles.buttonText}>{t('Incidencias.denegar')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {isAdmin && (
          <TouchableOpacity style={styles.toggleButton} onPress={toggleAdminView}>
            <Text style={styles.toggleButtonText}>
              {adminView ? t('ModoAdmin.modoUsuario') : t('ModoAdmin.modoAdmin')}
            </Text>
          </TouchableOpacity>
        )}
        {incidencias.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.value}>{t('Incidencias.sinIncidencias')}</Text>
          </View>
        ) : (
          <FlatList
            data={incidencias}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={[styles.container, { paddingBottom: 140 }]}
            ListFooterComponent={<View style={{ height: 60 }} />}
          />
        )}
      </ScrollView>

      {!(isAdmin && adminView) && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('crearIncidencia')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
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
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  toggleButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },  
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
