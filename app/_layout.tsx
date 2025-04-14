import React, { useState, ReactNode, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, TouchableOpacity, Text, Alert, Platform, ActivityIndicator } from 'react-native';
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
import i18n from '../assets/location/i18n';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();
  
  const handleLogin = async () => {
    
    const isLoggedIn = await checkLoginStatus();
    if (isLoggedIn) {
      navigation.navigate('account');
    } else {
      navigation.navigate('login');
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    if (Platform.OS !== 'web') {
      await AsyncStorage.setItem('appLanguage', lng);
    } else {
      localStorage.setItem('appLanguage', lng);
    }
  };

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

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Espera ligera para asegurar i18n
      setAppIsReady(true);
    };
    init();
  }, []);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4472C4" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* SafeAreaView para respetar el notch */}
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => setIsLangMenuOpen(!isLangMenuOpen)}
              >
                <Ionicons name="globe-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
              <Ionicons name="person-circle-outline" onPress={handleLogin} size={30} color="white" />
              <Button title={t('layout.Menu')} onPress={() => setIsMenuOpen(!isMenuOpen)} />
            </View>
          </View>
        </SafeAreaView>

        {isLangMenuOpen && (
          <View style={styles.languageMenu}>
            <TouchableOpacity onPress={() => changeLanguage('es')}>
              <Text style={styles.languageOption}>🇪🇸 Español</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('en')}>
              <Text style={styles.languageOption}>🇬🇧 English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('fr')}>
              <Text style={styles.languageOption}>🇫🇷 Français</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('de')}>
              <Text style={styles.languageOption}>🇩🇪 Deutsch</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('it')}>
              <Text style={styles.languageOption}>🇮🇹 Italiano</Text>
            </TouchableOpacity>
          </View>
)}


        {/* Menú desplegable */}
        {isMenuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.closeButton}>{t('layout.menuButtons.close')}</Text>
            </TouchableOpacity>
            <Link style={styles.menuItem} href="/" onPress={() => setIsMenuOpen(false)}>
              <FontAwesome name="home" size={24} color={color} />
              <Text style={styles.menuItem}>{t('layout.menuButtons.home')}</Text>
            </Link>
            <Link style={styles.menuItem} href="misReservas" onPress={() => setIsMenuOpen(false)}>
              <FontAwesome5 name="shopping-cart" size={24} color={color}></FontAwesome5>
              <Text style={styles.menuItem}>{t('layout.menuButtons.reservations')}</Text>
            </Link>
            <Link style={styles.menuItem} href="misCochesPublicados" onPress={() => setIsMenuOpen(false)}>
              <FontAwesome5 name="car" size={24} color={color}></FontAwesome5>
              <Text style={styles.menuItem}>{t('layout.menuButtons.publications')}</Text>
            </Link>
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
    padding: 10,
    backgroundColor: '#4472C4',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerRight: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  headerLeft: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
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
  languageMenu: {
    position: 'absolute',
    top: 60,
    left: 15,
    flexDirection: 'column',
    backgroundColor: '#4472C4',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  languageOption: {
    fontSize: 18,
    color: 'white',
    marginVertical: 5,
  },
});
