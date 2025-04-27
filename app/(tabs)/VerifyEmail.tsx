import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import theme from '@/components/Theme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleGoLogin = () => {
    navigation.navigate('login');
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('VerifyEmail.title')}</Text>
        <Text style={styles.subtitle}>{t('VerifyEmail.message')}</Text>
        <TouchableOpacity style={styles.button} onPress={handleGoLogin}>
          <Text style={styles.buttonText}>{t('VerifyEmail.goToLogin')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width < 500 ? 300 : 600,
    backgroundColor: theme.colors.secondary,
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4472C4',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.titles,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: theme.fonts.bold,
  },
  subtitle: {
    fontSize: 18,
    color: theme.lightTemplate.textColor,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: theme.fonts.regular,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#4472C4',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontFamily: theme.fonts.bold,
    fontSize: 16,
  },
});
