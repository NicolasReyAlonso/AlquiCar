// StripeCheckoutTest.js
import React from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import axios from 'axios';
import { getApiUrl, getAppUrl } from '@/utils/getApiUrl';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const StripeCheckoutTest = () => {
  const handleCheckout = async () => {
  try {
    const response = await axios.post(`${getApiUrl()}/pay`, {
      reservationid: '3',
      apiurl: `${getAppUrl()}`
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