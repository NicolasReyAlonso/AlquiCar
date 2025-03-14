import React from "react";
import { View, ScrollView } from "react-native";
import CarCard from "@/components/templates/CarCard";

const Prueba = () => {
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }}>
      <CarCard
        brand="Toyota"
        seats={5}
        type="Sedán"
        mileage="50,000 km"
        location="Madrid, España"
        price="€40/día"
        onReserve={() => alert("Reserva realizada")}
      />
    </ScrollView>
  );
};

export default Prueba;
