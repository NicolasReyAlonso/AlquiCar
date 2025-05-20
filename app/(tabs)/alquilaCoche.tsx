import React, { useRef, useState, useEffect} from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Platform, Dimensions, View} from 'react-native'
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

const { width } = Dimensions.get('window');
const types = ['Sedan', 'SUV', 'Truck', 'Sports', 'Hatchback', 'Convertible'];
const transmissions = ['Manual', 'Automatic'];
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];


export default function AlquilarCoche() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const scrollRef = useRef<ScrollView>(null);

  const [brand, setBrand] = useState<keyof typeof carModels | ''>('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [year, setYear] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [numDoors, setNumDoors] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [vehicleImageUri, setVehicleImageUri] = useState<string | null>(null);
  const [vehicleFileName, setVehicleFileName] = useState<string | null>(null);
  const [vehicleId, setVehicleId] = useState(null);
  const years = Array.from({length: 50}, (_, i) => (new Date().getFullYear() - i).toString());
  const capacities = ['2', '4', '5', '7', '8'];
  const numDoorsOptions = ['2', '3', '4', '5'];
  const [submitAttempted, setSubmitAttempted] = useState(false);

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
    setSubmitAttempted(true);

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
        const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        {
          headers: {
            'User-Agent': 'MiAppDeAlquiler/1.0 (contacto@tuapp.com)',
            'Accept-Language': 'es',
          },
        }
      );
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
      
      const handleImageUpload = async (imageUri: string, imageName: string, id: string, isEdit: boolean) => {
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
          console.log(id, userId);
          const endpoint = isEdit
            ? `${getApiUrl()}/media/modify/${userId}/${id}`
            : `${getApiUrl()}/media/upload/${userId}/${id}`;
          console.log("ESTE ES EL ENDPOINT",endpoint);
          const method = isEdit ? 'PATCH' : 'POST';
          console.log("ESTE ES EL METODO", method);
          const uploadRes = await fetch(endpoint, {
            method,
            credentials: "include",
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
        console.log("vehiculo guardado", savedVehicle.vehicle[0].id);
    

    
        alert(vehicleId ? 'Vehículo actualizado' : 'Vehículo publicado');

        if (vehicleImageUri) {
          await handleImageUpload(
            vehicleImageUri,
            vehicleFileName ?? `img_${Date.now()}.jpg`,
            vehicleId ?? savedVehicle.vehicle[0].id, 
            !!vehicleId
          );
    }
      
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

const CustomPicker = ({
  selectedValue,
  onValueChange,
  items,
  placeholder,
  invalid
}: {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: string[];
  placeholder: string;
  invalid?: boolean;
}) => {
  return (
    <View style={[styles.pickerContainer, invalid && styles.invalidInput]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
        dropdownIconColor="#4472C4"
      >
        <Picker.Item 
          label={placeholder} 
          value="" 
          style={!selectedValue ? styles.pickerPlaceholder : undefined}
        />
        {items.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
};
const isFieldValid = (value: string | number) => {
  // Solo validar si se ha intentado enviar
  if (!submitAttempted) return true;
  return value !== '' && value !== null && value !== undefined;
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
    <ScrollView contentContainerStyle={styles.outerContainer} ref={scrollRef}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title} type="title">{vehicleId ? t('RentYourVehicle.editCar') : t('RentYourVehicle.title')}</ThemedText>

      <Text>
        {t('RentYourVehicle.card.brand')} <Text style={{ color: 'red' }}>*</Text>
      </Text>
      <CustomPicker
        selectedValue={brand}
        onValueChange={(item) => {
          setBrand(item as keyof typeof carModels);
          setModel(''); 
        }}
        items={Object.keys(carModels)}
        placeholder={t('RentYourVehicle.card.selectBrand')}
        invalid={submitAttempted && !brand}
      />


      <Text>
        {t('RentYourVehicle.card.model')} <Text style={{ color: 'red' }}>*</Text>
      </Text>
      <CustomPicker
        selectedValue={model}
        onValueChange={setModel}
        items={brand ? carModels[brand] : []}
        placeholder={brand ? t('RentYourVehicle.card.selectModel') : t('RentYourVehicle.card.selectBrandFirst')}
        invalid={submitAttempted && !brand}
      />
        
      <Text>
        {t('RentYourVehicle.card.year')} <Text style={{ color: 'red' }}>*</Text>
      </Text>
      <CustomPicker
        selectedValue={year}
        onValueChange={setYear}
        items={years}
        placeholder={t('RentYourVehicle.card.selectYear')}
        invalid={submitAttempted && !brand}
      />

        <Text>
          {t('RentYourVehicle.card.address')} <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !isFieldValid(address) && styles.invalidInput
          ]}
          placeholder={t('RentYourVehicle.card.ejemplo')}
          value={address}
          onChangeText={setAddress}
          placeholderTextColor="grey"
        />

        <Text>
          {t('RentYourVehicle.card.type')} <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <CustomPicker
          selectedValue={type}
          onValueChange={setType}
          items={types}
          placeholder={t('RentYourVehicle.card.selectType')}
        invalid={submitAttempted && !brand}
        />

        <Text>
          {t('RentYourVehicle.card.transmission')} <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <CustomPicker
          selectedValue={transmission}
          onValueChange={setTransmission}
          items={transmissions}
          placeholder={t('RentYourVehicle.card.selectTransmission')}
        invalid={submitAttempted && !brand}
        />


        <Text>
          {t('RentYourVehicle.card.fuel_type')} <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <CustomPicker
          selectedValue={fuelType}
          onValueChange={setFuelType}
          items={fuelTypes}
          placeholder={t('RentYourVehicle.card.selectFuelType')}
        invalid={submitAttempted && !brand}
        />

        <Text>
          {t('RentYourVehicle.card.capacity')} <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <CustomPicker
          selectedValue={capacity}
          onValueChange={setCapacity}
          items={capacities}
          placeholder={t('RentYourVehicle.card.selectCapacity')}
          invalid={submitAttempted && !brand}
        />

      <Text>
        {t('RentYourVehicle.card.num_doors')} <Text style={{ color: 'red' }}>*</Text>
      </Text>
      <CustomPicker
        selectedValue={numDoors}
        onValueChange={setNumDoors}
        items={numDoorsOptions}
        placeholder={t('RentYourVehicle.card.selectDoors')}
          invalid={submitAttempted && !brand}
      />
        
        <Text>
          {t('RentYourVehicle.card.price')} <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            !isFieldValid(price) && styles.invalidInput
          ]}
          placeholder={t('RentYourVehicle.card.price')}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholderTextColor="grey"
        />

        <Text>
          {t('RentYourVehicle.card.deposit')} <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <TextInput style={styles.input} placeholder={t('RentYourVehicle.card.deposit')} value={deposit} onChangeText={setDeposit} keyboardType="numeric" placeholderTextColor="grey"/>

        <TouchableOpacity style={styles.buttonAd} onPress={handleImagePicker}>
          <Text style={styles.buttonTextAd}>{t('RentYourVehicle.buttons.image')}</Text>
        </TouchableOpacity>

        { vehicleImageUri && (
          <Image source={{ uri: vehicleImageUri }} style={{ width: '100%', height: 300, borderRadius: 10, marginVertical: 10 }} />
        )}

        <TouchableOpacity style={styles.buttonPub} onPress={handleSubmit}>
          <Text style={styles.buttonTextPub}>{vehicleId ? t('RentYourVehicle.edit') : t('RentYourVehicle.buttons.publish')}</Text>
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
    outerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: 20,
  },
  container: {
    width: width < 500 ? '90%' : 600, 
    backgroundColor: theme.colors.secondary,
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4472C4',
  },
    pickerContainer: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4472C4', 
    backgroundColor: 'white',
    overflow: 'hidden',
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
    pickerPlaceholder: {
    color: 'grey',
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
    invalidInput: {
    borderColor: 'red',
    borderWidth: 1,
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
    width: '48%', 
  },
});
