import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

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
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{brand}</Text>
        <View style={styles.spacing} />
        <Text style={styles.details}>{seats} Plazas {type}</Text>
        <Text style={styles.details}>Kilometraje: {mileage}</Text>
        <View style={styles.spacing} />
        <Text style={styles.details}>Lugar de recogida: {pickupLocation}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
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
  infoContainer: {
    flex: 1,
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 12,
    color: "#333",
  },
  spacing: {
    height: 10,
  },
  rightContainer: {
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 60,
    backgroundColor: "#777",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#3b6ed5",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default VehicleCard;
