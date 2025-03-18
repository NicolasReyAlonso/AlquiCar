import React from "react";
import { View, ScrollView } from "react-native";
import VehicleCard from "@/components/templates/VehicleCard";
import MyReservationCard from "@/components/templates/MyReservationCard";
import MyPublishedVehicles from "@/components/templates/MyPublishedVehicles";

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
      <MyReservationCard
        brand="Toyota"
        price="€40/día"
        date="18/03/2025"
        status="Confirmada"
        imageUrl="https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
        onCancel={()=> alert("Reserva cancelada")}
      />
      <MyPublishedVehicles
        brand="Toyota"
        price="€40/día"
        city="Madrid"
        imageUrl="https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg"
        onCancel={()=> alert("Vehículo eliminado")}
      />
    </ScrollView>
  );
};

export default Prueba;
