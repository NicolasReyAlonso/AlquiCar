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
  const [descriptionError, setDescriptionError] = useState('');
  const [reservationIdError, setReservationIdError] = useState('');

  const handleSubmit = async () => {
    const fromId = await AsyncStorage.getItem('userId');
    let hasError = false;
    setDescriptionError('');
    setReservationIdError('');

    if (description.trim().length < 50) {
      setDescriptionError(t('La descripción debe tener al menos 50 caracteres'));
      hasError = true;
    }

    if (type === 'USER' && !reservationId) {
      setReservationIdError(t('Debes indicar un ID de reserva para incidencias hacia usuarios'));
      hasError = true;
    } 

    if (hasError) return;

    const body = {
      from_id: fromId,
      // El backend debería resolver to_id automáticamente si se proporciona reservation_id
      to_id: type === 'USER' ? toId : null,
      reservation_id: type === 'USER' ? reservationId : null,
      description,
      type,
    };

    try {
      const response = await fetch('https://localhost:3000/incidences/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setToId(null);
        setReservationId(null);
        setDescription('');
        setType('PLATFORM');
      } else {
        console.log("No se produjo la creación")
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
        <Text style={styles.label}>{t('Incidencias.tipo')}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={type}
            onValueChange={(value) => setType(value)}
            style={styles.picker}
            dropdownIconColor={theme.colors.text}
          >
            <Picker.Item label={t('Incidencias.plataforma')} value="PLATFORM" color={'black'} />
            <Picker.Item label={t('Incidencias.usuario')} value="USER" color={'black'} />
          </Picker>
        </View>

        {type === 'USER' && (
          <>
            <Text style={styles.label}>{t('Incidencias.reserva')}</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 123"
              placeholderTextColor="black"
              keyboardType="numeric"
              value={reservationId?.toString() || ''}
              onChangeText={(text) => setReservationId(text ? parseInt(text) : null)}
            />
            {reservationIdError ? <Text style={styles.error}>{reservationIdError}</Text> : null}
          </>
        )}

        <Text style={styles.label}>{t('Incidencias.descripcion')}</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          multiline
          numberOfLines={5}
          placeholder={t('Incidencias.problema')}
          placeholderTextColor="black"
          value={description}
          onChangeText={setDescription}
        />
        {descriptionError ? <Text style={styles.error}>{descriptionError}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t('Incidencias.enviar')}</Text>
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
    color: 'black',
    backgroundColor: 'white',
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
    color: 'black',
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
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    fontFamily: theme.fonts.regular,
  },
});

export default CrearIncidencia;
