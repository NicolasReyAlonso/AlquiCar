import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from "@/components/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export default function AccountPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [userName, setName] = useState('');
  const [userEmail, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false); // Estado para el modo admin

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Usuario no autenticado");
          return;
        }

        const email = await AsyncStorage.getItem("email");
        const response = await fetch(`http://localhost:3000/users/email/${email}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Error al obtener los datos");
        }
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);

        if (data.role === 'admin') {
          const usersResponse = await fetch('http://localhost:3000/users');
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }
      } catch (error) {
        Alert.alert("Error", (error as Error).message);
      }
    };

    fetchUserData();
  }, []);

  const handleReservas = () => {
    navigation.navigate("misReservas");
  };

  const handlePublicaciones = () => {
    navigation.navigate("misCochesPublicados");
  };

  const handleCerrarSesion = async () => {
    await AsyncStorage.setItem("isLoggedIn", "false");
    navigation.navigate("index");
  };

  const handleViewUser = (userId: string) => {
    navigation.navigate('account', { userId });
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar' },
        {
          text: 'Eliminar',
          onPress: async () => {
            const response = await fetch(`http://localhost:3000/users/${userId}`, { method: 'DELETE' });
            if (response.ok) {
              setUsers(users.filter(user => user.id !== userId));
            } else {
              Alert.alert('Error', 'No se pudo eliminar el usuario');
            }
          },
        },
      ],
    );
  };

  const handleToggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('Account.title')}</Text>
      <Image source={require('@/assets/images/avatar.png')} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.info}>{t('Account.name')}: {userName}</Text>
        <Text style={styles.info}>Email: {userEmail}</Text>
      </View>

      {/* Botón para cambiar entre modo admin y usuario */}
      {role === 'admin' && (
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={handleToggleAdminMode}
        >
          <Text style={styles.buttonText}>
            {isAdminMode ? 'Modo Usuario' : 'Modo Admin'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Mostrar los usuarios solo si estamos en modo admin */}
      {isAdminMode ? (
        <View style={styles.usersContainer}>
          <Text style={styles.subTitle}>Usuarios registrados</Text>
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text style={styles.userText}>{item.name} - {item.email}</Text>
                <View style={styles.userActions}>
                  <TouchableOpacity onPress={() => handleViewUser(item.id)} style={styles.actionButton}>
                    <Text style={styles.buttonText}>Ver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteUser(item.id)}
                    style={[styles.actionButton, { opacity: item.role === 'admin' ? 0.5 : 1 }]}
                    disabled={item.role === 'admin'}
                  >
                    <Text style={styles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleReservas}>
            <Text style={styles.buttonText}>{t('Account.buttons.reservations')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePublicaciones}>
            <Text style={styles.buttonText}>{t('Account.buttons.publications')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCerrarSesion}>
            <Text style={styles.buttonText}>{t('Account.buttons.logout')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 20,
    color: theme.colors.titles,
    fontFamily: theme.fonts.bold,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    alignSelf: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  info: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 5,
    fontFamily: theme.fonts.regular,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    width: '80%',
    backgroundColor: theme.colors.tabColor,
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 24,
    padding: 10,
    alignSelf: 'center',
  },
  usersContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userCard: {
    padding: 10,
    marginBottom: 10,
    width: '90%',
    borderRadius: 8,
    alignItems: 'center',
  },
  userText: {
    fontSize: 18,
    color: theme.colors.text,
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: theme.colors.tabColor,
    padding: 8,
    borderRadius: 5,
  },
  logoutButton: {
    marginTop: 20,
    width: '80%',
    marginVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
