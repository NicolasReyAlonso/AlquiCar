import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import theme from "@/components/Theme";

interface Incidencia {
  descripcion: string;
  categoria: string;
  fecha: string;
  estado: string;
}

const MisIncidencias = () => {
  const { t } = useTranslation();
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const cargarIncidencias = async () => {
      try {
        const datos = await AsyncStorage.getItem('incidencias');
        const lista = datos ? JSON.parse(datos) : [];
        setIncidencias(lista);
      } catch (error) {
        console.error('Error al cargar incidencias:', error);
      }
    };

    cargarIncidencias();
  }, []);

  const handleCrearIncidencia = () => {
    navigation.navigate("crearIncidencia");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Incidencias.misIncidencias')}</Text>

      {incidencias.length === 0 ? (
        <Text style={styles.noIncidencias}>{t('Incidencias.sinIncidencias') || 'No tienes incidencias registradas.'}</Text>
      ) : (
        <FlatList
          data={incidencias}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.bold}>{t('Incidencias.descripcion')}: </Text>
              <Text>{item.descripcion}</Text>
              <Text style={styles.bold}>{t('Incidencias.category')}: </Text>
              <Text>{item.categoria}</Text>
              <Text style={styles.bold}>{t('Incidencias.fecha')}: </Text>
              <Text>{item.fecha}</Text>
              <Text style={styles.bold}>{t('Incidencias.estado')}: </Text>
              <Text>{item.estado}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.touchableButton} onPress={handleCrearIncidencia}>
        <Text style={styles.touchableText}>{t('Incidencias.crear')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MisIncidencias;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.titles,
    fontFamily: theme.fonts.bold,
  },
  noIncidencias: {
    color: "gray",
    fontFamily: theme.fonts.regular,
  },
  item: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  touchableButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  touchableText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
});
