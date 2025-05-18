import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity, Alert, FlatList, ScrollView, Platform } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import theme from "@/components/Theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getApiUrl } from '@/utils/getApiUrl';

export default function AccountPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useTranslation();

  const [userName, setName] = useState('');
  const [userEmail, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);


  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`http://${getApiUrl()}/media/profile/${userId}`);
        const data = await response.json();

        if (data.length > 0) {
          setProfileImageUri(data[0].data);
        }
      } catch (error) {
        console.error("Error al cargar imagen de perfil:", error);
      }
    };


    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "Usuario no autenticado");
          return;
        }

        const response = await fetch(`${getApiUrl()}/users/getdata/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${token}'
          },
        });
        const data = await response.json();
        console.log("Datos del usuario:", data);

        if (!response.ok) {
          throw new Error(data.message || "Error al obtener los datos");
        }

        setName(data[0].name);
        setEmail(data[0].email);
        setRole(data[0].role);
        setUserId(data[0].id);

        await AsyncStorage.setItem("userId", data[0].id);

        const profileRes = await fetch(`${getApiUrl()}/media/profile/${data[0].id}`);
        const profileImages = await profileRes.json();
        if (profileImages.length > 0) {
          setProfileImageUri(profileImages[0].data);
        }

        if (data[0].role === 'admin') {
          const usersResponse = await fetch(`${getApiUrl()}/users`, {
            method: 'GET',
            credentials: 'include',
          });
          const usersData = await usersResponse.json();
          const filteredUsers = usersData.filter((user: { id: string }) => user.id !== data[0].id);
          setUsers(filteredUsers);
        }
      } catch (error) {
        Alert.alert("Error", (error as Error).message);
      }
    };

    fetchUserData();
    fetchProfileImage();
  }, []);

  const handleReservas = () => {
    navigation.navigate("misReservas");
  };

  const handlePublicaciones = () => {
    navigation.navigate("misCochesPublicados");
  };

  const handleCerrarSesion = async (id: string) => {
    if (id == userId) {
      await AsyncStorage.setItem("isLoggedIn", "false");
      await AsyncStorage.removeItem('user');
      navigation.navigate("index");

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'index' }],
        })
      );
    }
  };

  const handleViewUser = (userId: string) => {
    navigation.navigate('verUsuario', { userId: userId });
  };

  const handleDeleteUser = (userId: string) => {
  if (Platform.OS === 'web') {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta cuenta?');
    if (confirmDelete) {
      deleteUser(userId);
    }
  } else {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar esta cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteUser(userId),
        },
      ],
      { cancelable: false }
    );
  }
};

const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(`${getApiUrl()}/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      setUsers(users.filter(user => user.id !== userId));
      handleCerrarSesion(userId);
    } else {
      showAlert('Error', 'No se pudo eliminar el usuario');
    }
  } catch (error) {
    showAlert('Error', 'Algo salió mal al intentar eliminar el usuario');
  }
};

const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};


  const handleImageUpload = async (imageUri: string, imageName: string) => {
    const formData = new FormData();

    if (Platform.OS === "web") {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      formData.append("image", blob, imageName);
    } else {
      const match = /\.(\w+)$/.exec(imageUri);
      const fileType = match ? `image/${match[1]}` : `image`;

      formData.append("image", {
        uri: imageUri,
        name: imageName,
        type: fileType,
      } as any);
    }

    try {
      const uploadRes = await fetch(`${getApiUrl()}/media/upload/${userId}`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Error al subir imagen");

      const uploadData = await uploadRes.json();
      console.log("Imagen subida:", uploadData);

      // Actualizar imagen de perfil
      const newImgRes = await fetch(`${getApiUrl()}/media/profile/${userId}`);
      const newImgData = await newImgRes.json();

      if (newImgData.length > 0) {
        setProfileImageUri(newImgData[0].data);
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  const handleUpdateName = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      const response = await fetch(`${getApiUrl()}/users/${userId}`, {
        credentials: 'include',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: userName }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el nombre');
      }

      alert('Nombre actualizado correctamente');
      setIsEditingName(false); // salir del modo edición
    } catch (error) {
      alert('Error');
    }
  };


  const handleToggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  const handleImagePicker = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = (e: any) => {
        const file = e.target.files[0];
        const uri = URL.createObjectURL(file);
        handleImageUpload(uri, file.name);
      };

      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileName = uri.split("/").pop() || "image.jpg";
        handleImageUpload(uri, fileName);
      }
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('Account.title')}</Text>

      <TouchableOpacity onPress={handleImagePicker}>
        <Image
          source={profileImageUri ? { uri: profileImageUri } : require('@/assets/images/avatar.png')}
          style={styles.avatar}
        />
        <Text style={{ textAlign: 'center', color: theme.colors.text, marginBottom: 10 }}>
          {t('Account.changePhoto') || "Cambiar foto de perfil"}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          {isEditingName ? (
            <>
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setName}
                autoFocus
              />
              <TouchableOpacity onPress={handleUpdateName} style={styles.saveButtonSmall}>
                <Text style={styles.saveButtonText}>💾</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.info}>{t('Account.name')}: {userName}</Text>
              <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.editButtonSmall}>
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text style={styles.info}>Email: {userEmail}</Text>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            onPress={() => handleDeleteUser(userId)}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>{t('Account.eliminar')}</Text>
          </TouchableOpacity>

          <View style={{ width: 10 }}></View>

          {role === 'admin' && (
            <TouchableOpacity
              onPress={handleToggleAdminMode}
              style={styles.actionButton}
            >
              <Text style={styles.buttonText}>{isAdminMode ? t('ModoAdmin.modoUsuario') : t('ModoAdmin.modoAdmin')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isAdminMode ? (
        <View style={styles.usersContainer}>
          <Text style={styles.subTitle}>{t('ModoAdmin.usuarios')}</Text>
          <FlatList
            data={users}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text style={styles.userText}>{item.name} - {item.email}</Text>
                <View style={styles.userActions}>
                  <TouchableOpacity onPress={() => handleViewUser(item.id)} style={styles.actionButton}>
                    <Text style={styles.buttonText}>{t('ModoAdmin.ver')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteUser(item.id)}
                    style={[styles.actionButton, { opacity: item.role === 'admin' ? 0.5 : 1 }]}
                    disabled={item.role === 'admin'}
                  >
                    <Text style={styles.buttonText}>{t('ModoAdmin.eliminar')}</Text>
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
          <TouchableOpacity style={styles.button} onPress={() => handleCerrarSesion(userId)}>
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
    alignSelf: 'center'
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
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
    color: 'white',
    textAlign: 'center',
  },
  userCard: {
    padding: 10,
    marginBottom: 10,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
  },
  userText: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
  },
  userActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: theme.colors.tabColor,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  actionButtonContainer: {
    alignItems: 'center',
    gap: 10,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  editButtonSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.secondary,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  saveButtonSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: theme.colors.background,
    fontSize: 16,
    marginBottom: 10,
    color: theme.colors.text,
  },

});
