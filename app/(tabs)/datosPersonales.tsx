import { View, Text, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import React from 'react';
import { addWhitelistedNativeProps } from 'react-native-reanimated/lib/typescript/ConfigHelper';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';

const colorScheme = useColorScheme();
const color = colorScheme==='dark' ? 'white' : "black";
const DatosPersonales = () => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, backgroundColor:'rgba(225, 225, 225, 0.9)'}}>

          <View style={{paddingHorizontal: 20, marginLeft: 200, marginRight: 200, marginBottom: 50, marginTop: 50}}>
            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 20, borderRadius: 10, borderWidth: 2, borderColor: '#4472C4' }}>
                <View style={{ flexDirection: 'row',alignItems: 'center', marginBottom: 10}}>
                    <Ionicons name="person-circle-outline" size={30} color="black" style={{ marginRight: 10 }}/>
                    <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold' }}>Username</Text>
                </View>

              <TextInput
                placeholder="Nombre"
                placeholderTextColor='#4472C4'
                defaultValue='Pepe'
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="Año de nacimiento"
                placeholderTextColor="grey"
                defaultValue='1989'
                keyboardType="numeric"
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="Provincia"
                placeholderTextColor="grey"
                defaultValue='Las Palmas'
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="grey"
                keyboardType="email-address"
                defaultValue='ejemplo@gmail.com'
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
              <TextInput
                placeholder="DNI"
                placeholderTextColor="grey"
                defaultValue='12345678A'
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: 'black' }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default DatosPersonales;
