import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface MyReservationCardProps {
  brand: string;
  price: string;
  date: string;
  status: string;
  imageUrl?: string;
  onCancel: () => void;
}

const ReservationCard: React.FC<MyReservationCardProps> = ({
  brand,
  price,
  date,
  status,
  imageUrl,
  onCancel,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.brand}>{brand}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
        <Text style={styles.date}>Fecha: {date}</Text>
        <Text style={[styles.status, status === 'Confirmada' ? styles.confirmed : styles.pending]}>
          {status}
        </Text>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancelar Reserva</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d3d3d3",
    borderRadius: 8,
    padding: 10,
    width: 280,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 100,
    backgroundColor: "#777",
    borderRadius: 5,
  },
  detailsContainer: {
    width: "100%",
    paddingTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#333",
    marginVertical: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
  },
  confirmed: {
    color: "green",
  },
  pending: {
    color: "red",
  },
  button: {
    backgroundColor: "#3b6ef5",
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ReservationCard;
