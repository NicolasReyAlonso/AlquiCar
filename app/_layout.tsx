import React, { useState, ReactNode, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Platform, ActivityIndicator, StyleSheet, useColorScheme, Image, ScrollView } from 'react-native';
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
import { Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { isUserUploaded } from '@/utils/isUserUploaded';
import { useFocusEffect } from '@react-navigation/native';
import NotificationsList from '@/components/NotificationsList';
import { use } from 'i18next';
import { getApiUrl } from '@/utils/getApiUrl';
import { Socket } from 'socket.io-client';
import { SocketManager} from '@/utils/SocketManager';

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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
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
    minPrice: 0,
    maxPrice: 500,
  });
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [userUploaded, setUserUploaded] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useFocusEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setAppIsReady(true);
      if(!socket) fetchUserUpload();
    };
    init();
  });

  /*useEffect(() => {
    fetchUserUpload();
  },[])*/

  const fetchUserUpload = async () => {
    const userIsUploaded = await isUserUploaded()
    if(!userIsUploaded) {
      setUserUploaded(false)
      return;
    };

    setUserUploaded(true);
    const socket = SocketManager.getSocket();
    setSocket(socket);
  }

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

  const applyFilters = () => {
    console.log("Filtros aplicados:", filters);
    setIsFilterMenuOpen(false);
    navigation.navigate("resultadosFiltrados", {
      filters: JSON.stringify({
        ...filters,
        minPrice: Number(filters.minPrice),
        maxPrice: Number(filters.maxPrice)
      })
    });
  };

  const resetFilters = () => {
    setFilters({
      brand: "",
      type: "",
      transmission: "",
      fuel_type: "",
      minPrice: 0,
      maxPrice: 500,
    });
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
              <TouchableOpacity onPress={() => navigation.navigate('index')}>
                <Image
                  source={require('@/assets/images/logo2.png')}
                  style={styles.logo}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.touchableButton}
                onPress={() => setIsLangMenuOpen(!isLangMenuOpen)}
              >
                <Ionicons name="globe-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
              <Ionicons name="person-circle-outline" onPress={handleLogin} size={30} color="white" />
              {userUploaded && (
                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    style={styles.touchableButton}
                    onPress={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  >
                    <Ionicons name="notifications-outline" size={26} color="white" />
                      <View style={{
                        position: 'absolute',
                        top: 3,
                        right: 5,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        paddingHorizontal: 5,
                      }}>
                        <Text style={{ color: 'white', fontSize: 10 }}>{3}</Text>
                      </View>
                  </TouchableOpacity>
                </View>
              )}

              {userUploaded && (<TouchableOpacity style={styles.touchableButton} onPress={() => setIsMenuOpen(!isMenuOpen)}>
                <Text style={styles.touchableButtonText}>{t('layout.Menu')}</Text>
              </TouchableOpacity>)}
              <TouchableOpacity
                style={styles.touchableButton}
                onPress={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              >
                <Ionicons name="filter-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {isNotificationsOpen && <NotificationsList setIsNotificationsOpen ={setIsNotificationsOpen}/> 
        }

        {isFilterMenuOpen && (
          <>
            <Pressable
              style={styles.overlay}
              onPress={() => setIsFilterMenuOpen(false)}
            />
            <View style={[
              styles.filterMenu,
              Platform.OS === 'web' ? styles.filterMenuWeb : styles.filterMenuMobile
            ]}>
              <ScrollView contentContainerStyle={styles.filterScroll}>
                <Text style={styles.filterTitle}>{t('layout.filter')}</Text>

                {/* Filtro por Marca */}
                <Text style={styles.filterLabel}>{t('layout.brand')}</Text>
                <Picker
                  selectedValue={filters.brand}
                  onValueChange={(value) => setFilters({ ...filters, brand: value })}
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
                </Picker>

                {/* Filtro por Tipo */}
                <Text style={styles.filterLabel}>{t('layout.type')}</Text>
                <Picker
                  selectedValue={filters.type}
                  onValueChange={(value) => setFilters({ ...filters, type: value })}
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
                <Text style={styles.filterLabel}>{t('layout.tramission')}</Text>
                <Picker
                  selectedValue={filters.transmission}
                  onValueChange={(value) => setFilters({ ...filters, transmission: value })}
                  style={styles.picker}
                >
                  <Picker.Item label={t('layout.todas')} value="" />
                  <Picker.Item label={t('layout.auto')} value="Automatic" />
                  <Picker.Item label={t('layout.manual')} value="Manual" />
                </Picker>

                {/* Filtro por Combustible */}
                <Text style={styles.filterLabel}>{t('layout.fuel_type')}</Text>
                <Picker
                  selectedValue={filters.fuel_type}
                  onValueChange={(value) => setFilters({ ...filters, fuel_type: value })}
                  style={styles.picker}
                >
                  <Picker.Item label={t('layout.todos')} value="" />
                  <Picker.Item label={t('layout.gasolina')} value="Gasoline" />
                  <Picker.Item label="Diésel" value="Diesel" />
                  <Picker.Item label={t('layout.eléctrico')} value="Electric" />
                </Picker>

                {/* Filtro por Rango de Precios */}
                <Text style={styles.filterTitle}>{t('layout.rango')}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={styles.priceDisplay}>€{filters.minPrice}</Text>
                  <Text style={{ marginHorizontal: 10 }}>-</Text>
                  <Text style={styles.priceDisplay}>€{filters.maxPrice}</Text>
                </View>

                <View style={styles.sliderContainer}>
                  <Text>€{filters.minPrice}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1000}
                    step={5}
                    minimumTrackTintColor="#4472C4"
                    maximumTrackTintColor="#d3d3d3"
                    thumbTintColor="#4472C4"
                    value={filters.maxPrice}
                    onValueChange={(value) => setFilters({ ...filters, maxPrice: Math.round(value) })}
                  />
                  <Text>€{filters.maxPrice}</Text>
                </View>

                {/* Botones de acción */}
                <View style={styles.filterButtons}>
                  <TouchableOpacity
                    style={[styles.applyButton, styles.resetButton]}
                    onPress={resetFilters}
                  >
                    <Text style={styles.filterButtonText}>{t('layout.borrar')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.filterButton, styles.applyButton]}
                    onPress={applyFilters}
                  >
                    <Text style={styles.filterButtonText}>{t('layout.apply')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </>
        )}

        {isLangMenuOpen && (
          <>
            <Pressable
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onPress={() => setIsLangMenuOpen(false)}
            />
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
          </>
        )}

        {isMenuOpen && (
          <>
            <Pressable
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999
              }} onPress={() => setIsMenuOpen(false)}
            />
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
                <FontAwesome5 name="comments" size={24} color={color} solid />
                <Text style={styles.menuItemText}>{t('layout.menuButtons.chat')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('pay')}>
                <FontAwesome5 name="comments" size={24} color={color} solid />
                <Text style={styles.menuItemText}>pay</Text>
              </TouchableOpacity>
            </View>
          </>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  filterMenuMobile: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxHeight: '80%',
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 1000,
  },
  filterScroll: {
    paddingBottom: 80, // Espacio para los botones
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,


  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  resetButton: {
    backgroundColor: '#f44336',
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4472C4',
    textAlign: 'center',
    marginVertical: 5,
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
  filterMenu: {
    position: "absolute",
    top: 60,
    right: 15,
    width: 250, // Aumentamos el ancho para mejor visualización
    backgroundColor: "#ffffff", // Color de fondo más claro
    padding: 15,
    borderRadius: 12, // Bordes redondeados más suaves
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // Sombra más pronunciada
    zIndex: 1000,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 1,
    textAlign: "center",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 5,
  },
  picker: {
    height: 50,
    marginBottom: 4,
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    paddingHorizontal: 10, // Espaciado interno
    width: '100%',
    color: theme.lightTemplate.textColor,
  },
  applyButton: {
    backgroundColor: "#4472C4",
    padding: 8,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4472C4',
    backgroundColor: 'white',
    overflow: 'hidden',

  },
  pickerItem: {
    height: 50, // Asegura suficiente espacio para cada opción
    fontSize: 16, // Tamaño de fuente adecuado
  },

  priceDisplay: {
    width: 60,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  notificationsMenu: {
    position: 'absolute',
    top: 70,
    right: 10,
    width: '50%',
    maxHeight: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },

  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  notificationItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },

  notificationText: {
    fontSize: 14,
    color: '#333',
  },

});