import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Image, StyleSheet, Button, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Media = () => {
    const [vehicleImage, setVehicleImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [vehicleId, setVehicleId] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const email = await AsyncStorage.getItem("email");
                const userRes = await fetch(`http://localhost:3000/users/email/${email}`);
                const userData = await userRes.json();
                const uid = userData.id;
                setUserId(uid);

                const vehicleRes = await fetch(`http://localhost:3000/vehicles/`);
                const allVehicles = await vehicleRes.json();
                const userVehicles = allVehicles.filter(v => v.owner_id === uid);

                if (userVehicles.length > 0) {
                    const vid = userVehicles[0].id;
                    setVehicleId(vid);

                    const vImgRes = await fetch(`http://localhost:3000/media/vehicles/${uid}/${vid}`);
                    const vehicleImages = await vImgRes.json();
                    if (vehicleImages.length > 0) {
                        setVehicleImage(vehicleImages[0].data);
                    }
                }

                const profileRes = await fetch(`http://localhost:3000/media/profile/${uid}`);
                const profileImages = await profileRes.json();
                if (profileImages.length > 0) {
                    setProfileImage(profileImages[0].data);
                }

            } catch (error) {
                console.error("Error al cargar las imágenes:", error);
            }
        };

        fetchImages();
    }, []);

    const pickImageAndUpload = async (type = 'profile') => {
        if (Platform.OS !== 'web') {
            // Si no es web, usar expo-image-picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                handleImageUpload(uri, type);
            }
        } else {
            // Si es web, manejar el archivo con un input
            document.getElementById('fileInput').click();
        }
    };

    const handleFileChange = async (event, type) => {
        const file = event.target.files[0];
        if (file) {
            handleImageUpload(file, type);
        }
    };

    const handleImageUpload = async (image, type) => {
        const formData = new FormData();
        formData.append('image', image);

        const endpoint =
            type === 'profile'
                ? `http://localhost:3000/media/upload/${userId}`
                : `http://localhost:3000/media/upload/${userId}/${vehicleId}`;

        try {
            const uploadRes = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            const data = await uploadRes.json();
            console.log("Imagen subida:", data);
        } catch (e) {
            console.error("Error al subir imagen:", e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Media Screen</Text>

            {vehicleImage && <Image source={{ uri: vehicleImage }} style={styles.image} />}
            {profileImage && <Image source={{ uri: profileImage }} style={styles.image} />}

            <Button title="Subir Imagen de Perfil" onPress={() => pickImageAndUpload('profile')} />
            <Button title="Subir Imagen de Coche" onPress={() => pickImageAndUpload('vehicle')} />

            {/* Input hidden for Web */}
            {Platform.OS === 'web' && (
                <input
                    id="fileInput"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(event) => handleFileChange(event, 'profile')}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginBottom: 20,
        fontSize: 18,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 15,
        borderRadius: 10,
    },
});

export default Media;
