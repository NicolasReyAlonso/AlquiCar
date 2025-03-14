import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText';

const index = () => {
  return (
    <SafeAreaView style={Styles.pageBody}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText style={Styles.h1}>AlquiCar</ThemedText>
        <ThemedText style={Styles.p}>
          Lorem impush
        </ThemedText>
        {/* Imagen completa ajustada */}
        <Image 
          source={require('@/assets/images/fondo.jpg')} 
          style={{ width: '100%', height: '100%' }} 
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
};

const Styles=StyleSheet.create({
  h1: {
    textAlign: "center", // Centrar el texto correctamente
    color: "white",
    fontSize: 46,
    fontWeight: "bold",
    lineHeight:46
  },
  p: {
    padding: 15,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    lineHeight:16
  },
  pageBody: {
    flex: 1, // Permite que el SafeAreaView ocupe toda la pantalla
    paddingTop: 30
    
  }
});

export default index
