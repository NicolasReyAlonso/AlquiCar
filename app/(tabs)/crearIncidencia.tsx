import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '@/components/Theme';

const CrearIncidencia = () => {
  const { t } = useTranslation();

  const [type, setType] = useState<'USER' | 'PLATFORM'>('PLATFORM');
  const [toId, setToId] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const fromId = await AsyncStorage.getItem('userId');

    const body = {
      from_id: fromId,
      to_id: type === 'USER' ? toId : null,
      reservation_id: reservationId,
      description,
      type,
    };

    try {
      const response = await fetch('https://tuservidor.com/api/incidences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        Alert.alert(t('Éxito'), t('Incidencia enviada correctamente'));
        setToId(null);
        setReservationId(null);
        setDescription('');
        setType('PLATFORM');
      } else {
        Alert.alert(t('Error'), t('Error al enviar la incidencia'));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t('Error'), t('Error de red'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>{t('Tipo de incidencia')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={type}
            onValueChange={(value) => setType(value)}
            style={styles.picker}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label={t('Plataforma')} value="PLATFORM" />
            <Picker.Item label={t('Usuario')} value="USER" />
          </Picker>
        </View>

        {type === 'USER' && (
          <>
            <Text style={styles.label}>{t('ID del usuario involucrado')}</Text>
            <TextInput
              style={styles.input}
              placeholder="UUID usuario"
              placeholderTextColor="#888"
              value={toId || ''}
              onChangeText={setToId}
            />
          </>
        )}

        <Text style={styles.label}>{t('ID de la reserva (opcional)')}</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 123"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={reservationId?.toString() || ''}
          onChangeText={(text) => setReservationId(text ? parseInt(text) : null)}
        />

        <Text style={styles.label}>{t('Descripción')}</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={5}
          placeholder={t('Describe el problema')}
          placeholderTextColor="#888"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t('Enviar')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
    color: theme.colors.titles,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.titles,
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text,
    backgroundColor: theme.colors.secondary,
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: theme.colors.titles,
    borderRadius: 8,
    backgroundColor: theme.colors.secondary,
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.text,
    height: 50,
  },
  button: {
    marginTop: 30,
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});

export default CrearIncidencia;
