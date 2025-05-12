import React, { useRef, useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Platform} from 'react-native'
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useNavigation, CommonActions } from '@react-navigation/native';
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { getApiUrl } from '@/utils/getApiUrl';
import { useRoute } from '@react-navigation/native';

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
  const navigation = useNavigation();
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
  const [vehicleImageUri, setVehicleImageUri] = useState<string | null>(null);
  const [vehicleFileName, setVehicleFileName] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState(null);

  const route = useRoute();
  const { vehicleId: routeVehicleId, vehicleData } = route.params || {};

  useEffect(() => {
    if (vehicleData) {
      setVehicleId(routeVehicleId || null);
      setBrand(vehicleData.brand);
      setModel(vehicleData.model);
      setYear(String(vehicleData.year));
      setAddress(vehicleData.address || '');
      setType(vehicleData.type);
      setTransmission(vehicleData.transmission);
      setFuelType(vehicleData.fuel_type);
      setCapacity(String(vehicleData.capacity));
      setNumDoors(String(vehicleData.num_doors));
      setPrice(String(vehicleData.daily_price));
      setDeposit(String(vehicleData.deposit || ''));
      setVehicleImageUri(vehicleData.imageUrl || null);
    }
  }, [vehicleData]);

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
    const userId = await AsyncStorage.getItem("userId")

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

      const userRes = await fetch(`${getApiUrl()}/users/getdata/`, {
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
      
      const handleImageUpload = async (imageUri: string, imageName: string, id: string) => {
        const formData = new FormData();
      
        if (Platform.OS === "web") {
          const response = await fetch(imageUri);
          const blob = await response.blob();
      
          formData.append("image", blob, imageName);
        } else {
          const match = /\.(\w+)$/.exec(imageUri);
          const fileType = match ? `image/${match[1]}` : `image`;
      
          formData.append("image", {
            uri: imageUri,
            name: imageName,
            type: fileType,
          } as any);
        }

        try {
          const userId = await AsyncStorage.getItem("userId");
          console.log("vehicle id, vehicleId");
          const uploadRes = await fetch(`${getApiUrl()}/media/upload/${userId}/${id}`, {
            method: "POST",
            body: formData,
          });
      
          if (!uploadRes.ok) throw new Error("Error al subir imagen");
      
          const uploadData = await uploadRes.json();
          console.log("Imagen subida:", uploadData);
    
        } catch (error) {
          console.error("Error al subir imagen:", error);
        }
      };

      const vehiclePayload = {
        brand,
        model,
        year: numericYear,
        latitude: coords.lat,
        longitude: coords.lon,
        type,
        transmission,
        fuel_type: fuelType,
        capacity: numericCapacity,
        num_doors: numericNumDoors,
        daily_price: numericPrice,
        deposit: numericDeposit,
        owner_id: userId,
      };
    
        const url = `${getApiUrl()}/vehicles${vehicleId ? `/${vehicleId}` : ''}`;
        const method = vehicleId ? 'PATCH' : 'POST';
    
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehiclePayload),
        });
    
    
        const savedVehicle = await res.json();
    

    
        alert(vehicleId ? 'Vehículo actualizado' : 'Vehículo publicado');

        await handleImageUpload(String(vehicleImageUri), String(vehicleFileName), savedVehicle.vehicle[0].id);
      
      setYear('');
      setAddress('');
      setCapacity('');
      setNumDoors('');
      setPrice('');
      setDeposit('');
      scrollRef.current?.scrollTo({ y: 0, animated: true });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'misCochesPublicados' }],
        })
      );
      
    } catch (err: any) {
      console.log(err);
      alert('Error');
    }
  };

  const handleImagePicker = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
  
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        const uri = URL.createObjectURL(file);
        setVehicleImageUri(uri);
        setVehicleFileName(file.name);
      };
  
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileName = uri.split("/").pop() || "image.jpg";
        setVehicleImageUri(uri);
        setVehicleFileName(fileName);
      }
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
        
        <Text>{t('RentYourVehicle.card.year')}</Text>
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.year')} value={year} onChangeText={setYear} keyboardType="numeric" placeholderTextColor="grey"/>
        <Text>{t('RentYourVehicle.card.address')}</Text>
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.ejemplo')} value={address} onChangeText={setAddress} placeholderTextColor="grey"/>

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

        <Text>{t('RentYourVehicle.card.capacity')}</Text>
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.capacity')} value={capacity} onChangeText={setCapacity} keyboardType="numeric" placeholderTextColor="grey"/>
        <Text>{t('RentYourVehicle.card.num_doors')}</Text>
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.num_doors')} value={numDoors} onChangeText={setNumDoors} keyboardType="numeric" placeholderTextColor="grey"/>
        <Text>{t('RentYourVehicle.card.price')}</Text>
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.price')} value={price} onChangeText={setPrice} keyboardType="numeric" placeholderTextColor="grey"/>
        <Text>{t('RentYourVehicle.card.deposit')}</Text>
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.deposit')} value={deposit} onChangeText={setDeposit} keyboardType="numeric" placeholderTextColor="grey"/>

        <TouchableOpacity style={styles.buttonAd} onPress={handleImagePicker}>
          <Text style={styles.buttonTextAd}>{t('RentYourVehicle.buttons.image')}</Text>
        </TouchableOpacity>

        { vehicleImageUri && (
          <Image source={{ uri: vehicleImageUri }} style={{ width: '100%', height: 300, borderRadius: 10, marginVertical: 10 }} />
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
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
  },
  form: {
    width: '50%',
    backgroundColor: theme.colors.secondary ,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    fontFamily: theme.fonts.regular,
    color: 'black',
    width: '100%',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 15,
    fontFamily: theme.fonts.regular,
    color: theme.lightTemplate.textColor,
    width: '100%',
  },
  buttonPub: {
    backgroundColor: '#3B6ED5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  buttonTextPub: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
  buttonAd: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: '100%',
  },
  buttonTextAd: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 15,
    resizeMode: 'cover',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  halfInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    fontFamily: theme.fonts.regular,
    color: theme.lightTemplate.textColor,
    width: '48%', // Mitad del ancho para inputs en fila
  },
});
