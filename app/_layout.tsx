import React, { useState, ReactNode, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Platform, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Link, useNavigation } from 'expo-router';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import theme from '../components/Theme';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import i18n from '../assets/location/i18n';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
}

type RootStackParamList = {
  Home: 'index'; 
  Register: undefined;
};

async function checkLoginStatus() {
  const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  return isLoggedIn === 'true';
}

export default function Layout({ children }: LayoutProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? 'white' : 'black';
  const [appIsReady, setAppIsReady] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      setAppIsReady(true);
    };
    init();
  }, []);

  const handleLogin = async () => {
    const isLoggedIn = await checkLoginStatus();
    if (isLoggedIn) {
      navigation.navigate('account');
    } else {
      navigation.navigate('login');
    }
  };

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    setIsLangMenuOpen(false);
    if (Platform.OS !== 'web') {
      await AsyncStorage.setItem('appLanguage', lng);
    } else {
      localStorage.setItem('appLanguage', lng);
    }
  };

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4472C4" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.touchableButton}
                onPress={() => setIsLangMenuOpen(!isLangMenuOpen)}
              >
                <Ionicons name="globe-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
              <Ionicons name="person-circle-outline" onPress={handleLogin} size={30} color="white" />
              <TouchableOpacity style={styles.touchableButton} onPress={() => setIsMenuOpen(!isMenuOpen)}>
                <Text style={styles.touchableButtonText}>{t('layout.Menu')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {isLangMenuOpen && (
          <View style={styles.languageMenu}>
            <TouchableOpacity onPress={() => changeLanguage('es')}>
              <Text style={styles.languageOption}>🇪🇸 Español</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeLanguage('en')}>
              <Text style={styles.languageOption}>🇬🇧 English</Text>
            </TouchableOpacity>
          </View>
        )}

        {isMenuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
              <Text style={styles.closeButton}>{t('layout.menuButtons.close')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('index')}>
              <FontAwesome name="home" size={24} color={color} />
              <Text style={styles.menuItemText}>{t('layout.menuButtons.home')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('misReservas')}>
              <FontAwesome5 name="shopping-cart" size={24} color={color} />
              <Text style={styles.menuItemText}>{t('layout.menuButtons.reservations')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#4472C4',
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#4472C4',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerLeft: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: 50,
    width: 250,
    backgroundColor: '#4472C4',
    padding: 20,
    zIndex: 1000,
  },
  closeButton: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 18,
  },
  languageMenu: {
    position: 'absolute',
    top: 60,
    left: 15,
    flexDirection: 'column',
    backgroundColor: '#4472C4',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  languageOption: {
    fontSize: 18,
    color: 'white',
    marginVertical: 5,
  },
  touchableButton: {
    backgroundColor: '#4472C4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  touchableButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
