import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const carModels = {
  Toyota: ['Corolla', 'Yaris', 'Camry'],
  Ford: ['Fiesta', 'Focus', 'Mustang'],
  BMW: ['X1', 'X3', 'X5'],
  Honda: ['Civic', 'Accord', 'CR-V'],
  Chevrolet: ['Spark', 'Cruze', 'Malibu'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class'],
  Audi: ['A1', 'A3', 'Q5'],
  Nissan: ['Micra', 'Juke', 'Qashqai'],
  Volkswagen: ['Polo', 'Golf', 'Passat'],
  Hyundai: ['i10', 'i20', 'Tucson'],
  Kia: ['Picanto', 'Ceed', 'Sportage'],
  Peugeot: ['208', '308', '3008'],
  Mazda: ['Mazda2', 'Mazda3', 'CX-5'],
  Subaru: ['Impreza', 'Forester', 'Outback'],
  Renault: ['Clio', 'Megane', 'Captur'],
  Fiat: ['500', 'Panda', 'Tipo'],
  Porsche: ['911', 'Cayenne', 'Taycan'],
  Lexus: ['UX', 'NX', 'RX'],
  Chrysler: ['300', 'Pacifica'],
  Dodge: ['Charger', 'Durango'],
  Jeep: ['Renegade', 'Compass', 'Wrangler'],
  Tesla: ['Model 3', 'Model S', 'Model X'],
  'Land Rover': ['Defender', 'Discovery', 'Range Rover'],
  Jaguar: ['XE', 'XF', 'F-PACE'],
  Ferrari: ['488', 'F8', 'Roma'],
  Lamborghini: ['Huracán', 'Aventador'],
  'Aston Martin': ['DB11', 'Vantage'],
  Maserati: ['Ghibli', 'Levante'],
  Bentley: ['Bentayga', 'Continental GT'],
  'Rolls-Royce': ['Phantom', 'Ghost'],
  McLaren: ['570S', '720S'],
};

const types = ['Sedan', 'SUV', 'Truck', 'Sports', 'Hatchback', 'Convertible'];
const transmissions = ['Manual', 'Automatic'];
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];

export default function AlquilarCoche() {
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  const [brand, setBrand] = useState<keyof typeof carModels>('Toyota');
  const [model, setModel] = useState(carModels['Toyota'][0]);
  const [year, setYear] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState(types[0]);
  const [transmission, setTransmission] = useState(transmissions[0]);
  const [fuelType, setFuelType] = useState(fuelTypes[0]);
  const [capacity, setCapacity] = useState('');
  const [numDoors, setNumDoors] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para subir una imagen.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!brand || !model || !year || !address || !type || !transmission || !fuelType || !capacity || !numDoors || !price) {
      alert('Faltan campos por rellenar');
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    const numericYear = Number(year);
    const numericCapacity = Number(capacity);
    const numericNumDoors = Number(numDoors);
    const numericPrice = Number(price);
    const numericDeposit = Number(deposit || 0);

    const geocodeAddress = async (address: string): Promise<{ lat: number, lon: number } | null> => {
      try {
        const response = await fetch(`http://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data.length > 0) {
          return { lat: parseFloat(parseFloat(data[0].lat).toFixed(6)), lon: parseFloat(parseFloat(data[0].lon).toFixed(6)) };
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error al geocodificar:', error);
        return null;
      }
    };
    

    if (
      isNaN(numericYear) || numericYear < 1900 || numericYear > 2025 ||
      isNaN(numericCapacity) || numericCapacity <= 0 ||
      isNaN(numericNumDoors) || numericNumDoors <= 0 ||
      isNaN(numericPrice) || numericPrice <= 0
    ) {
      alert('Los valores numéricos deben ser válidos');
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Usuario no autenticado");
        return;
      }

      const userRes = await fetch('http://localhost:3000/users/getdata/', {
        method: 'GET',
        credentials: 'include',
      });
      console.log(userRes);
      const userData = await userRes.json();
      console.log(userData)
      const owner_id = userData[0].id;

      const coords = await geocodeAddress(address);
      if (!coords) {
        alert('No se pudo encontrar la ubicación para esa dirección');
        return;
      }

      const vehicle = {
        owner_id,
        brand,
        model,
        year: numericYear,
        type,
        transmission,
        fuel_type: fuelType,
        capacity: numericCapacity,
        num_doors: numericNumDoors,
        daily_price: numericPrice,
        deposit: numericDeposit,
        latitude: coords.lat,
        longitude: coords.lon
      };

      console.log(vehicle)
      const response = await fetch('http://localhost:3000/vehicles/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(vehicle),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);
      }

      alert('Vehículo publicado correctamente');
      setYear('');
      setAddress('');
      setCapacity('');
      setNumDoors('');
      setPrice('');
      setDeposit('');
      setImage(null);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      navigation.navigate("misCochesPublicados");
    } catch (err: any) {
      console.log(err);
      alert('Error');
    }
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
        <Text>{t('RentYourVehicle.card.address')}</Text>
        <TextInput style={styles.input} placeholder="Calle Pepito, 33, Las Palmas" value={address} onChangeText={setAddress} />

        <Text>{t('RentYourVehicle.card.type')}</Text>
        <Picker selectedValue={type} onValueChange={setType} style={styles.input}>
          {types.map((type) => <Picker.Item key={type} label={type} value={type} />)}
        </Picker>

        <Text>{t('RentYourVehicle.card.transmission')}</Text>
        <Picker selectedValue={transmission} onValueChange={setTransmission} style={styles.input}>
          {transmissions.map((t) => <Picker.Item key={t} label={t} value={t} />)}
        </Picker>

        <Text>{t('RentYourVehicle.card.fuel_type')}</Text>
        <Picker selectedValue={fuelType} onValueChange={setFuelType} style={styles.input}>
          {fuelTypes.map((f) => <Picker.Item key={f} label={f} value={f} />)}
        </Picker>

        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.capacity')} value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.num_doors')} value={numDoors} onChangeText={setNumDoors} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.price')} value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.deposit')} value={deposit} onChangeText={setDeposit} keyboardType="numeric" />

        <TouchableOpacity style={styles.buttonAd} onPress={pickImage}>
          <Text style={styles.buttonTextAd}>{t('RentYourVehicle.buttons.image')}</Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={{ width: '100%', height: 300, borderRadius: 10, marginVertical: 10 }} />
        )}

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
