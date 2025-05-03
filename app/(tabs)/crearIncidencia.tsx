import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const CrearIncidencia = () => {
  const { t } = useTranslation();

  const [type, setType] = useState<'USER' | 'PLATFORM'>('PLATFORM');
  const [toId, setToId] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [descriptionError, setDescriptionError] = useState('');
  const [reservationIdError, setReservationIdError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSubmit = async () => {
    const fromId = userId;
    let hasError = false;
    setDescriptionError('');
    setReservationIdError('');

    if (!fromId) {
      Alert.alert(t('Error'), t('No se ha encontrado tu sesión. Inicia sesión nuevamente.'));
      return;
    }

    if (description.trim().length < 10) {
      setDescriptionError(t('La descripción debe tener al menos 10 caracteres'));
      hasError = true;
    }

    if (type === 'USER' && (!reservationId || isNaN(reservationId))) {
      setReservationIdError(t('Debes indicar un ID de reserva válido'));
      hasError = true;
    }

    if (hasError) return;

    const body: any = {
      from_id: fromId,
      description: description.trim(),
      type,
      status,
    };

    if (type === 'USER') {
      body.reservation_id = reservationId;
      const response = await fetch(`http://localhost:3000/reservations/${reservationId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const reserva = await response.json();
        setToId(reserva[0].customer_id);
        body.to_id = reserva[0].customer_id
       }
    }
    try {
      const response = await fetch('http://localhost:3000/incidences/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setToId(null);
        setReservationId(null);
        setDescription('');
        setType('PLATFORM');
        setStatus('Pending');
        Alert.alert(t('Éxito'), t('La incidencia fue creada correctamente'));
        navigation.navigate('misIncidencias')
      } else {
        const errorData = await response.json();
        Alert.alert(t('Error'), t('No se pudo crear la incidencia'));
      }
    } catch (error) {
      Alert.alert(t('Error'), t('Error de red'));
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

        const userResponse = await fetch('http://localhost:3000/users/getdata/', {
          method: 'GET',
          credentials: 'include'
        });

        const user = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(user.message || 'Error al obtener datos del usuario');
        }
        setUserId(user[0].id);
      } catch (error) {
        console.error('Error inicial:', error);
      }
    };

    init();
  }, []);
  

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
            <Picker.Item label={t('Incidencias.plataforma')} value="PLATFORM" color="black" />
            <Picker.Item label={t('Incidencias.usuario')} value="USER" color="black" />
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
              value={reservationId !== null ? reservationId.toString() : ''}
              onChangeText={(text) => {
                const number = parseInt(text);
                setReservationId(!isNaN(number) ? number : null);
              }}
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
