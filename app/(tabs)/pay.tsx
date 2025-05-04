// StripeCheckoutTest.js
import React from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const StripeCheckoutTest = () => {
  const handleCheckout = async () => {
  try {
    const response = await axios.post('http://localhost:3000/create-checkout-session', {
      price: '100',
      product: {
        name: 'coche de prueba',
        price: 0,
      },
      quantity: 1,
    });

    const checkoutUrl = response.data.url;
    console.log('Checkout URL:', checkoutUrl);

    if (Platform.OS === 'web') {
      window.location.href = checkoutUrl;
    } else {
      Linking.openURL(checkoutUrl);
    }
  } catch (error) {
    console.error('Error al iniciar el checkout:', error);
    Alert.alert('Error', 'No se pudo iniciar el pago.');
  }
};
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pagar con Stripe" onPress={handleCheckout} />
    </View>
  );
};

export default StripeCheckoutTest;
