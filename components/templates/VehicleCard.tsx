import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import theme from "@/components/Theme";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

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
  vehicleId: number;
  price: string;
  imageUrl: string;
  onReserve: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  brand,
  model,
  year,
  seats,
  type,
  transmission,
  fuelType,
  numDoors,
  deposit,
  mileage,
  pickupLocation,
  vehicleId,
  price,
  imageUrl,
  onReserve,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = getStyles(isDesktop, width);
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={styles.shadowContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: "/vehicleDetailsPage", params: { id: vehicleId } })}
        style={styles.card}
      >
        {/* Sección de imagen con precio */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image' }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{price}</Text>
            <Text style={styles.perDayText}>/{t("VehicleCard.day")}</Text>
          </View>
        </View>

        {/* Sección de información principal */}
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.brand}>{brand} {model}</Text>
            <Text style={styles.year}>{year}</Text>
          </View>
          
          <Text style={styles.type}>{type}</Text>

          {/* Detalles del vehículo en dos columnas */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <MaterialIcons name="people" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{seats} {t("VehicleCard.places")}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="car-door" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{numDoors} {t("VehicleCard.doors")}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="settings" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{transmission}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="local-gas-station" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{fuelType}</Text>
            </View>

            <View style={styles.detailItem}>
              <MaterialIcons name="security" size={16} color={theme.colors.primary} />
              <Text style={styles.detailText}>{deposit}</Text>
            </View>
          </View>

          {/* Pie de tarjeta con ubicación y botón */}
          <View style={styles.footer}>
            <View style={styles.location}>
            </View>
            <TouchableOpacity 
              style={styles.reserveButton} 
              onPress={(e) => {
                e.stopPropagation();
                onReserve();
              }}
            >
              <Text style={styles.reserveButtonText}>{t("VehicleCard.buttons.reservation")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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
      width: isDesktop ? width * 0.8 : width * 0.9,
      alignSelf: 'center',
    },
    card: {
      flexDirection: isDesktop ? "row" : "column",
      backgroundColor: theme.colors.white,
      borderRadius: 12,
      overflow: 'hidden',
      height: isDesktop ? 220 : 'auto',
    },
    imageContainer: {
      position: 'relative',
      width: isDesktop ? '40%' : '100%',
      height: isDesktop ? '100%' : 180,
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
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    brand: {
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
      color: theme.colors.dark,
    },
    year: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.colors.gray,
    },
    type: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.colors.primary,
      marginBottom: 12,
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '48%',
      marginBottom: 8,
    },
    detailText: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.colors.dark,
      marginLeft: 6,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: theme.colors.lightGray,
      paddingTop: 12,
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      maxWidth: '60%',
    },
    locationText: {
      fontSize: 12,
      fontFamily: theme.fonts.regular,
      color: theme.colors.gray,
      marginLeft: 4,
    },
    reserveButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    reserveButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: theme.fonts.bold,
    },
  });

export default VehicleCard;