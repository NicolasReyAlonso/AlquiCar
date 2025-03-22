import React from "react";
import { View, ScrollView } from "react-native";
import VehicleCard from "@/components/templates/VehicleCard";

const ofertas = () => {
  // Datos para las tarjetas con URLs reales de Google
  const vehicleData = [
    {
      brand: "Toyota Corolla",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg",
      seats: 5,
      type: "Turismo",
      mileage: "50,000 km",
      pickupLocation: "Madrid, España",
      price: "€40/día",
    },
    {
      brand: "Honda Civic",
      seats: 5,
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg",
      type: "Sedán",
      mileage: "30,000 km",
      pickupLocation: "Barcelona, España",
      price: "€45/día",
    },
    {
      brand: "Ford Focus",
      seats: 5,
      type: "Compacto",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg",
      mileage: "40,000 km",
      pickupLocation: "Valencia, España",
      price: "€35/día",
    },
    {
      brand: "BMW Serie 3",
      seats: 5,
      type: "Premium",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg",

      mileage: "20,000 km",
      pickupLocation: "Sevilla, España",
      price: "€80/día",
    },
    {
      brand: "Audi A3",
      seats: 5,
      type: "Premium",
      imageUrl: "https://cdn-datak.motork.net/configurator-imgs/cars/es/original/TOYOTA/COROLLA/41516_HATCHBACK-5-DOORS/toyota-corolla-front-view.jpg",

      mileage: "25,000 km",
      pickupLocation: "Bilbao, España",
      price: "€75/día",
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20 }}>
      {/* Renderizado dinámico de las tarjetas */}
      {vehicleData.map((vehicle, index) => (
        <VehicleCard
          key={index}
          brand={vehicle.brand}
          imageUrl={vehicle.imageUrl}
          seats={vehicle.seats}
          type={vehicle.type}
          mileage={vehicle.mileage}
          pickupLocation={vehicle.pickupLocation}
          price={vehicle.price}
          onReserve={() => alert(`Reserva realizada para ${vehicle.brand}`)}
        />
      ))}
    </ScrollView>
  );
};

export default ofertas;
