import { View, Text, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import React from 'react';
import { addWhitelistedNativeProps } from 'react-native-reanimated/lib/typescript/ConfigHelper';

const colorScheme = useColorScheme();
const color = colorScheme==='dark' ? 'white' : "black";
const Register = () => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, backgroundColor:'rgba(225, 225, 225, 0.9)'}}>

          <View style={{paddingHorizontal: 20, marginLeft: 200, marginRight: 200, marginBottom: 50, marginTop: 50}}>
            <Text style={{ color: 'black', fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
              Crear una cuenta
            </Text>

            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 20, borderRadius: 10, borderWidth: 2, borderColor: '#4472C4' }}>
              <TextInput
                placeholder="Nombre"
                placeholderTextColor="gray"
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="Año de nacimiento"
                placeholderTextColor="gray"
                keyboardType="numeric"
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="Provincia"
                placeholderTextColor="gray"
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="gray"
                secureTextEntry
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="Repetir contraseña"
                placeholderTextColor="gray"
                secureTextEntry
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 20, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TouchableOpacity
                style={{ backgroundColor: '#4472C4', padding: 15, borderRadius: 5, alignItems: 'center' }}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default Register;
