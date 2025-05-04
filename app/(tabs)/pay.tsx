import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, Platform } from 'react-native';
import axios from 'axios';
import { useStripe } from '@stripe/stripe-react-native';

const PayScreen = () => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();

  const handlePay = async () => {
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:3000/pay/stripe/pay', {
        product: {
          name: 'Alquiler de coche',
          price: 20, // euros
        },
        quantity: 1,
      });

      if (Platform.OS === 'web') {
        // Redirige a la URL completa de Stripe Checkout (devuelta por tu backend)
        window.location.href = data.url;
      } else {
        const { error: initError } = await stripe.initPaymentSheet({
          paymentIntentClientSecret: data.id,
        });
        if (initError) throw initError;

        const { error: presentError } = await stripe.presentPaymentSheet();
        if (presentError) throw presentError;

        Alert.alert('Éxito', 'El pago fue procesado correctamente.');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Pago con Stripe</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Pagar 20€" onPress={handlePay} />
      )}
    </View>
  );
};

export default PayScreen;
