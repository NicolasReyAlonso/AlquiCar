import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";

interface VehicleCardProps {
  brand: string;
  seats: number;
  type: string;
  mileage: string;
  pickupLocation: string;
  price: string;
  imageUrl: string;
  onReserve: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  brand,
  seats,
  type,
  mileage,
  pickupLocation,
  price,
  imageUrl,
  onReserve,
}) => {
  const { width } = useWindowDimensions(); 
  const isDesktop = width > 576;
  const styles = getStyles(width); 

  return (
    <View style={isDesktop ? styles.cardDesktop : styles.cardMobile}>
      <View style={styles.infoContainer}>
        <Text style={isDesktop ? styles.brandDesktop : styles.brandMobile}>{brand}</Text>
        <View style={styles.spacing} />
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>{seats} Plazas {type}</Text>
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>Kilometraje: {mileage}</Text>
        <View style={styles.spacing} />
        <Text style={isDesktop ? styles.detailsDesktop : styles.detailsMobile}>Lugar de recogida: {pickupLocation}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Image source={{ uri: imageUrl }} style={isDesktop ? styles.imageDesktop : styles.imageMobile} />
        <Text style={isDesktop ? styles.priceDesktop : styles.priceMobile}>{price}</Text>
        <TouchableOpacity style={styles.button} onPress={onReserve}>
          <Text style={isDesktop ? styles.buttonTextDesktop : styles.buttonTextMobile}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (width: number) =>
  StyleSheet.create({
    cardMobile: {
      flexDirection: "row",
      backgroundColor: "#d3d3d3",
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
      backgroundColor: "#d3d3d3",
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
    },
    brandDesktop: {
      fontSize: width * 0.025,
      fontWeight: "bold",
    },
    detailsMobile: {
      fontSize: 12,
      color: "#333",
    },
    detailsDesktop: {
      fontSize: width * 0.018,
      color: "#333",
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
    },
    priceDesktop: {
      fontSize: width * 0.022,
      fontWeight: "bold",
      marginVertical: 5,
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
    },
    buttonTextDesktop: {
      color: "white",
      fontSize: width * 0.02,
      fontWeight: "bold",
    },
  });

export default VehicleCard;
