import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function AlquilarCoche() {
  const [brand, setBrand] = useState('Seat');
  const [model, setModel] = useState('Ibiza');
  const [year, setYear] = useState('2010');
  const [mileage, setMileage] = useState('100-150,000 km');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = () => {
    if (!brand || !model || !year || !mileage || !city || !price || !image) {
      alert('Faltan campos por rellenar');
      return;
    }
    console.log(`Marca: ${brand}, Model: ${model}, Año: ${year}, Kilometraje: ${mileage}, Ciudad: ${city}, Precio: ${price}, Imagen: ${image},`);
  };

  //TO DO: vale se puede poner el boton de adjuntar sin gestionar lo de la imagen por ahora, y otra cosa que me acabo de dar cuenta es que no deberia permitir combinaciones seat corsa por ejemplo, sino que cuando por ejemplo se ponga seat solo se puedan poner los modelos que vayan con esa marca no?
  //TO DO: terminar lo de la validación
  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <ThemedView style={styles.form}>
        <ThemedText style={styles.title} type="title">Poner en alquiler tu coche</ThemedText>
        <Text>Marca de coche a alquilar</Text>
        <Picker selectedValue={brand} onValueChange={setBrand} style={styles.input}>
          <Picker.Item label="Seat" value="Seat" />
        </Picker>
        <Picker selectedValue={model} onValueChange={setModel} style={styles.input}>
          <Picker.Item label="Ibiza" value="Ibiza" />
        </Picker>
        <Text>Año del coche</Text>
        <Picker selectedValue={year} onValueChange={setYear} style={styles.input}>
          <Picker.Item label="2010" value="2010" />
          <Picker.Item label="2015" value="2015" />
          <Picker.Item label="2020" value="2020" />
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
        <TextInput style={styles.input} placeholder="Adjuntar imagen" value={image} onChangeText={setImage} />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Publicar</Text>
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
  form: {
    width: '90%',
    backgroundColor: '#E5E5E5',
    padding: 20,
    borderRadius: 10,
  },
  title: {
     color: 'black',
     marginBottom: 20, 
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4472C4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
