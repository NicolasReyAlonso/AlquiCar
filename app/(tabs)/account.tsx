import React from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from "@/components/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

export default function AccountPage() {
  const nombre = "Nelson";
  const email = "Nelso@ulpgc.es";
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { t } = useTranslation();
  
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
        <Text style={styles.info}>{t('Account.name')} {nombre}</Text>
        <Text style={styles.info}>Email: {email}</Text>
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
