import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import theme from "@/components/Theme";

const{ width } = Dimensions.get('window');

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [province, setProvince] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (!name || !birthYear || !province || !email || !password || !confirmPassword) {
      alert('Faltan campos por rellenar');
      return;
    }
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    console.log(`Nombre: ${name}, Año de nacimiento: ${birthYear}, Provincia: ${province}, Email: ${email}, Contraseña: ${password}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Crear cuenta</Text>
        <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Año de nacimiento" value={birthYear} onChangeText={setBirthYear} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Provincia" value={province} onChangeText={setProvince} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Repetir contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
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
    backgroundColor: theme.colors.background,
    paddingVertical: 50,
  },
  container: {
    width: width < 500 ? 300 : 600,
    backgroundColor: theme.colors.secondary, 
    padding: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#4472C4',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.colors.titles,
    fontFamily: theme.fonts.bold,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4472C4',
    backgroundColor: 'white',
    color: theme.lightTemplate.textColor,
    fontFamily: theme.fonts.regular,
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
    fontFamily: theme.fonts.bold,
  },
});