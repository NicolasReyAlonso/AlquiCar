import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from "@/components/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AccountPage() {
  const nombre = "Nelson";
  const email = "Nelso@ulpgc.es";
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
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
      <Text style={styles.title}>Detalles de la Cuenta</Text>
      <Image source={require('@/assets/images/avatar.png')} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Nombre: {nombre}</Text>
        <Text style={styles.info}>Email: {email}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button title="Mis Reservas" onPress={handleReservas} />
        </View>
        <View style={styles.button}>
          <Button title="Mis Publicaciones" onPress={handlePublicaciones} />
        </View>
        <View style={styles.button}>
          <Button title="Cerrar Sesión" onPress={handleCerrarSesion} />
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
  title: {
    fontSize: 26,
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
    color: theme.lightTemplate.textColor, 
    marginBottom: 5,
    fontFamily: theme.fonts.regular,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    marginVertical: 10,
    borderRadius: 8, 
    overflow: 'hidden', 
  },
});
