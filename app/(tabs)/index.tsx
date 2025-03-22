import { StyleSheet, Dimensions } from 'react-native';
import { View, Text, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { DatePickerModal } from 'react-native-paper-dates';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router'; 

const { width, height } = Dimensions.get('window');

const index = () => {
  const router = useRouter(); // para q vaya a otra página

  const [pickupDatePickerVisible, setPickupDatePickerVisible] = useState(false);
  const [returnDatePickerVisible, setReturnDatePickerVisible] = useState(false);
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

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
            <Text style={styles.titleText}>Inicia tu aventura</Text>
            
            {/* Cuadro gris */}
            <View style={styles.grayBox}>
              <TextInput
                placeholder="Origen"
                placeholderTextColor="gray"
                style={styles.input}
              />
              <View style={styles.buttonGroup}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    placeholder="Fecha de recogida"
                    placeholderTextColor="gray"
                    style={styles.inputFlex}
                    value={pickupDate ? pickupDate.toLocaleDateString() : ''}
                  />
                  <TouchableOpacity onPress={openPickupDatePicker}>
                    <Icon name="calendar" size={24} color="gray" />
                  </TouchableOpacity>
                  <DatePickerModal
                    locale="es"
                    mode="single"
                    visible={pickupDatePickerVisible}
                    onDismiss={closePickupDatePicker}
                    date={pickupDate || undefined}
                    onConfirm={onPickupDateConfirm}
                  />
                </View>
                <TextInput
                  placeholder="Hora"
                  placeholderTextColor="gray"
                  style={styles.smallInput}
                />
              </View>
              <View style={styles.buttonGroup}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    placeholder="Fecha de devolución"
                    placeholderTextColor="gray"
                    style={styles.inputFlex}
                    value={returnDate ? returnDate.toLocaleDateString() : ''}
                  />
                  <TouchableOpacity onPress={openReturnDatePicker}>
                    <Icon name="calendar" size={24} color="gray" />
                  </TouchableOpacity>
                  <DatePickerModal
                    locale="es"
                    mode="single"
                    visible={returnDatePickerVisible}
                    onDismiss={closeReturnDatePicker}
                    date={returnDate || undefined}
                    onConfirm={onReturnDateConfirm}
                  />
                </View>
                <TextInput
                  placeholder="Hora"
                  placeholderTextColor="gray"
                  style={styles.smallInput}
                />
              </View>
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerButtons}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Poner en alquiler tu coche</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/(tabs)/ofertas')} // Navegación al presionar el botón
            >
              <Text style={styles.buttonText}>Ofertas cerca de ti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Todos los estilos permanecen igual
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
    marginTop: width < 500 ? 100 : 200, 
    flexDirection: width < 500 ? 'column' : 'row', 
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
    marginRight: 20,
  },
  grayBox: {
    backgroundColor: 'rgba(200, 200, 200, 0.8)',
    padding: width < 500 ? 20 : 30, 
    borderRadius: 10,
    width: width < 500 ? 300 : 400, 
    height: width < 500 ? 250 : 300, 
    marginLeft: width < 500 ? 0 : -100, 
    marginTop: width < 500 ? 0 : -70,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flex: 1,
  },
  inputFlex: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 5,
    flex: 1, 
  },
  smallInput: {
    width: width < 500 ? '20%' : 80, 
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 10,
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
    marginRight: width < 500 ? 0 : 10,
  },
  buttonText: {
    color: 'white',
    fontSize: width < 500 ? 14 : 16,
    textAlign: 'center',
  },
});

export default index;
