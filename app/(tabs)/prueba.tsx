import React from "react";
import { View, ScrollView } from "react-native";
import VehicleCard from "@/components/templates/VehicleCard";

const Prueba = () => {
  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }}>
      <VehicleCard
        brand="Toyota"
        imageUrl="https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
        seats={5}
        type="Turismo"
        mileage="50,000 km"
        pickupLocation="Madrid, España"
        price="€40/día"
        onReserve={() => alert("Reserva realizada")}
      />
      <VehicleCard
        brand="Toyota"
        imageUrl="https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
        seats={5}
        type="Turismo"
        mileage="50,000 km"
        pickupLocation="Madrid, España"
        price="€40/día"
        onReserve={() => alert("Reserva realizada")}
      />
      <VehicleCard
        brand="Toyota"
        imageUrl="https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
        seats={5}
        type="Turismo"
        mileage="50,000 km"
        pickupLocation="Madrid, España"
        price="€40/día"
        onReserve={() => alert("Reserva realizada")}
      />
      <VehicleCard
        brand="Toyota"
        imageUrl="https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
        seats={5}
        type="Turismo"
        mileage="50,000 km"
        pickupLocation="Madrid, España"
        price="€40/día"
        onReserve={() => alert("Reserva realizada")}
      />
      <VehicleCard
        brand="Toyota"
        imageUrl="https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
        seats={5}
        type="Turismo"
        mileage="50,000 km"
        pickupLocation="Madrid, España"
        price="€40/día"
        onReserve={() => alert("Reserva realizada")}
      />
    </ScrollView>
  );
};

export default Prueba;
