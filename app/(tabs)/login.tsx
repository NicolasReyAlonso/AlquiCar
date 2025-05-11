import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from "@/components/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useTranslation } from 'react-i18next';
import { useFonts } from 'expo-font';
import { getApiUrl } from '@/utils/getApiUrl';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  Home: 'account'; 
  Register: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log(data)
    

      if (!response.ok) {
        if(data.error === 'Usuario no verificado') {
          alert('Falta la verificación de tu cuenta. Por favor, revisa tu correo electrónico para verificar tu cuenta.');
          return;
        }
        alert('Email o contraseña incorrectos');
        return;
      }
      console.log("token: ", data.token)
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      navigation.navigate("account");
    } catch (error) {
      alert('No se pudo conectar con el servidor. Inténtalo más tarde.');
      console.error('Login error:', error);
    }
  };
  

  const handleRegister = () => {
    navigation.navigate("registrarse");
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{t('Login.title')}</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder={t('Login.password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.touchableButton} onPress={handleLogin}>
            <Text style={styles.touchableText}>{t('Login.buttons.login')}</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>o</Text>
          <TouchableOpacity style={styles.touchableButton} onPress={handleRegister}>
            <Text style={styles.touchableText}>{t('Login.buttons.register')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  formContainer: {
    width: width < 500 ? 300 : 600, 
    padding: 20,
    borderWidth: 2,
    borderColor: '#4472C4',
    borderRadius: 10,
    backgroundColor: theme.colors.secondary,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.titles,
    fontFamily: theme.fonts.bold,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4472C4',
    backgroundColor: 'white',
    fontFamily: theme.fonts.regular,
    color: theme.lightTemplate.textColor,
  },
  buttonContainer: {
    marginTop: 10,
  },
  touchableButton: {
    backgroundColor: '#4472C4',
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
  separator: {
    textAlign: 'center',
    color: '#888',
    fontSize: 18,
    marginVertical: 10,
  },
});
