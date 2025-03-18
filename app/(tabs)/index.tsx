import { View, Text, SafeAreaView, Image, TextInput, ScrollView, TouchableOpacity, Button } from 'react-native';
import React from 'react';

const index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Imagen de fondo */}
          <Image 
            source={require('@/assets/images/fondo2.png')} 
            style={{ width: '100%', height: '100%', position: 'absolute' }} 
            resizeMode="cover" 
          />

          <View style={{ marginTop: 200, flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20 }}>
            {/* Texto */}
            <Text style={{ 
              color: 'white', 
              fontSize: 70, 
              fontWeight: 'bold', 
              flex: 1, 
            }}>
              Inicia tu aventura
            </Text>
            
            {/* Cuadro gris */}
            <View style={{
              backgroundColor: 'rgba(200, 200, 200, 0.8)',
              padding: 30,
              borderRadius: 10,
              width: 400,
              height: 300,
              marginLeft: 20, 
            }}>
              <TextInput
                placeholder="Origen"
                placeholderTextColor="gray"
                style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <TextInput
                  placeholder="Fecha de recogida"
                  placeholderTextColor="gray"
                  style={{ flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 5 }}
                />
                <TextInput
                  placeholder="Hora"
                  placeholderTextColor="gray"
                  style={{ width: 80, backgroundColor: 'white', padding: 10, marginLeft: 10, borderRadius: 5 }}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <TextInput
                  placeholder="Fecha de devolución"
                  placeholderTextColor="gray"
                  style={{ flex: 1, backgroundColor: 'white', padding: 10, borderRadius: 5 }}
                />
                <TextInput
                  placeholder="Hora"
                  placeholderTextColor="gray"
                  style={{ width: 80, backgroundColor: 'white', padding: 10, marginLeft: 10, borderRadius: 5 }}
                />
              </View>
              <Button title="Buscar" color="#4472C4" onPress={() => alert('¡Buscando!')} />
            </View>
          </View>

          <View style={{
            marginTop: 300,
            flexDirection: 'row', 
            justifyContent: 'space-around', 
            paddingHorizontal: 20,
          }}>
            <TouchableOpacity
              style={{ backgroundColor: '#4472C4', padding: 20, borderRadius: 10, flex: 1, marginRight: 10 }}
            >
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Poner en alquiler tu coche</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: '#4472C4', padding: 20, borderRadius: 10, flex: 1 }}
            >
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Ofertas cerca de ti</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
