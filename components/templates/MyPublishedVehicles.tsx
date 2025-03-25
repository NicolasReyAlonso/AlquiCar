import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import theme from "@/components/Theme";

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
      backgroundColor: theme.colors.secondary,
      borderRadius: 10,
      padding: 15,
      width: width * 0.36,
      alignItems: "flex-start",
      marginVertical: 10,
    },
    cardMobile: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 10,
      padding: 15,
      width: 280,
      alignItems: "flex-start",
      marginVertical: 10,

    },
    imageDesktop: {
      width: "100%",
      height: width * 0.17,
      borderRadius: 5,
    },
    imageMobile: {
      width: "100%",
      height: 120,
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
      fontFamily: theme.fonts.bold,
      color: theme.lightTemplate.textColor,
    },
    brandMobile: {
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
      color: theme.lightTemplate.textColor,
    },
    priceDesktop: {
      fontSize: width * 0.017,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
      color: theme.lightTemplate.textColor,
    },
    priceMobile: {
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
      color: theme.lightTemplate.textColor,
    },
    cityDesktop: {
      fontSize: width * 0.014,
      marginVertical: 5,
      fontFamily: theme.fonts.regular,
      color: theme.lightTemplate.textColor,
    },
    cityMobile: {
      fontSize: 12,
      marginVertical: 5,
      fontFamily: theme.fonts.regular,
      color: theme.lightTemplate.textColor,
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
      fontFamily: theme.fonts.bold,
    },
    buttonTextMobile: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
  });

export default PublishedVehicles;
