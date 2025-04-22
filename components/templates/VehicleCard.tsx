import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

interface VehicleCardProps {
  brand: string;
  model: string;  
  year: number;  
  seats: number;
  type: string;
  transmission: string; 
  fuelType: string; 
  numDoors: number;  
  deposit: string;  
  mileage: string;
  pickupLocation: string;
  price: string;
  imageUrl: string;
  onReserve: () => void;
}


const VehicleCard: React.FC<VehicleCardProps> = ({
  brand,
  model,  // ✅ Ahora sí está definido
  year,  // ✅ Ahora sí está definido
  seats,
  type,
  transmission,  // ✅ Ahora sí está definido
  fuelType,  // ✅ Ahora sí está definido
  numDoors,  // ✅ Ahora sí está definido
  deposit,  // ✅ Ahora sí está definido
  mileage,
  pickupLocation,
  price,
  imageUrl,
  onReserve,
}) => {
  const { width } = useWindowDimensions(); 
  const isDesktop = width > 576;
  const styles = getStyles(width); 
  const { t } = useTranslation();

  return (
    <View style={isDesktop ? styles.cardDesktop : styles.cardMobile}>
      <View style={styles.infoContainer}>
        <Text style={isDesktop ? styles.brandDesktop : styles.brandMobile}>{brand} {model} ({year})</Text>
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>Tipo: {type}</Text>
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>Transmisión: {transmission}</Text>
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>Combustible: {fuelType}</Text>
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>Capacidad: {seats} pasajeros</Text>
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>Puertas: {numDoors}</Text>
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>Depósito: {deposit}</Text>
        <Text style={isDesktop ? styles.priceDesktop : styles.priceMobile}>Precio Diario: {price}</Text>
      </View>

      <View style={styles.rightContainer}>
        <Image source={{ uri: imageUrl }} style={isDesktop ? styles.imageDesktop : styles.imageMobile} />
        <Text style={isDesktop ? styles.priceDesktop : styles.priceMobile}>{price}/{t('VehicleCard.day')}</Text>
        <TouchableOpacity style={styles.button} onPress={onReserve}>
          <Text style={isDesktop ? styles.buttonTextDesktop : styles.buttonTextMobile}>{t('VehicleCard.buttons.reservation')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (width: number) =>
  StyleSheet.create({
    cardMobile: {
      flexDirection: "row",
      backgroundColor: theme.colors.secondary,
      padding: 15,
      borderRadius: 8,
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,
      width: 320,
      height: 150,
    },
    cardDesktop: {
      flexDirection: "row",
      backgroundColor: theme.colors.secondary,
      padding: width * 0.04,
      borderRadius: 8,
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,
      width: width * 0.8,
      height: width * 0.25,
      alignSelf: "center",
    },
    infoContainer: {
      flex: 1,
    },
    brandMobile: {
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
      color: theme.lightTemplate.textColor,
    },
    brandDesktop: {
      fontSize: width * 0.025,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
      color: theme.lightTemplate.textColor,
    },
    detailsMobile: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.lightTemplate.textColor,
    },
    detailsDesktop: {
      fontSize: width * 0.018,
      fontFamily: theme.fonts.regular,
      color: theme.lightTemplate.textColor,
    },
    spacing: {
      height: width * 0.02,
    },
    rightContainer: {
      alignItems: "center",
    },
    imageMobile: {
      width: 70,
      height: 60,
      backgroundColor: "#777",
    },
    imageDesktop: {
      width: width * 0.18,
      height: width * 0.15,
      backgroundColor: "#777",
    },
    priceMobile: {
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 5,
      fontFamily: theme.fonts.bold,
      color: theme.lightTemplate.textColor,
    },
    priceDesktop: {
      fontSize: width * 0.022,
      fontWeight: "bold",
      marginVertical: 5,
      fontFamily: theme.fonts.bold,
      color: theme.lightTemplate.textColor,
    },
    button: {
      backgroundColor: "#3b6ed5",
      paddingVertical: width * 0.01,
      paddingHorizontal: width * 0.04,
      borderRadius: 5,
    },
    buttonTextMobile: {
      color: "white",
      fontSize: 14,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
    },
    buttonTextDesktop: {
      color: "white",
      fontSize: width * 0.02,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
    },
  });

export default VehicleCard;
