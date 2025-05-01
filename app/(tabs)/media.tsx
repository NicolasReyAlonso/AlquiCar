import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Image, StyleSheet } from 'react-native';

const Media = () => {
    const [vehicleImage, setVehicleImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const email = await AsyncStorage.getItem("email");
                const userRes = await fetch(`http://localhost:3000/users/email/${email}`);
                const userData = await userRes.json();
                
                const userId = userData.id;
                console.log(userId);
                const response = await fetch(`http://localhost:3000/vehicles/`);
                const allVehicles = await response.json();

                

                const userVehicles = allVehicles.filter(v => v.owner_id === userId);
                setVehicles(userVehicles);
                console.log(userVehicles[0]);
                
                // Imagen de vehicle
                const vehicleRes = await fetch(`http://localhost:3000/media/vehicles/${userId}/${userVehicles[0].id}`);
                const vehicleImages = await vehicleRes.json();
                if (vehicleImages.length > 0) {
                    setVehicleImage(vehicleImages[0].data);
                }

                // Imagen de perfil (vehicle_id IS NULL)
                const profileRes = await fetch(`http://localhost:3000/media/profile/${userId}`);
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

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Media Screen</Text>

            {vehicleImage && (
                <Image
                    source={{ uri: vehicleImage }}
                    style={styles.image}
                />
            )}

            {profileImage && (
                <Image
                    source={{ uri: profileImage }}
                    style={styles.image}
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
    },
    text: {
        marginBottom: 20,
        fontSize: 18,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 15,
    },
});

export default Media;
