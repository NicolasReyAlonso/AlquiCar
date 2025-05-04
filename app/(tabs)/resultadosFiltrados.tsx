import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from 'react-i18next';


const ResultadosFiltrados = () => {
  const { filters } = useLocalSearchParams(); // Recibe los filtros como parámetros
  const { t } = useTranslation();

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

        console.log("Resultados filtrados:", results); // Verifica los resultados filtrados
        setFilteredResults(results);
      } catch (error) {
        console.error("Error al obtener los resultados filtrados:", error);
      }
    };

    fetchFilteredResults();
  }, [parsedFilters]); // Solo se ejecuta cuando `parsedFilters` cambia

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('ResultadosFiltrados.title')}</Text>
      {filteredResults.length === 0 ? (
        <Text style={styles.noResults}>{t('ResultadosFiltrados.notFound')}</Text>
      ) : (
        filteredResults.map((result) => (
          <View key={result.id} style={styles.resultCard}>
            <Text style={styles.resultText}>{result.brand} - {result.model}</Text>
            <Text style={styles.resultText}>{t('ResultadosFiltrados.type')}: {result.type}</Text>
            <Text style={styles.resultText}>{t('ResultadosFiltrados.price')}: €{result.daily_price}</Text>
          </View>
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
  resultCard: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ResultadosFiltrados;