import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

export default function Layout({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? 'white' : 'black';
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Estado para el menú desplegable
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Header */}
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.headerRight}>
          <Link href="prueba">
            <Ionicons name="person-circle-outline" size={30} color="white" />
          </Link>
          <Button title="Menú" onPress={() => setIsMenuOpen(!isMenuOpen)} />
        </View>
      </View>
    
      {/* Menú desplegable (se muestra/oculta con isMenuOpen) */}
      {isMenuOpen && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
            <Text style={styles.closeButton}>✖ Cerrar</Text>
          </TouchableOpacity>
          <Link style={styles.menuItem} href="/">
            <FontAwesome name="home" size={24} color={color} />
            <Text style={styles.menuItem}>HomePage</Text>
          </Link>
          <Link style={styles.menuItem} href="alquilaCoche">
            <FontAwesome5 name="car" size={24} color={color} ></FontAwesome5>
            <Text style={styles.menuItem}>Alquila un vehiculo</Text>
          </Link>
          <Link style={styles.menuItem} href="explore">
            <FontAwesome5 name="car" size={24} color={color} ></FontAwesome5>
            <Text style={styles.menuItem}>Explora</Text>
          </Link>
          <Link style={styles.menuItem} href="explore">
            <FontAwesome5 name="car" size={24} color={color} ></FontAwesome5>
            <Text style={styles.menuItem}>Explora</Text>
          </Link>
          <Text style={styles.menuItem}>Configuración</Text>
        </View>
      )}
      </ThemeProvider>
      {/* Contenido principal */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#4472C4',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  headerRight: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 50, // Para que no tape el header
    width: 250,
    backgroundColor: '#333',
    padding: 20,
    zIndex: 1000,
  },
  closeButton: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  menuItem: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
});
