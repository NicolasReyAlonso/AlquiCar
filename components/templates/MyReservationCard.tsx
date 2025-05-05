import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from "@expo/vector-icons";

interface MyReservationCardProps {
  brand: string;
  price: string;
  date: string;
  status: string;
  imageUrl?: string;
  onCancel: () => void;
  onPress: () => void;
}

const ReservationCard: React.FC<MyReservationCardProps> = ({
  brand,
  price,
  date,
  status,
  imageUrl,
  onCancel,
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  const styles = getStyles(isDesktop, width);
  const { t } = useTranslation();

  const getStatusStyle = () => {
    switch (status) {
      case "Confirmed":
        return styles.confirmed;
      case "Pending":
        return styles.pending;
      case "Cancelled":
        return styles.cancelled;
      default:
        return styles.defaultStatus;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Confirmed":
        return "check-circle";
      case "Pending":
        return "pending";
      case "Cancelled":
        return "cancel";
      default:
        return "info";
    }
  };

  return (
    <View style={styles.shadowContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.card}
        onPress={onPress}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUrl || 'https://via.placeholder.com/300x200?text=No+Image' }} 
            style={styles.image} 
            resizeMode="cover"
          />
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{price}</Text>
            <Text style={styles.perDayText}>/{t('MyReservationCard.day')}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.brand}>{brand}</Text>
            <View style={[styles.statusContainer, getStatusStyle()]}>
              <MaterialIcons 
                name={getStatusIcon()} 
                size={16} 
                color={getStatusStyle().color} 
              />
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={16} color={theme.colors.gray} />
            <Text style={styles.dateText}>{t('MyReservationCard.date')}: {date}</Text>
          </View>

          {status === "Pending" && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
              >
                <Text style={styles.buttonText}>{t('MyReservationCard.buttons.cancel')}</Text>
              </TouchableOpacity>
            </View>
          )}
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
      width: isDesktop ? width * 0.4 : width * 0.9,
      alignSelf: 'center',
    },
    card: {
      flexDirection: isDesktop ? "row" : "column",
      backgroundColor: theme.colors.white,
      borderRadius: 12,
      overflow: 'hidden',
      height: isDesktop ? 180 : 'auto',
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    brand: {
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: theme.fonts.bold,
      color: theme.colors.dark,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    statusText: {
      fontSize: 14,
      fontFamily: theme.fonts.medium,
      marginLeft: 4,
    },
    confirmed: {
      color: '#4CAF50',
    },
    pending: {
      color: '#FFC107',
    },
    cancelled: {
      color: '#F44336',
    },
    defaultStatus: {
      color: theme.colors.gray,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    dateText: {
      fontSize: 14,
      fontFamily: theme.fonts.regular,
      color: theme.colors.gray,
      marginLeft: 6,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    cancelButton: {
      backgroundColor: '#F44336',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    buttonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: theme.fonts.bold,
    },
  });

export default ReservationCard;