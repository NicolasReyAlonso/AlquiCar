import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const carModels = {
  Seat: ['Ibiza', 'León', 'Ateca'],
  Opel: ['Corsa', 'Astra', 'Insignia'],
  Ford: ['Fiesta', 'Focus', 'Mustang'],
};

export default function AlquilarCoche() {
  const [brand, setBrand] = useState<keyof typeof carModels>('Seat');
  const [model, setModel] = useState(carModels['Seat'][0]);
  const [year, setYear] = useState('2010');
  const [mileage, setMileage] = useState('100-150,000 km');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    if (!brand || !model || !year || !mileage || !city || !price) {
      alert('Faltan campos por rellenar');
      return;
    }
    console.log(`Marca: ${brand}, Modelo: ${model}, Año: ${year}, Kilometraje: ${mileage}, Ciudad: ${city}, Precio: ${price}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <ThemedView style={styles.form}>
        <ThemedText style={styles.title} type="title">Alquilar un coche</ThemedText>
        <Text>Marca de coche a alquilar</Text>
        <Picker
          selectedValue={brand}
          onValueChange={(itemValue) => {
            setBrand(itemValue as keyof typeof carModels);
            setModel(carModels[itemValue as keyof typeof carModels][0]);
          }}
          style={styles.input}
        >
          {Object.keys(carModels).map((brand) => (
            <Picker.Item key={brand} label={brand} value={brand} />
          ))}
        </Picker>
        <Text>Modelo del coche</Text>
        <Picker selectedValue={model} onValueChange={setModel} style={styles.input}>
          {carModels[brand].map((model) => (
            <Picker.Item key={model} label={model} value={model} />
          ))}
        </Picker>
        <Text>Año del coche</Text>
        <Picker selectedValue={year} onValueChange={setYear} style={styles.input}>
          <Picker.Item label="Antes del 2001" value="Antes del 2001" />
          <Picker.Item label="2001-2005" value="2001-2005" />
          <Picker.Item label="2006-2010" value="2006-2010" />
          <Picker.Item label="2011-2015" value="2011-2015" />
          <Picker.Item label="2016-2020" value="2016-2020" />
          <Picker.Item label="2021-2025" value="2021-2025" />
        </Picker>
        <Text>Kilometraje del coche</Text>
        <Picker selectedValue={mileage} onValueChange={setMileage} style={styles.input}>
          <Picker.Item label="Menos de 100,000 km" value="Menos de 100,000 km" />
          <Picker.Item label="100-150,000 km" value="100-150,000 km" />
          <Picker.Item label="150-200,000 km" value="150-200,000 km" />
          <Picker.Item label="Más de 200,000 km" value="Más de 200,000 km" />
        </Picker>
        <TextInput style={styles.input} placeholder="Introduce tu ciudad" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Precio por día" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TouchableOpacity style={styles.buttonAd}>
          <Text style={styles.buttonTextAd}>Adjuntar imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPub} onPress={handleSubmit}>
          <Text style={styles.buttonTextPub}>Publicar</Text>
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
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
    marginBottom: 10,
  },
  form: {
    width: '90%',
    backgroundColor: '#E5E5E5',
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
  },
  buttonAd: {
    backgroundColor: 'grey',
    padding: 5,
    borderRadius: 5,
    width: 150,
  },
  buttonTextAd: {
    color: 'black',
    fontSize: 14,
  },
});
