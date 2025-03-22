import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";

interface MyPublishedVehiclesProps {
  brand: string;
  price: string;
  city: string;
  imageUrl?: string;
  onCancel: () => void;
}

const PublishedVehicles: React.FC<MyPublishedVehiclesProps> = ({
  brand,
  price,
  city,
  imageUrl,
  onCancel,
}) => {
  const { width } = useWindowDimensions(); 
  const isDesktop = width > 576;
  const styles = getStyles(width, isDesktop); 

  return (
    <View style={isDesktop ? styles.containerDesktop : styles.containerMobile}>
      <View style={isDesktop ? styles.cardDesktop : styles.cardMobile}>
        <Image source={{ uri: imageUrl }} style={isDesktop ? styles.imageDesktop : styles.imageMobile} />
        <View style={isDesktop ? styles.detailsContainerDesktop : styles.detailsContainerMobile}>
          <View style={isDesktop ? styles.rowDesktop : styles.rowMobile}>
            <Text style={isDesktop ? styles.brandDesktop : styles.brandMobile}>{brand}</Text>
            <Text style={isDesktop ? styles.priceDesktop : styles.priceMobile}>{price}</Text>
          </View>
          <Text style={isDesktop ? styles.cityDesktop : styles.cityMobile}>Ciudad: {city}</Text>
          <TouchableOpacity style={isDesktop ? styles.buttonDesktop : styles.buttonMobile} onPress={onCancel}>
            <Text style={isDesktop ? styles.buttonTextDesktop : styles.buttonTextMobile}>Quitar vehículo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyles = (width: number, isDesktop: boolean) =>
  StyleSheet.create({
    containerDesktop: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: 20,
      padding: 10,
    },
    containerMobile: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      padding: 10,
    },
    cardDesktop: {
      backgroundColor: "#d3d3d3",
      borderRadius: 10,
      padding: 15,
      width: width * 0.36,
      alignItems: "flex-start",
      marginVertical: 10,
    },
    cardMobile: {
      backgroundColor: "#d3d3d3",
      borderRadius: 10,
      padding: 15,
      width: 280,
      alignItems: "flex-start",
      marginVertical: 10,

    },
    imageDesktop: {
      width: "100%",
      height: width * 0.17,
      backgroundColor: "#777",
      borderRadius: 5,
    },
    imageMobile: {
      width: "100%",
      height: 120,
      backgroundColor: "#777",
      borderRadius: 5,
    },
    detailsContainerDesktop: {
      width: "100%",
      paddingTop: 10,
    },
    detailsContainerMobile: {
      width: "100%",
      paddingTop: 10,
    },
    rowDesktop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rowMobile: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    brandDesktop: {
      fontSize: width * 0.017,
      fontWeight: "bold",
    },
    brandMobile: {
      fontSize: 16,
      fontWeight: "bold",
    },
    priceDesktop: {
      fontSize: width * 0.017,
      fontWeight: "bold",
    },
    priceMobile: {
      fontSize: 16,
      fontWeight: "bold",
    },
    cityDesktop: {
      fontSize: width * 0.014,
      color: "#555",
      marginVertical: 5,
    },
    cityMobile: {
      fontSize: 12,
      color: "#555",
      marginVertical: 5,
    },
    buttonDesktop: {
      backgroundColor: "#3b6ef5",
      paddingVertical: 8,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 5,
      width: width * 0.15,
      alignSelf: "flex-end",
    },
    buttonMobile: {
      backgroundColor: "#3b6ef5",
      paddingVertical: 6,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 5,
      alignSelf: "flex-start",
      width: 125,
    },
    buttonTextDesktop: {
      color: "white",
      fontWeight: "bold",
      fontSize: width * 0.015,
    },
    buttonTextMobile: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
    },
  });

export default PublishedVehicles;
