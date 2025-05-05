import React, { useEffect, useState, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native"; // Añadido View y ActivityIndicator
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import VehicleCard from "@/components/templates/VehicleCard";

const ResultadosFiltrados = () => {
  const { filters } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();

  const parsedFilters = useMemo(() => {
    try {
      return typeof filters === "string" ? JSON.parse(filters) : {};
    } catch (error) {
      console.error("Error parsing filters:", error);
      return {};
    }
  }, [filters]);

  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/vehicles`);
        const vehicles = await response.json();

        const results = vehicles.filter((vehicle) => {
          const matchesBrand = !parsedFilters.brand || 
            vehicle.brand?.toLowerCase() === parsedFilters.brand.toLowerCase();
          
          const matchesType = !parsedFilters.type || 
            vehicle.type?.toLowerCase() === parsedFilters.type.toLowerCase();
          
          const matchesTransmission = !parsedFilters.transmission || 
            vehicle.transmission?.toLowerCase() === parsedFilters.transmission.toLowerCase();
          
          const matchesFuelType = !parsedFilters.fuel_type || 
            vehicle.fuel_type?.toLowerCase() === parsedFilters.fuel_type.toLowerCase();

          return matchesBrand && matchesType && matchesTransmission && matchesFuelType;
        });

        setFilteredResults(results);
      } catch (error) {
        console.error("Error al obtener los resultados filtrados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredResults();
  }, [parsedFilters]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4472C4" />
      </View>
    );
  }

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
            onReserve={() => router.push(`/reservarCoche?id=${result.id}`)}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default ResultadosFiltrados