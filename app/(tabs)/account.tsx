import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from "@/components/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';

export default function AccountPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();

  const [userName, setName] = useState('');
  const [userEmail, setEmail] = useState('');

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);

      if (!token) {
        Alert.alert("Error", "Usuario no autenticado");
        return;
      }

      const email = await AsyncStorage.getItem("email");
      console.log(email);
      const response = await fetch(`http://localhost:3000/users/email/${email}`);
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los datos");
      }
      setName(data.name);
      setEmail(data.email)
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  fetchUserData();
}, []);

  const handleReservas = () => {
    navigation.navigate("misReservas");
  };

  const handlePublicaciones = () => {
    navigation.navigate("misCochesPublicados");
  };
  const handleCerrarSesion = async () =>{
    await AsyncStorage.setItem("isLoggedIn", "false");
    navigation.navigate("index");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('Account.title')}</Text>
      <Image source={require('@/assets/images/avatar.png')} style={styles.avatar} />
  <View style={styles.infoContainer}>
    <Text style={styles.info}>{t('Account.name')}: {userName}</Text>
    <Text style={styles.info}>Email: {userEmail}</Text>
  </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReservas}>
          <Text style={styles.buttonText}>{t('Account.buttons.reservations')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePublicaciones}>
          <Text style={styles.buttonText}>{t('Account.buttons.publications')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCerrarSesion}>
          <Text style={styles.buttonText}>{t('Account.buttons.logout')}</Text>
        </TouchableOpacity>
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
    
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.titles, 
    fontFamily: theme.fonts.bold,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.secondary, 
  },
  infoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  info: {
    fontSize: 18,
    color: theme.colors.text, 
    marginBottom: 5,
    fontFamily: theme.fonts.regular,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    width: '80%',
    backgroundColor:theme.colors.tabColor,
    marginVertical: 10,
    borderRadius: 8, 
    overflow: 'hidden', 
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 24,
    padding: 10,
    alignSelf: 'center'
  }
});
