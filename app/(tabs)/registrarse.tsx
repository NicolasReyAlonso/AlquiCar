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
import { getApiUrl } from '@/utils/getApiUrl';

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
  const [errors, setErrors] = useState({
    name: '',
    birthYear: '',
    address: '',
    phone: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const handleRegister = () => {
   setSubmitAttempted(true);
  let valid = true;
  const newErrors = {
    name: '',
    birthYear: '',
    address: '',
    phone: '',
    city: '', 
    dni: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  if (!name) {
    newErrors.name = 'Nombre requerido';
    valid = false;
  } else if (name.length < 3) {
    newErrors.name = 'Mínimo 3 caracteres';
    valid = false;
  }

  if (!birthYear) {
    newErrors.birthYear = 'Año de nacimiento requerido';
    valid = false;
  } else {
    const numericBirthYear = Number(birthYear);
    if (isNaN(numericBirthYear) || numericBirthYear < 1925 || numericBirthYear >= 2007) {
      newErrors.birthYear = 'Año inválido (1925-2006)';
      valid = false;
    }
  }

  if (!city) {
  newErrors.city = 'Ciudad requerida';
  valid = false;
  } else if (city.length < 3) {
    newErrors.city = 'Mínimo 3 caracteres';
    valid = false;
  }

  if (!address) {
    newErrors.address = 'Dirección requerida';
    valid = false;
  }

  if (!phone) {
    newErrors.phone = 'Teléfono requerido';
    valid = false;
  } else if (!/^\d{9}$/.test(phone)) {
    newErrors.phone = '9 dígitos requeridos';
    valid = false;
  }

  if (!dni) {
    newErrors.dni = 'DNI requerido';
    valid = false;
  } else if (!/^\d{8}[A-Za-z]$/.test(dni)) {
    newErrors.dni = 'Formato inválido (8 números + letra)';
    valid = false;
  }

  if (!email) {
    newErrors.email = 'Email requerido';
    valid = false;
  } else if (!isValidEmail(email)) {
    newErrors.email = 'Email inválido';
    valid = false;
  }

  if (!password) {
    newErrors.password = 'Contraseña requerida';
    valid = false;
  } else if (!isValidPassword(password)) {
    newErrors.password = 'Mínimo 8 caracteres con números';
    valid = false;
  }

  if (!confirmPassword) {
    newErrors.confirmPassword = 'Confirma tu contraseña';
    valid = false;
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Las contraseñas no coinciden';
    valid = false;
  }

  setErrors(newErrors);

  if (!valid) return;

    console.log(`Nombre: ${name}, Año de nacimiento: ${birthYear}, Dirección: ${address}, Ciudad: ${city}, Teléfono: ${phone}, DNI: ${dni}, Email: ${email}, Contraseña: ${password}`);
    fetch(`${getApiUrl()}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        address,
        phone,
        dni,
        email,
        password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en el registro');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Registro exitoso:', data);
        navigation.navigate('VerifyEmail');
      })
      .catch((error) => {
        console.error('Error en el registro:', error);
        alert('No se pudo completar el registro. Inténtalo más tarde.');
      });

    // Luego de recibir respuesta positiva:
    navigation.navigate('VerifyEmail')
  };

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>{t('Register.title')}</Text>
        <TextInput
          style={[
            styles.input,
            submitAttempted && errors.name && styles.errorInput
          ]}
          placeholder={t('Register.card.name')}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (submitAttempted) {
              setErrors({...errors, name: text ? '' : 'Nombre requerido'});
            }
          }}
        />
        {submitAttempted && errors.name && (
          <Text style={styles.errorText}>{errors.name}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            submitAttempted && errors.birthYear && styles.errorInput
          ]}
          placeholder="Año de nacimiento"
          value={birthYear}
          onChangeText={(text) => {
            setBirthYear(text);
            if (submitAttempted) {
              const numeric = Number(text);
              setErrors({
                ...errors,
                birthYear: !text ? 'Año requerido' : 
                          isNaN(numeric) ? 'Debe ser un número' :
                          numeric < 1925 || numeric >= 2007 ? 'Debe estar entre 1925-2006' : ''
              });
            }
          }}
          keyboardType="numeric"
          maxLength={4}
        />
        {submitAttempted && errors.birthYear && (
          <Text style={styles.errorText}>{errors.birthYear}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            submitAttempted && errors.city && styles.errorInput
          ]}
          placeholder="Ciudad"
          value={city}
          onChangeText={(text) => {
            setCity(text);
            if (submitAttempted) {
              setErrors({
                ...errors,
                city: !text ? 'Ciudad requerida' : 
                      text.length < 3 ? 'Mínimo 3 caracteres' : ''
              });
            }
          }}
        />
        {submitAttempted && errors.city && (
          <Text style={styles.errorText}>{errors.city}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            submitAttempted && errors.phone && styles.errorInput
          ]}
          placeholder={t('Register.card.phone')}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (submitAttempted) {
              setErrors({
                ...errors,
                phone: !text ? 'Teléfono requerido' : 
                      !/^\d{9}$/.test(text) ? '9 dígitos requeridos' : ''
              });
            }
          }}
          keyboardType="phone-pad"
        />
        {submitAttempted && errors.phone && (
          <Text style={styles.errorText}>{errors.phone}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            submitAttempted && errors.dni && styles.errorInput
          ]}
          placeholder={t('Register.card.dni')}
          value={dni}
          onChangeText={(text) => {
            setDni(text);
            if (submitAttempted) {
              setErrors({
                ...errors,
                dni: !text ? 'DNI requerido' : 
                    !/^\d{8}[A-Za-z]$/.test(text) ? 'Formato inválido (8 números + letra)' : ''
              });
            }
          }}
        />
        {submitAttempted && errors.dni && (
          <Text style={styles.errorText}>{errors.dni}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            submitAttempted && errors.email && styles.errorInput
          ]}
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (submitAttempted) {
              setErrors({
                ...errors,
                email: !text ? 'Email requerido' : 
                      !isValidEmail(text) ? 'Email inválido' : ''
              });
            }
          }}
          keyboardType="email-address"
        />
        {submitAttempted && errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            submitAttempted && errors.password && styles.errorInput
          ]}
          placeholder={t('Register.card.password')}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (submitAttempted) {
              setErrors({
                ...errors,
                password: !text ? 'Contraseña requerida' : 
                        !isValidPassword(text) ? 'Mínimo 8 caracteres con números' : ''
              });
            }
          }}
          secureTextEntry
        />
        {submitAttempted && errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            submitAttempted && errors.confirmPassword && styles.errorInput
          ]}
          placeholder={t('Register.card.repeatPassword')}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (submitAttempted) {
              setErrors({
                ...errors,
                confirmPassword: !text ? 'Confirma tu contraseña' : 
                                password !== text ? 'Las contraseñas no coinciden' : ''
              });
            }
          }}
          secureTextEntry
        />
        {submitAttempted && errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
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
  errorInput: {
  borderColor: 'red',
  borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
    fontFamily: theme.fonts.regular,
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
