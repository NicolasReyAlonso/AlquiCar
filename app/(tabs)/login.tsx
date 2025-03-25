import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
const { width } = Dimensions.get('window'); 

type RootStackParamList = {
  Home: 'index';  // Cambia esto al nombre de la pantalla a la que quieres ir
  Register: undefined;
};

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userName="Nelso@ulpgc.es";
  const userPass="Soy_Nelson1";
  const handleLogin = () => {
    if (email === userName && password === userPass){
      navigation.navigate("index");
    }
    
  };

  const handleRegister = () => {
    console.log('Registrarse');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        {/* Campo de Email */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Campo de Contraseña */}
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Button title="Iniciar Sesión" onPress={handleLogin} />
          <Text style={styles.separator}>o</Text>
          <Button title="Registrarse" onPress={handleRegister} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  formContainer: {
    width: width < 500 ? 300 : 600, 
    padding: 20,
    borderWidth: 2,
    borderColor: '#4472C4',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4472C4',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4472C4',
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 10,
  },
  separator: {
    textAlign: 'center',
    color: '#888',
    fontSize: 18,
    marginVertical: 10,
  },
});
