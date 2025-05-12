import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from "@expo/vector-icons";

interface MyPublishedVehiclesProps {
  brand: string;
  price: string;
  city: string;
  imageUrl?: string;
  onCancel: () => void;
  onEdit: () => void;
}

const PublishedVehicles: React.FC<MyPublishedVehiclesProps> = ({
  brand,
  price,
  city,
  imageUrl,
  onCancel,
  onEdit
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = getStyles(isDesktop, width);
  const { t } = useTranslation();

  return (
    <View style={styles.shadowContainer}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image' }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{price}</Text>
            <Text style={styles.perDayText}>/{t('MyPublishedVehicles.day')}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.brand}>{brand}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="location-on" size={16} color={theme.colors.gray} />
            <Text style={styles.cityText}>{city}</Text>
          </View>

          <TouchableOpacity 
            style={styles.editButton} 
            onPress={onEdit}
          >
            <MaterialIcons name="edit" size={16} color="white" />
            <Text style={styles.buttonText}>{t('MyPublishedVehicles.buttons.edit')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={onCancel}
          >
            <MaterialIcons name="delete-outline" size={16} color="white" />
            <Text style={styles.buttonText}>{t('MyPublishedVehicles.buttons.remove')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyles = (isDesktop: boolean, width: number) =>
  StyleSheet.create({
    shadowContainer: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
      marginVertical: 10,
      borderRadius: 12,
      backgroundColor: 'white',
      width: isDesktop ? width * 0.4 : width * 0.9,
      alignSelf: 'center',
    },
    card: {
      flexDirection: isDesktop ? "row" : "column",
      backgroundColor: theme.colors.white,
      borderRadius: 12,
      overflow: 'hidden',
      height: isDesktop ? 210 : 'auto',
    },
    imageContainer: {
      position: 'relative',
      width: isDesktop ? '40%' : '100%',
      height: isDesktop ? '100%' : 150,
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f5f5f5',
    },
    priceTag: {
      position: 'absolute',
      top: 16,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.7)',
    },
    priceText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: theme.fonts.bold,
    },
    perDayText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      marginLeft: 4,
    },
    infoContainer: {
      padding: 16,
      flex: 1,
      justifyContent: 'space-between',
    },
    header: {
      marginBottom: 12,
    },
    brand: {
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
      color: theme.colors.dark,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    cityText: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.colors.gray,
      marginLeft: 6,
    },
    removeButton: {
      backgroundColor: '#F44336',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: theme.fonts.bold,
      marginLeft: 8,
    },

    editButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      marginBottom: 8,
    }
  });

export default PublishedVehicles;