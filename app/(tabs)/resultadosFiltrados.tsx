import React, { useEffect, useState, useMemo } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import VehicleCard from "@/components/templates/VehicleCard"; // Importa el componente VehicleCard

const ResultadosFiltrados = () => {
  const { filters } = useLocalSearchParams(); // Recibe los filtros como parámetros
  const { t } = useTranslation();
  const router = useRouter(); // Para navegar a la pantalla de detalles

  // Memoriza los filtros para evitar bucles infinitos
  const parsedFilters = useMemo(() => {
    return typeof filters === "string" ? JSON.parse(filters) : filters || {};
  }, [filters]);

  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    console.log("Filtros procesados en useEffect:", parsedFilters); // Verifica los filtros procesados

    const fetchFilteredResults = async () => {
      try {
        const response = await fetch(`http://localhost:3000/vehicles`);
        const vehicles = await response.json();
        console.log("Datos recibidos del backend:", vehicles); // Verifica los datos del backend

        // Aplica los filtros localmente
        const results = vehicles.filter((vehicle) => {
          const matchesBrand = !parsedFilters.brand || vehicle.brand.toLowerCase() === parsedFilters.brand.toLowerCase();
          const matchesType = !parsedFilters.type || vehicle.type.toLowerCase() === parsedFilters.type.toLowerCase();

          return matchesBrand && matchesType; // Ambas condiciones deben cumplirse
        });
        
        const resultsWithImages = await Promise.all(
          results.map(async (vehicle) => {
            let imageUrl = "http://via.placeholder.com/150";
            try {
              const imgRes = await fetch(`http://localhost:3000/media/vehicles/${vehicle.owner_id}/${vehicle.id}`);
              const images = await imgRes.json();
              if (images.length > 0 && images[0].data) {
                imageUrl = images[0].data;
              }
            } catch (imgError) {
              console.warn(`No se pudo cargar la imagen del vehículo ${vehicle.id}`, imgError);
            }
            return { ...vehicle, imageUrl };
          })
        );

        setFilteredResults(resultsWithImages);
      } catch (error) {
        console.error("Error al obtener los resultados filtrados:", error);
      }
    };

    fetchFilteredResults();
  }, [parsedFilters]); // Solo se ejecuta cuando `parsedFilters` cambia

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t("ResultadosFiltrados.title")}</Text>
      {filteredResults.length === 0 ? (
        <Text style={styles.noResults}>{t("ResultadosFiltrados.notFound")}</Text>
      ) : (
        filteredResults.map((result) => (
          <VehicleCard
            key={result.id}
            brand={result.brand}
            model={result.model}
            year={result.year}
            seats={result.capacity}
            type={result.type}
            transmission={result.transmission}
            fuelType={result.fuel_type}
            numDoors={result.num_doors}
            deposit={result.deposit}
            mileage={result.mileage || "N/A"}
            pickupLocation={result.pickup_location || "N/A"}
            vehicleId={result.id}
            price={`${result.daily_price}€`}
            imageUrl={result.imageUrl || "http://via.placeholder.com/150"}
            onReserve={() => console.log("Reserva para el vehículo con ID:", result.id)}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  noResults: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ResultadosFiltrados;