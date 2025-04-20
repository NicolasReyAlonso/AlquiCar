import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const carModels = {
  Seat: ['Ibiza', 'León', 'Ateca'],
  Opel: ['Corsa', 'Astra', 'Insignia'],
  Ford: ['Fiesta', 'Focus', 'Mustang'],
};

const types = ['Sedan', 'SUV', 'Truck', 'Sports', 'Hatchback', 'Convertible'];
const transmissions = ['Manual', 'Automatic'];
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];

export default function AlquilarCoche() {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  const [brand, setBrand] = useState<keyof typeof carModels>('Seat');
  const [model, setModel] = useState(carModels['Seat'][0]);
  const [year, setYear] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState(types[0]);
  const [transmission, setTransmission] = useState(transmissions[0]);
  const [fuelType, setFuelType] = useState(fuelTypes[0]);
  const [capacity, setCapacity] = useState('');
  const [numDoors, setNumDoors] = useState('');
  const [price, setPrice] = useState('');

  const { t } = useTranslation();

  const handleSubmit = () => {
    if (!brand || !model || !year || !city || !price) {
      alert('Faltan campos por rellenar');
      return;
    }

    const numericYear = Number(year);
    if (isNaN(numericYear) || numericYear < 1900 || numericYear >= 2026) {
    alert('Debe ser un año válido');
    return;
    }

    if (city.length < 3) {
      Alert.alert('Error', 'La ciudad debe tener al menos 3 caracteres');
      return;
    }
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
    alert('El precio debe ser un número válido mayor que 0');
    return;
    }
    console.log(`Marca: ${brand}, Modelo: ${model}, Año: ${year}, Ciudad: ${city}, Precio: ${price}`);
  };


  return (
    <ScrollView contentContainerStyle={styles.formContainer} ref={scrollRef}>
      <ThemedView style={styles.form}>
        <ThemedText style={styles.title} type="title">{t('RentYourVehicle.title')}</ThemedText>

        <Text>{t('RentYourVehicle.card.brand')}</Text>
        <Picker selectedValue={brand} onValueChange={(item) => {
          setBrand(item as keyof typeof carModels);
          setModel(carModels[item as keyof typeof carModels][0]);
        }} style={styles.input}>
          {Object.keys(carModels).map((brand) => (
            <Picker.Item key={brand} label={brand} value={brand} />
          ))}
        </Picker>

        <Text>{t('RentYourVehicle.card.model')}</Text>
        <Picker selectedValue={model} onValueChange={setModel} style={styles.input}>
          {carModels[brand].map((model) => (
            <Picker.Item key={model} label={model} value={model} />
          ))}
        </Picker>

        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.year')} value={year} onChangeText={setYear} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.city')} value={city} onChangeText={setCity} />

        <Text>{t('RentYourVehicle.card.type')}</Text>
        <Picker selectedValue={type} onValueChange={setType} style={styles.input}>
          {types.map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>

        <Text>{t('RentYourVehicle.card.transmission')}</Text>
        <Picker selectedValue={transmission} onValueChange={setTransmission} style={styles.input}>
          {transmissions.map((t) => (
            <Picker.Item key={t} label={t} value={t} />
          ))}
        </Picker>

        <Text>{t('RentYourVehicle.card.fuel_type')}</Text>
        <Picker selectedValue={fuelType} onValueChange={setFuelType} style={styles.input}>
          {fuelTypes.map((f) => (
            <Picker.Item key={f} label={f} value={f} />
          ))}
        </Picker>

        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.capacity')} value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.num_doors')} value={numDoors} onChangeText={setNumDoors} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.price')} value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TouchableOpacity style={styles.buttonAd}>
          <Text style={styles.buttonTextAd}>{t('RentYourVehicle.buttons.image')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPub} onPress={handleSubmit}>
          <Text style={styles.buttonTextPub}>{t('RentYourVehicle.buttons.publish')}</Text>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    color: theme.colors.titles,
    fontFamily: theme.fonts.bold,
    marginBottom: 10,
  },
  form: {
    width: '90%',
    backgroundColor: theme.colors.secondary,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 10,
    fontFamily: theme.fonts.regular,
    color: theme.lightTemplate.textColor,
  },
  buttonPub: {
    backgroundColor: '#4472C4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonTextPub: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
  buttonAd: {
    backgroundColor: 'grey',
    padding: 5,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonTextAd: {
    color: 'black',
    fontSize: 14,
  },
});
