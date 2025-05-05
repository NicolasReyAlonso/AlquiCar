import React, { useEffect, useState, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import VehicleCard from "@/components/templates/VehicleCard";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";

const ResultadosFiltrados = () => {
  const { filters: initialFilters } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();

  // Estado para los filtros
  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    transmission: "",
    fuel_type: "",
    minPrice: 0,
    maxPrice: 500,
  });

  // Estado para los resultados y carga
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [allVehicles, setAllVehicles] = useState([]);

  // Parsear los filtros iniciales
  useEffect(() => {
    if (initialFilters) {
      try {
        const parsed = typeof initialFilters === "string" ? JSON.parse(initialFilters) : {};
        setFilters(prev => ({
          ...prev,
          ...parsed,
          minPrice: parsed.minPrice || 0,
          maxPrice: parsed.maxPrice || 500
        }));
      } catch (error) {
        console.error("Error parsing filters:", error);
      }
    }
  }, [initialFilters]);

  // Obtener todos los vehículos al montar el componente
  useEffect(() => {
    const fetchAllVehicles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/vehicles`);
        const data = await response.json();

        const vehiclesWithImages = await Promise.all(
          data.map(async (vehicle) => {
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

        setAllVehicles(vehiclesWithImages);
        
        // Calcular precio máximo para el slider
        const maxVehiclePrice = Math.max(...data.map(v => parseFloat(v.daily_price) || 0));
        setFilters(prev => ({
          ...prev,
          maxPrice: Math.max(prev.maxPrice, maxVehiclePrice)
        }));
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVehicles();
  }, []);

  // Aplicar filtros cuando cambian
// Aplicar filtros cuando cambian
useEffect(() => {
  if (allVehicles.length === 0) return;

  const results = allVehicles.filter((vehicle) => {
    const price = parseFloat(vehicle.daily_price) || 0;
    
    // Verificar si el vehículo coincide con todos los filtros aplicados
    const matchesBrand = !filters.brand || 
      (vehicle.brand && vehicle.brand.toLowerCase() === filters.brand.toLowerCase());
    
    const matchesType = !filters.type || 
      (vehicle.type && vehicle.type.toLowerCase() === filters.type.toLowerCase());
    
    const matchesTransmission = !filters.transmission || 
      (vehicle.transmission && vehicle.transmission.toLowerCase() === filters.transmission.toLowerCase());
    
    const matchesFuelType = !filters.fuel_type || 
      (vehicle.fuel_type && vehicle.fuel_type.toLowerCase() === filters.fuel_type.toLowerCase());
    
    const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;

    return matchesBrand && matchesType && matchesTransmission && matchesFuelType && matchesPrice;
  });

  console.log("Vehículos filtrados:", results); // Para depuración
  setFilteredResults(results);
}, [filters, allVehicles]);

  // Restablecer todos los filtros
  const resetFilters = () => {
    setFilters({
      brand: "",
      type: "",
      transmission: "",
      fuel_type: "",
      minPrice: 0,
      maxPrice: Math.max(...allVehicles.map(v => parseFloat(v.daily_price) || 500)),
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4472C4" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>


      {/* Panel de filtros */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterTitle}>{t("ResultadosFiltrados.filtersTitle")}</Text>
          
          {/* Filtro por marca */}
          <Text style={styles.filterLabel}>{t("ResultadosFiltrados.brand")}</Text>
          <Picker
            selectedValue={filters.brand}
            onValueChange={(value) => setFilters({...filters, brand: value})}
            style={styles.picker}
          >
            <Picker.Item label={t("ResultadosFiltrados.allBrands")} value="" />
            <Picker.Item label="Toyota" value="Toyota" />
            <Picker.Item label="Hyundai" value="Hyundai" />
            <Picker.Item label="BMW" value="BMW" />
            <Picker.Item label="Audi" value="Audi" />
          </Picker>

          {/* Filtro por tipo */}
          <Text style={styles.filterLabel}>{t("ResultadosFiltrados.type")}</Text>
          <Picker
            selectedValue={filters.type}
            onValueChange={(value) => setFilters({...filters, type: value})}
            style={styles.picker}
          >
            <Picker.Item label={t("ResultadosFiltrados.allTypes")} value="" />
            <Picker.Item label="SUV" value="SUV" />
            <Picker.Item label="Sedán" value="Sedan" />
            <Picker.Item label="Deportivo" value="Sports" />
            <Picker.Item label="Truck" value="Truck" />
          </Picker>

          {/* Filtro por transmisión */}
          <Text style={styles.filterLabel}>{t("ResultadosFiltrados.transmission")}</Text>
          <Picker
            selectedValue={filters.transmission}
            onValueChange={(value) => setFilters({...filters, transmission: value})}
            style={styles.picker}
          >
            <Picker.Item label={t("ResultadosFiltrados.allTransmissions")} value="" />
            <Picker.Item label={t("ResultadosFiltrados.automatic")} value="Automatic" />
            <Picker.Item label={t("ResultadosFiltrados.manual")} value="Manual" />
          </Picker>

          {/* Filtro por rango de precios */}
          <Text style={styles.filterLabel}>
            {t("ResultadosFiltrados.priceRange")}: €{filters.minPrice} - €{filters.maxPrice}
          </Text>
          <View style={styles.sliderContainer}>
            <Text>€{filters.minPrice}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={filters.maxPrice}
              minimumTrackTintColor="#4472C4"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#4472C4"
              value={filters.maxPrice}
              onValueChange={(value) => setFilters({...filters, maxPrice: value})}
            />
            <Text>€{filters.maxPrice}</Text>
          </View>
        </View>
      )}

      {/* Resultados */}
      <ScrollView style={styles.resultsContainer}>
      <Text style={styles.resultsCount}>
          {filteredResults.length === 1 
            ? "Se encontró 1 vehículo disponible" 
            : `Se encontraron ${filteredResults.length} vehículos disponibles`}
        </Text>

        
        {filteredResults.length === 0 ? (
          <Text style={styles.noResults}>No se encontraron vehículos disponibles para los filtros seleccionados.</Text>
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
              deposit={`€${result.deposit}`}
              mileage={result.mileage || "N/A"}
              pickupLocation={result.pickup_location || "N/A"}
              vehicleId={result.id}
              price={`€${result.daily_price}`}
              imageUrl={result.imageUrl || "http://via.placeholder.com/150"}
              onReserve={() => router.push(`/reservarCoche?id=${result.id}`)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#4472C4",
  },
  filterButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  filterButtonText: {
    color: "#4472C4",
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filtersPanel: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#555",
  },
  picker: {
    height: 50,
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  resultsContainer: {
    flex: 1,
    padding: 15,
  },
  resultsCount: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  noResults: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 50,
  },
});

export default ResultadosFiltrados;