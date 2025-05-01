import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Media = () => {
    const [vehicleImage, setVehicleImage] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Imagen de vehicle
                const vehicleRes = await fetch("http://localhost:3000/media/vehicles/4f26536a-25c4-11f0-9d8a-dee3d78c366c/2");
                const vehicleImages = await vehicleRes.json();
                if (vehicleImages.length > 0) {
                    setVehicleImage(vehicleImages[0].data);
                }

                // Imagen de perfil (vehicle_id IS NULL)
                const profileRes = await fetch("http://localhost:3000/media/profile/4f26536a-25c4-11f0-9d8a-dee3d78c366c");
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
