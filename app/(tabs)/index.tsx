import { StyleSheet, Dimensions } from 'react-native';
import { View, Text, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { DatePickerModal } from 'react-native-paper-dates';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import VehicleCard from "@/components/templates/VehicleCard"; 



const { width, height } = Dimensions.get('window');

const index = () => {
  const router = useRouter(); // para q vaya a otra página

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

  const handleBuscar = async () => {
    try {
      const response = await fetch('http://localhost:3000/vehicles/');
      const allVehicles = await response.json();

      const filteredVehicles = allVehicles.filter(vehicle => {
        const isCityMatch = city === "" || vehicle.city?.toLowerCase().includes(city.toLowerCase());
        const isBrandMatch = brand === "" || vehicle.brand.trim().toLowerCase() === brand.trim().toLowerCase();
        return isCityMatch && isBrandMatch;
      });

      if (filteredVehicles.length === 1) {
        router.push(`/vehicleDetails?id=${filteredVehicles[0].id}`);
      } else {
        setVehicles(filteredVehicles);
      }

      if (filteredVehicles.length === 0) {
        Alert.alert('Sin resultados', 'No se encontraron vehículos para los criterios seleccionados');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al buscar los vehículos');
      console.error(error);
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
                <TextInput
                  placeholder={t('Index.card.hour')}
                  placeholderTextColor="gray"
                  style={styles.smallInput}
                />
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
                <TextInput
                  placeholder={t('Index.card.hour')}
                  placeholderTextColor="gray"
                  style={styles.smallInput}
                />
              </View>

              <Picker selectedValue={brand} onValueChange={(itemValue) => setBrand(itemValue)} style={styles.picker}>
              <Picker.Item label="Selecciona una marca" value="" />
              <Picker.Item label="Toyota" value="Toyota" />
              <Picker.Item label="Citroën" value="Citroën" />
              <Picker.Item label="Nissan" value="Nissan" />
              <Picker.Item label="Ford" value="Ford" />
              </Picker>

              <TouchableOpacity style={styles.searchButton} onPress={handleBuscar}>
              <Text style={styles.searchButtonText}>Buscar</Text>
              </TouchableOpacity>
              </View>
          </View>

          <View style={styles.footerButtons}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/(tabs)/alquilaCoche')}
            >
              <Text style={styles.buttonText}>{t('Index.buttons.rent')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/(tabs)/ofertas')}
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
  
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
    borderRadius: 10,
    width: width < 500 ? 300 : 400, 
    height: 300, 
    
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
  inputFlex: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    
    fontFamily: theme.fonts.regular,
    color: theme.lightTemplate.textColor
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 5,
    flex: 1,
    fontFamily: theme.fonts.regular,
    color: theme.lightTemplate.textColor
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
    backgroundColor: '#4472C4',
    padding: 15,
    borderRadius: 5,
    marginTop: width < 500 ? 5 : 10, 
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontSize: width < 500 ? 14 : 16, 
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
  footerButtons: {
    marginTop: width < 500 ? 150 : 300, 
    flexDirection: width < 500 ? 'column' : 'row', 
    justifyContent: 'space-around',
    paddingHorizontal: width < 600 ? 10 : 20,
    gap: width < 500 ? 15 : 10,  //para q se separen los botones
  },
  button: {
    backgroundColor: '#4472C4',
    padding: width < 500 ? 10 : 20, 
    borderRadius: 10,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: width < 500 ? 14 : 16,
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
  },
});

export default index;
