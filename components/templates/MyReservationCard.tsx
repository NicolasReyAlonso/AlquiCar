import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from "react-native";
import theme from "@/components/Theme";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

interface MyReservationCardProps {
  brand: string;
  price: string;
  date: string;
  status: string;
  imageUrl?: string;
  onCancel: () => void;
  onPress: () => void; // Nueva propiedad para manejar el evento onPress
}

const ReservationCard: React.FC<MyReservationCardProps> = ({
  brand,
  price,
  date,
  status,
  imageUrl,
  onCancel,
  onPress, // Recibe onPress desde el componente padre
}) => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 576;
  const styles = getStyles(width, isDesktop);
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={isDesktop ? styles.containerDesktop : styles.containerMobile}
      onPress={onPress} // Llama a onPress cuando el usuario toca la tarjeta
    >
      <View style={isDesktop ? styles.cardDesktop : styles.cardMobile}>
        <Image source={{ uri: imageUrl }} style={isDesktop ? styles.imageDesktop : styles.imageMobile} />
        <View style={isDesktop ? styles.detailsContainerDesktop : styles.detailsContainerMobile}>
          <View style={isDesktop ? styles.rowDesktop : styles.rowMobile}>
            <Text style={isDesktop ? styles.brandDesktop : styles.brandMobile}>{brand}</Text>
            <Text style={isDesktop ? styles.priceDesktop : styles.priceMobile}>
              {price}/{t('MyReservationCard.day')}
            </Text>
          </View>
          <Text style={isDesktop ? styles.dateDesktop : styles.dateMobile}>
            {t('MyReservationCard.date')}: {date}
          </Text>
          <Text
            style={[
              isDesktop ? styles.statusDesktop : styles.statusMobile,
              status === 'Confirmada' ? styles.confirmed : styles.pending,
            ]}
          >
            {status}
          </Text>
          <TouchableOpacity
            style={isDesktop ? styles.buttonDesktop : styles.buttonMobile}
            onPress={(e) => {
              e.stopPropagation(); // Evita que onPress de la tarjeta también se ejecute
              onCancel();
            }}
          >
            <Text style={isDesktop ? styles.buttonTextDesktop : styles.buttonTextMobile}>
              {t('MyReservationCard.buttons.cancel')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
    dateDesktop: {
      fontSize: width * 0.014,
      color: "#555",
      marginVertical: 5,
      fontFamily: theme.fonts.regular,
      color: theme.lightTemplate.textColor,
    },
    dateMobile: {
      fontSize: 12,
      color: "#555",
      marginVertical: 5,
      fontFamily: theme.fonts.regular,
      color: theme.lightTemplate.textColor,
    },
    statusDesktop: {
      fontSize: width * 0.015,
      fontWeight: "bold",
      marginBottom: 10,
      fontFamily: theme.fonts.regular,
    },
    statusMobile: {
      fontSize: 14,
      fontWeight: "bold",
      alignSelf: "flex-end",
      fontFamily: theme.fonts.regular,
    },
    confirmed: {
      color: "green",
    },
    pending: {
      color: "red",
    },
    buttonDesktop: {
      backgroundColor: "#3b6ef5",
      paddingVertical: 8,
      borderRadius: 5,
      alignItems: "center",
      width: width * 0.17,
      marginTop: 9,
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
      fontSize: width * 0.014,
      fontFamily: theme.fonts.bold,
    },
    buttonTextMobile: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
      fontFamily: theme.fonts.bold,
    },
  });

export default ReservationCard;
