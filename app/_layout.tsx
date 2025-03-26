import React, { useState, ReactNode } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Link, useNavigation } from 'expo-router';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage
import theme from '../components/Theme';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

interface LayoutProps {
  children: ReactNode;
}

type RootStackParamList = {
  Home: 'index';  // Cambia esto al nombre de la pantalla a la que quieres ir
  Register: undefined;
};

// Función para comprobar el estado del login
async function checkLoginStatus() {
  const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  return isLoggedIn === 'true';
}

export default function Layout({ children }: LayoutProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? 'white' : 'black';
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const handleLogin = async () => {
    
    const isLoggedIn = await checkLoginStatus();
    if (isLoggedIn) {
      navigation.navigate('account');
    } else {
      navigation.navigate('login');
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (query: string) => {
    if (Platform.OS === "web") {
      window.alert("Búsqueda de " + query);
    }
    Alert.alert(
      "Resultado de la búsqueda",
      "Búsqueda de " + query
    );
    setSearchQuery('');
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* SafeAreaView para respetar el notch */}
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={(event) => handleSearch(event.nativeEvent.text)}
            />
            <View style={styles.headerRight}>
            
                <Ionicons name="person-circle-outline" onPress={handleLogin} size={30} color="white" />
              
              <Button title="Menú" onPress={() => setIsMenuOpen(!isMenuOpen)} />
            </View>
          </View>
        </SafeAreaView>

        {/* Menú desplegable */}
        {isMenuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.closeButton}>✖ Cerrar</Text>
            </TouchableOpacity>
            <Link style={styles.menuItem} href="/" onPress={() => setIsMenuOpen(false)}>
              <FontAwesome name="home" size={24} color={color} />
              <Text style={styles.menuItem}>HomePage</Text>
            </Link>
            <Link style={styles.menuItem} href="misReservas" onPress={() => setIsMenuOpen(false)}>
              <FontAwesome5 name="shopping-cart" size={24} color={color}></FontAwesome5>
              <Text style={styles.menuItem}>Mis Reservas</Text>
            </Link>
            <Link style={styles.menuItem} href="misCochesPublicados" onPress={() => setIsMenuOpen(false)}>
              <FontAwesome5 name="car" size={24} color={color}></FontAwesome5>
              <Text style={styles.menuItem}>Publicaciones</Text>
            </Link>
            <Link style={styles.menuItem} href="login" onPress={() => setIsMenuOpen(false)}>
              <FontAwesome name="sign-in" size={24} color={color} />
              <Text style={styles.menuItem}>Iniciar Sesión</Text>
            </Link>
            <Text style={styles.menuItem}>Configuración</Text>
          </View>
        )}

        {/* Contenido principal */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#4472C4', // Ajusta el color del fondo según sea necesario
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#4472C4',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  headerRight: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 50, // Para que no tape el header
    width: 250,
    backgroundColor: '#4472C4',
    padding: 20,
    zIndex: 1000,
  },
  closeButton: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  menuItem: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
});
