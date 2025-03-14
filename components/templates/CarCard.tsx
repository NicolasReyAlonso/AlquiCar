import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface CarCardProps {
  brand: string;
  seats: number;
  type: string;
  mileage: string;
  location: string;
  price: string;
  imageUrl?: string;
  onReserve: () => void;
}

const CarCard: React.FC<CarCardProps> = ({
  brand,
  seats,
  type,
  mileage,
  location,
  price,
  imageUrl,
  onReserve,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.brand}>{brand}</Text>
      <View style={styles.row}>
        <Text>{seats} Plazas</Text>
        <Text>{type}</Text>
      </View>
      <Text>Kilometraje: {mileage}</Text>
      <Text>Lugar de recogida: {location}</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.price}>{price}</Text>
        <TouchableOpacity style={styles.button} onPress={onReserve}>
          <Text style={styles.buttonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d3d3d3",
    padding: 15,
    borderRadius: 10,
    width: 300,
  },
  brand: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3b6ef5",
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CarCard;