import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '@/components/Theme';

export default function PagoFallido() {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('index');
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/failure.png')}
        style={styles.image}
      />

      <View style={styles.card}>
        <Text style={styles.title}>¡Pago fallido!</Text>
        <Text style={styles.subtitle}>Hubo un error al procesar tu pago. Serás redirigido al inicio...</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('index')}>
          <Text style={styles.buttonText}>Ir ahora</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#dc3545', // rojo para error
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
