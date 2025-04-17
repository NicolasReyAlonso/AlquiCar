import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import theme from "@/components/Theme";

const CrearIncidencia = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState('');

  const handleCrearIncidencia = async () => {
    if (!descripcion || !categoria || !fecha) {
      Alert.alert(t('errors.missingFields') || 'Por favor, completa todos los campos');
      return;
    }

    const nuevaIncidencia = {
      descripcion,
      categoria,
      fecha,
      estado: 'Pendiente',
    };

    // Aquí iría el guardado real con AsyncStorage
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>{t('Incidencias.descripcion')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('Incidencias.descripcion')}
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Text style={styles.label}>{t('Incidencias.categoria')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('Incidencias.categoria')}
        value={categoria}
        onChangeText={setCategoria}
      />

      <Text style={styles.label}>{t('Incidencias.fecha')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('Incidencias.formatoFecha')}
        value={fecha}
        onChangeText={setFecha}
      />

      <Button title={t('Incidencias.crear')} onPress={handleCrearIncidencia} color={theme.colors.primary} />
    </ScrollView>
  );
};

export default CrearIncidencia;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
    gap: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: theme.colors.titles,
    fontFamily: theme.fonts.bold,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: theme.lightTemplate.textColor,
    fontFamily: theme.fonts.regular,
  },
});
