import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DatosPersonales() {
  const [name, setName] = useState('Pepe');
  const [birthYear, setBirthYear] = useState('1989');
  const [province, setProvince] = useState('Las Palmas');
  const [email, setEmail] = useState('ejemplo@gmail.com');
  const [dni, setDni] = useState('12345678A');

  const handleSave = () => {
    if (!name || !birthYear || !province || !email || !dni) {
      alert('Faltan campos por rellenar');
      return;
    }
    console.log(`Nombre: ${name}, Año de nacimiento: ${birthYear}, Provincia: ${province}, Email: ${email}, DNI: ${dni}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Ionicons name="person-circle-outline" size={30} color="#4472C4" style={styles.icon} />
          <Text style={styles.headerText}>Datos Personales</Text>
        </View>
        <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Año de nacimiento" value={birthYear} onChangeText={setBirthYear} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Provincia" value={province} onChangeText={setProvince} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="DNI" value={dni} onChangeText={setDni} />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 50,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4472C4',
    width: width < 500 ? 300 : 600,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4472C4',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#4472C4',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
