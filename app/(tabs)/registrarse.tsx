import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import theme from '@/components/Theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const { t } = useTranslation();

  const isValidEmail = (email: string) => {
    return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const handleRegister = () => {
    if (
      !name ||
      !birthYear ||
      !address ||
      !city ||
      !phone ||
      !dni ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert('Faltan campos por rellenar');
      return;
    }
    if (name.length < 3) {
      alert('El nombre debe tener al menos 3 caracteres');
      return;
    }
    const numericBirthYear = Number(birthYear);
    if (isNaN(numericBirthYear) || numericBirthYear < 1925 || numericBirthYear >= 2007) {
      alert('Debe ser un año válido');
      return;
    }
    if (address.length < 5) {
      alert('La dirección debe tener al menos 5 caracteres');
      return;
    }
    if (city.length < 3) {
      alert('La ciudad debe tener al menos 3 caracteres');
      return;
    }
    if (!/^\d{9}$/.test(phone)) {
      alert('El teléfono debe tener 9 dígitos');
      return;
    }
    if (!/^\d{8}[A-Za-z]$/.test(dni)) {
      alert('El DNI debe tener 8 números seguidos de una letra');
      return;
    }
    if (!isValidEmail(email)) {
      alert('Ingrese un email válido');
      return;
    }
    if (!isValidPassword(password)) {
      alert('La contraseña debe tener al menos 8 caracteres y contener al menos un número');
      return;
    }
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log(`Nombre: ${name}, Año de nacimiento: ${birthYear}, Dirección: ${address}, Ciudad: ${city}, Teléfono: ${phone}, DNI: ${dni}, Email: ${email}, Contraseña: ${password}`);
    // Fetch/post al backend.

    // Luego de recibir respuesta positiva:
    navigation.navigate('VerifyEmail')
  };

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>{t('Register.title')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('Register.card.name')}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={t('Register.card.birthday')}
          value={birthYear}
          onChangeText={setBirthYear}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder={t('Register.card.address')}
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder={t('Register.card.city')}
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder={t('Register.card.phone')}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder={t('Register.card.dni')}
          value={dni}
          onChangeText={setDni}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder={t('Register.card.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder={t('Register.card.repeatPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>{t('Register.buttons.register')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: 50,
  },
  container: {
    width: width < 500 ? 300 : 600,
    backgroundColor: theme.colors.secondary,
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4472C4',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.titles,
    fontFamily: theme.fonts.bold,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4472C4',
    backgroundColor: 'white',
    color: theme.lightTemplate.textColor,
    fontFamily: theme.fonts.regular,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#4472C4',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
});
