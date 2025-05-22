import { StyleSheet, Dimensions } from 'react-native';
import { View, Text, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DatePickerModal } from 'react-native-paper-dates';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import VehicleCard from '@/components/templates/VehicleCard';
import { getApiUrl } from '@/utils/getApiUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const index = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [pickupDatePickerVisible, setPickupDatePickerVisible] = useState(false);
  const [returnDatePickerVisible, setReturnDatePickerVisible] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState('');
  const [vehicles, setVehicles] = useState([]);

  const openPickupDatePicker = () => setPickupDatePickerVisible(true);
  const closePickupDatePicker = () => setPickupDatePickerVisible(false);

  const openReturnDatePicker = () => setReturnDatePickerVisible(true);
  const closeReturnDatePicker = () => setReturnDatePickerVisible(false);

  const onPickupDateConfirm = (params: { date: Date | undefined }) => {
    if (params.date) {
      setPickupDate(params.date);
    }
    closePickupDatePicker();
  };

  const onReturnDateConfirm = (params: { date: Date | undefined }) => {
    if (params.date) {
      setReturnDate(params.date);
    }
    closeReturnDatePicker();
  };

  const getCityFromCoords = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'MiAppDeAlquiler/1.0 (contacto@tuapp.com)',
            'Accept-Language': 'es',
          },
        }
      );
    const data = await response.json();
    return data?.address?.city || data?.address?.town || data?.address?.village || '';
  } catch (error) {
    console.error('Error al obtener la ciudad desde las coordenadas:', error);
    return '';
  }
};

const checkAuthAndNavigate = async (destination: string) => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    if (destination === 'ofertas') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesita acceder a la ubicación para mostrar ofertas cercanas.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const city = await getCityFromCoords(location.coords.latitude, location.coords.longitude);

      if (!city) {
        alert('No se pudo determinar la ciudad actual.');
        return;
      }

      router.push({
        pathname: '/(tabs)/ofertas',
        params: { lat: location.coords.latitude, lon: location.coords.longitude },
      });
    } else if (destination === 'alquilaCoche') {
      router.push('/(tabs)/alquilaCoche');
    }

  } catch (error) {
    console.error('Error checking auth:', error);
    router.push('/login');
  }
};


  const handleBuscar = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/vehicles/`);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
      const allVehicles = await response.json();
      
      const filteredVehicles = allVehicles.filter(vehicle => {
        const isCityMatch = city ? 
          vehicle.city?.toLowerCase().includes(city.toLowerCase()) : true;
        
        const isBrandMatch = brand ? 
          vehicle.brand?.toLowerCase() === brand.toLowerCase() : true;
        
        let isDateMatch = true;
        if (pickupDate) {
          const vehicleRegDate = new Date(vehicle.registration_date);
          isDateMatch = vehicle.availability === 1 && vehicleRegDate <= pickupDate;
        }
  
        return isCityMatch && isBrandMatch && isDateMatch;
      });
  
      // Siempre redirigir a vehicleDetails con los resultados
      router.push({
        pathname: '/vehicleDetails',
        params: { 
          vehicles: JSON.stringify(filteredVehicles),
          searchParams: JSON.stringify({
            pickupDate: pickupDate?.toISOString(),
            city,
            brand
          })
        }
      });
      
    } catch (error) {
      console.error("Error en handleBuscar:", error);
      alert('Hubo un problema al buscar los vehículos');
    }
  };
  
  


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.viewContainer}>
          {/* Imagen de fondo */}
          <Image 
            source={require('@/assets/images/fondo2.png')} 
            style={styles.backgroundImage} 
            resizeMode="cover" 
          />

          <View style={styles.textContainer}>
            <Text style={styles.titleText}>{t('Index.welcome')}</Text>
            
            {/* Cuadro gris */}
            <View style={styles.grayBox}>
              <TextInput
                placeholder={t('Index.card.origin')}
                placeholderTextColor="gray"
                style={styles.input}
              />
              <View style={styles.buttonGroup}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    placeholder={t('Index.card.startDate')}
                    placeholderTextColor="gray"
                    style={styles.inputFlex}
                    value={pickupDate ? pickupDate.toLocaleDateString() : ''}
                    editable={false}
                  />
                  <TouchableOpacity onPress={openPickupDatePicker}>
                    <Icon name="calendar" size={24} color="gray" />
                  </TouchableOpacity>
                  <DatePickerModal
                    locale={i18n.language}
                    mode="single"
                    visible={pickupDatePickerVisible}
                    onDismiss={closePickupDatePicker}
                    date={pickupDate || undefined}
                    onConfirm={onPickupDateConfirm}
                    validRange={{ startDate: new Date() }}
                  />
                </View>
              </View>
              <View style={styles.buttonGroup}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    placeholder={t('Index.card.finishDate')}
                    placeholderTextColor="gray"
                    style={styles.inputFlex}
                    value={returnDate ? returnDate.toLocaleDateString() : ''}
                    editable={false}
                  />
                  <TouchableOpacity onPress={openReturnDatePicker}>
                    <Icon name="calendar" size={24} color="gray" />
                  </TouchableOpacity>
                  <DatePickerModal
                    locale={i18n.language}
                    mode="single"
                    visible={returnDatePickerVisible}
                    onDismiss={closeReturnDatePicker}
                    date={returnDate || undefined}
                    onConfirm={onReturnDateConfirm}
                    validRange={{ startDate: new Date() }}
                  />
                </View>
              </View>
              <View style={styles.inputWithIcon}>
          <Picker
            selectedValue={brand}
            onValueChange={(itemValue) => setBrand(itemValue)}
            style={styles.inputFlex} 
            dropdownIconColor="gray" 
            mode="dropdown" 
          >
            <Picker.Item label={t('Index.card.brand')} value="" />
              <Picker.Item label="Toyota" value="Toyota" />
              <Picker.Item label="Ford" value="Ford" />
              <Picker.Item label="BMW" value="BMW" />
              <Picker.Item label="Honda" value="Honda" />
              <Picker.Item label="Chevrolet" value="Chevrolet" />
              <Picker.Item label="Mercedes-Benz" value="Mercedes-Benz" />
              <Picker.Item label="Audi" value="Audi" />
              <Picker.Item label="Nissan" value="Nissan" />
              <Picker.Item label="Volkswagen" value="Volkswagen" />
              <Picker.Item label="Hyundai" value="Hyundai" />
              <Picker.Item label="Kia" value="Kia" />
              <Picker.Item label="Peugeot" value="Peugeot" />
              <Picker.Item label="Mazda" value="Mazda" />
              <Picker.Item label="Subaru" value="Subaru" />
              <Picker.Item label="Renault" value="Renault" />
              <Picker.Item label="Fiat" value="Fiat" />
              <Picker.Item label="Porsche" value="Porsche" />
              <Picker.Item label="Lexus" value="Lexus" />
              <Picker.Item label="Chrysler" value="Chrysler" />
              <Picker.Item label="Dodge" value="Dodge" />
              <Picker.Item label="Jeep" value="Jeep" />
              <Picker.Item label="Tesla" value="Tesla" />
              <Picker.Item label="Land Rover" value="Land Rover" />
              <Picker.Item label="Jaguar" value="Jaguar" />
              <Picker.Item label="Ferrari" value="Ferrari" />
              <Picker.Item label="Lamborghini" value="Lamborghini" />
              <Picker.Item label="Aston Martin" value="Aston Martin" />
              <Picker.Item label="Maserati" value="Maserati" />
              <Picker.Item label="Bentley" value="Bentley" />
              <Picker.Item label="Rolls-Royce" value="Rolls-Royce" />
              <Picker.Item label="McLaren" value="McLaren" />
              <Picker.Item label="Citroën" value="Citroën" />
          </Picker>
        </View>

              <TouchableOpacity style={styles.searchButton} onPress={handleBuscar}>
                <Text style={styles.searchButtonText}>{t('Index.buttons.search')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mostrar vehículos */}
          <View>
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </View>

          <View style={styles.footerButtons}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => checkAuthAndNavigate('alquilaCoche')}
            >
              <Text style={styles.buttonText}>{t('Index.buttons.rent')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => checkAuthAndNavigate('ofertas')}
            >
              <Text style={styles.buttonText}>{t('Index.buttons.offers')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollViewContent: { flexGrow: 1 },
  viewContainer: { flex: 1 },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  noResultsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  
backgroundImage: {
  width: "100%",
  height: "100%",
  position: "absolute",
  backgroundColor: "#EDF2F7", // Fondo claro si no hay imagen
},


  textContainer: {
    display:'flex',
    marginTop: width < 500 ? 100 : 200, 
    flexDirection: width < 1000 ? 'column' : 'row', 
    alignItems: width < 500 ? 'center' : 'flex-start',
    paddingHorizontal: width < 500 ? 15 : 40, 
    justifyContent: 'space-between',
    marginHorizontal: width < 500 ? 10 : 200, 
  },
  titleText: {
    color: 'white',
    fontSize: width < 500 ? 30 : 70, 
    fontWeight: 'bold',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: theme.fonts.bold,
    flexWrap: 'wrap'
  },
  grayBox: {
    backgroundColor: theme.colors.secondary,
    padding: width < 500 ? 20 : 30,
    borderRadius: 15,
    width: width < 500 ? 320 : 400,
    height: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    display:'flex',
    fontFamily: theme.fonts.regular,
    color: theme.lightTemplate.textColor
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // Fondo blanco
    borderRadius: 5,
    flex: 1,
    fontFamily: theme.fonts.regular, // Fuente consistente
    color: theme.lightTemplate.textColor,
  },
  inputFlex: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white', // Fondo blanco
    padding: 10,
    borderRadius: 5,
    fontFamily: theme.fonts.regular, // Fuente consistente
    color: theme.lightTemplate.textColor, // Color del texto
  },
  smallInput: {
    display: 'flex',
    width: width < 500 ? '20%' : 80, 
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  searchButton: {
    backgroundColor: "#4472C4",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: width < 500 ? 10 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  searchButtonText: {
    color: "#FFF",
    fontSize: width < 500 ? 16 : 18,
    fontWeight: "700",
    textAlign: "center",
    fontFamily: theme.fonts.bold,
  },
  button: {
    backgroundColor: "#4472C4",
    padding: width < 500 ? 12 : 18,
    borderRadius: 12,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: width < 500 ? 16 : 18,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: theme.fonts.bold,
  },
  
  footerButtons: {
    marginTop: width < 500 ? 150 : 300, 
    flexDirection: width < 500 ? 'column' : 'row', 
    justifyContent: 'space-around',
    paddingHorizontal: width < 600 ? 10 : 20,
    gap: width < 500 ? 15 : 10,  //para q se separen los botones
  },


});

export default index;
