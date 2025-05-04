import React, { useState, ReactNode, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Platform, ActivityIndicator, StyleSheet, useColorScheme, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Link, useNavigation } from 'expo-router';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from '../components/Theme';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import i18n from '../assets/location/i18n';
import { useTranslation } from 'react-i18next';
import { Picker } from "@react-native-picker/picker";


interface LayoutProps {
  children: ReactNode;
}

type RootStackParamList = {
  Home: 'index';
  Register: undefined;
};

async function checkLoginStatus() {
  const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  return isLoggedIn === 'true';
}

export default function Layout({ children }: LayoutProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? 'white' : 'black';
  const [appIsReady, setAppIsReady] = useState(false);
  const { t } = useTranslation();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    transmission: "",
    fuel_type: "",
  });

  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setAppIsReady(true);
    };
    init();
  }, []);

  const handleLogin = async () => {
    const isLoggedIn = await checkLoginStatus();
    if (isLoggedIn) {
      navigation.navigate('account');
    } else {
      navigation.navigate('login');
    }
  };

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    if (Platform.OS !== 'web') {
      await AsyncStorage.setItem('appLanguage', lng);
    } else {
      localStorage.setItem('appLanguage', lng);
    }
  };

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
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image
                source={require('@/assets/images/logo2.png')}
                style={styles.logo}
              />
              <TouchableOpacity
                style={styles.touchableButton}
                onPress={() => setIsLangMenuOpen(!isLangMenuOpen)}
              >
                <Ionicons name="globe-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
              <Ionicons name="person-circle-outline" onPress={handleLogin} size={30} color="white" />
              <TouchableOpacity style={styles.touchableButton} onPress={() => setIsMenuOpen(!isMenuOpen)}>
                <Text style={styles.touchableButtonText}>{t('layout.Menu')}</Text>
              </TouchableOpacity>


              {/* Botón para abrir el menú de filtros */}
              <TouchableOpacity
                style={styles.touchableButton}
                onPress={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Ionicons name="filter-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>

          </View>
        </SafeAreaView>

        {isFilterMenuOpen && (
          <View style={styles.filterMenu}>
            <Text style={styles.filterTitle}>{t('layout.filter')}</Text>

            {/* Filtro por Marca */}
            <Text style={styles.filterLabel}>{t('layout.brand')}</Text>
            <TouchableOpacity
              onPress={() => {
                setFilters({ ...filters, brand: "Hyundai" });
                setIsFilterMenuOpen(false);
                navigation.navigate("resultadosFiltrados", { filters: { ...filters, brand: "Hyundai" } });
              }}
            >
              <Text style={styles.filterOption}>Hyundai</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFilters({ ...filters, brand: "BMW" });
                setIsFilterMenuOpen(false);
                navigation.navigate("resultadosFiltrados", { filters: { ...filters, brand: "BMW" } });
              }}
            >
              <Text style={styles.filterOption}>BMW</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFilters({ ...filters, brand: "Citroën" });
                setIsFilterMenuOpen(false);
                navigation.navigate("resultadosFiltrados", { filters: { ...filters, brand: "Citroën" } });
              }}
            >
              <Text style={styles.filterOption}>Citroën</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setFilters({ ...filters, brand: "Nissan" });
                setIsFilterMenuOpen(false);
                navigation.navigate("resultadosFiltrados", { filters: { ...filters, brand: "Nissan" } });
              }}
            >
              <Text style={styles.filterOption}>Nissan</Text>
            </TouchableOpacity>

            {/* Filtro por Tipo */}
            <Text style={styles.filterLabel}>{t('layout.type')}:</Text>
            <TouchableOpacity
              onPress={() => {
                setFilters({ ...filters, type: "SUV" });
                setIsFilterMenuOpen(false);
                navigation.navigate("resultadosFiltrados", { filters: { ...filters, type: "SUV" } });
              }}
            >
              <Text style={styles.filterOption}>SUV</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setFilters({ ...filters, type: "Sedan" });
                setIsFilterMenuOpen(false);
                navigation.navigate("resultadosFiltrados", { filters: { ...filters, type: "Sedan" } });
              }}
            >
              <Text style={styles.filterOption}>Sedan</Text>
            </TouchableOpacity>
          </View>
        )}


        {isFilterMenuOpen && (
          <View style={styles.filterMenu}>
            <Text style={styles.filterTitle}>{t('layout.filter')}:</Text>

            {/* Filtro por Marca */}
            <Text style={styles.filterLabel}>{t('layout.brand')}:</Text>
            <Picker
              selectedValue={filters.brand}
              onValueChange={(itemValue) => setFilters({ ...filters, brand: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label={t('layout.todas')} value="" />
              <Picker.Item label="Hyundai" value="Hyundai" />
              <Picker.Item label="Citroën" value="Citroën" />
              <Picker.Item label="Nissan" value="Nissan" />
              <Picker.Item label="BMW" value="BMW" />
              <Picker.Item label="Toyota" value="Toyota" />
              <Picker.Item label="Ford" value="Ford" />
              <Picker.Item label="Tesla" value="Tesla" />
              <Picker.Item label="Mercedes-Benz" value="Mercedes-Benz" />
              <Picker.Item label="Volkswagen" value="Volkswagen" />
              <Picker.Item label="Audi" value="Audi" />
            </Picker>

            {/* Filtro por Tipo */}
            <Text style={styles.filterLabel}>{t('layout.type')}:</Text>
            <Picker
              selectedValue={filters.type}
              onValueChange={(itemValue) => setFilters({ ...filters, type: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label={t('layout.todos')} value="" />
              <Picker.Item label="Sedan" value="Sedan" />
              <Picker.Item label="SUV" value="SUV" />
              <Picker.Item label="Hatchback" value="Hatchback" />
              <Picker.Item label="Truck" value="Truck" />
              <Picker.Item label="Sports" value="Sports" />
              <Picker.Item label="Convertible" value="Convertible" />
              <Picker.Item label="Coupe" value="Coupe" />
              <Picker.Item label="Van" value="Van" />
              <Picker.Item label="Wagon" value="Wagon" />
            </Picker>

            {/* Filtro por Transmisión */}
            <Text style={styles.filterLabel}>{t('layout.tramission')}:</Text>
            <Picker
              selectedValue={filters.transmission}
              onValueChange={(itemValue) => setFilters({ ...filters, transmission: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label={t('layout.todas')} value="" />
              <Picker.Item label={t('layout.auto')} value="Automatic" />
              <Picker.Item label={t('layout.manual')} value="Manual" />
            </Picker>

            {/* Filtro por Tipo de Combustible */}
            <Text style={styles.filterLabel}>{t('layout.fuel_type')}:</Text>
            <Picker
              selectedValue={filters.fuel_type}
              onValueChange={(itemValue) => setFilters({ ...filters, fuel_type: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label={t('layout.todos')} value="" />
              <Picker.Item label={t('layout.gasolina')} value="Gasoline" />
              <Picker.Item label="Diésel" value="Diesel" />
              <Picker.Item label={t('layout.eléctrico')} value="Electric" />
            </Picker>

            {/* Botón para aplicar los filtros */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                console.log("Filtros aplicados:", filters);
                setIsFilterMenuOpen(false);
                navigation.navigate("resultadosFiltrados", { filters: JSON.stringify(filters) });
              }}
            >
              <Text style={styles.applyButtonText}>{t('layout.apply')}</Text>
            </TouchableOpacity>
          </View>
        )}
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

        {isMenuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.closeButton}>{t('layout.menuButtons.close')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('index')}>
              <FontAwesome name="home" size={24} color={color} />
              <Text style={styles.menuItemText}>{t('layout.menuButtons.home')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('misReservas')}>
              <FontAwesome5 name="shopping-cart" size={24} color={color} />
              <Text style={styles.menuItemText}>{t('layout.menuButtons.reservations')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('misIncidencias')}>
              <FontAwesome5 name="exclamation-circle" size={24} color={color} />
              <Text style={styles.menuItemText}>{t('layout.menuButtons.incidences')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('chat')}>
              <FontAwesome5 name="comments" size={24} color={color} solid/>
              <Text style={styles.menuItemText}>{t('layout.menuButtons.chat')}</Text>
            </TouchableOpacity>
          </View>
        )}

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
    backgroundColor: '#4472C4',
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#4472C4',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerLeft: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 50,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 18,
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
  },
  picker: {
    height: 50,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  languageOption: {
    fontSize: 18,
    color: 'white',
    marginVertical: 5,
  },
  touchableButton: {
    backgroundColor: '#4472C4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  touchableButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: 60,  // Ajusta el tamaño según tu diseño
    height: 40,
    marginRight: 10,  // Espaciado antes de otros elementos
  },

});
