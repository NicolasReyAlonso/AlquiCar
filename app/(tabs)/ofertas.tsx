import React from "react";
import { View, ScrollView } from "react-native";
import VehicleCard from "@/components/templates/VehicleCard";
import theme from "@/components/Theme";
import { useRouter } from "expo-router";


const ofertas = () => {

  const router = useRouter();

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
      imageUrl: "https://a.ccdn.es/cnet/contents/media/honda/civic/1159931.jpg",
      type: "Sedán",
      mileage: "30,000 km",
      pickupLocation: "Barcelona, España",
      price: "€45/día",
    },
    {
      brand: "Ford Focus",
      seats: 5,
      type: "Compacto",
      imageUrl: "https://images.prismic.io/carwow/1e66c2e9-e6b7-4d21-be92-79e80403feaf_LHD+Ford+Focus+2022+Exterior-1.jpg?auto=format&cs=tinysrgb&fit=crop&q=60&w=750.jpg",
      mileage: "40,000 km",
      pickupLocation: "Valencia, España",
      price: "€35/día",
    },
    {
      brand: "BMW Serie 3",
      seats: 5,
      type: "Premium",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9KXga-3enJCVZRftu89iBe1LIyl0GYHvHMQ&s.jpg",
      mileage: "20,000 km",
      pickupLocation: "Sevilla, España",
      price: "€80/día",
    },
    {
      brand: "Audi A3",
      seats: 5,
      type: "Premium",
      imageUrl: "https://espirituracer.com/archivos/2020/12/audi-a3-sportback-45-tfsi-e-2021-1.jpg",

      mileage: "25,000 km",
      pickupLocation: "Bilbao, España",
      price: "€75/día",
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center", padding: 20, backgroundColor: theme.colors.background}}>
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
          onReserve={() => router.push({ pathname: "/reservarCoche" , params: vehicle })}
        />
      ))}
    </ScrollView>
  );
};

export default ofertas;
