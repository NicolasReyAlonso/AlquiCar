import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from "expo-router";
import { DatePickerModal } from 'react-native-paper-dates';

export default function DetallesReserva() {
  const { id } = useLocalSearchParams();
  const [reservation, setReservation] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [owner, setOwner] = useState(null); 
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [pickupDatePickerVisible, setPickupDatePickerVisible] = useState(false);
  const [returnDatePickerVisible, setReturnDatePickerVisible] = useState(false);
  const [changedStatus, setChangedStatus] = useState(false);

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const reservationResponse = await fetch(`http://localhost:3000/reservations/${id}`);
        const reservationData = await reservationResponse.json();

        const reservation = Array.isArray(reservationData) ? reservationData[0] : reservationData;
        setReservation(reservation);

        if (reservation) {
          setStartDate(reservation.start_date);
          setEndDate(reservation.end_date);
          setTotalPrice(reservation.total_price.toString());
        }

        if (reservation && reservation.vehicle_id) {
          const vehicleResponse = await fetch(`http://localhost:3000/vehicles/${reservation.vehicle_id}`);
          const vehicleData = await vehicleResponse.json();

          const vehicle = Array.isArray(vehicleData) ? vehicleData[0] : vehicleData;
          setVehicle(vehicle);

          // Propietario del coche
          if (vehicle && vehicle.owner_id) {
            const ownerResponse = await fetch(`http://localhost:3000/users/${vehicle.owner_id}`, {
              method: 'GET',
              credentials: 'include',
            });
          
            if (!ownerResponse.ok) {
              throw new Error(`Error al obtener el propietario: ${ownerResponse.status}`);
            }
          
            const ownerData = await ownerResponse.json();
            const owner = Array.isArray(ownerData) ? ownerData[0] : ownerData; 
            setOwner(owner);
          }
        } else {
          console.error("El campo 'vehicle_id' está undefined en la reserva cargada:", reservation);
        }
      } catch (error) {
        console.error("Error al cargar los detalles de la reserva o del vehículo:", error);
      }
    };

    if (id) {
      fetchReservationDetails();
    }
  }, [id]);

  const handleCancelReservation = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "Cancelled" }),
      });
  
      if (response.ok) {
        const updatedReservation = await response.json();
        setReservation({ ...reservation, status: "Cancelled" });
        setChangedStatus(true);
        alert("Reserva cancelada correctamente");
      } else {
        const errorData = await response.json();
        console.error("Error en la respuesta del backend:", errorData);
        alert("Error al cancelar la reserva");
      }
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      alert("Hubo un problema al cancelar la reserva.");
    }
  };

const handleUpdateReservation = async () => {
  try {
    const response = await fetch(`http://localhost:3000/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        start_date: new Date(startDate).toISOString(), 
        end_date: new Date(endDate).toISOString(),
        total_price: parseFloat(totalPrice),
      }),
    });

    if (response.ok) {
      const updatedReservation = await response.json();
      setReservation(updatedReservation);
      setIsEditing(false); 
      alert("Reserva actualizada correctamente");
    } else {
      const errorData = await response.json();
      console.error("Error en la respuesta del backend:", errorData);
      alert("Error al actualizar la reserva");
    }
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    alert("Hubo un problema al actualizar la reserva.");
  }
};

  const calcularPrecio = (start, end) => {
    if (!vehicle || !start || !end) return;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate.getTime() - startDate.getTime();
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const price = days * vehicle.daily_price;
    setTotalPrice(price.toString());
  };

  const onPickupDateConfirm = (params) => {
    if (params.date) {
      setStartDate(params.date.toISOString());
      calcularPrecio(params.date.toISOString(), endDate);
    }
    setPickupDatePickerVisible(false);
  };

  const onReturnDateConfirm = (params) => {
    if (params.date) {
      setEndDate(params.date.toISOString());
      calcularPrecio(startDate, params.date.toISOString());
    }
    setReturnDatePickerVisible(false);
  };

  if (!reservation || !vehicle) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          {reservation && !vehicle ? "No se pudieron cargar los datos del vehículo." : "Cargando detalles de la reserva..."}
        </Text>
      </View>
    );
  }

  const statusBackgroundColor = reservation.status === "Cancelled" ? "#F2DEDE" : "#DFF0D8";
  const statusTextColor = reservation.status === "Cancelled" ? "#A94442" : "#3C763D";

  return (
    <ScrollView style={styles.container}>
      {/* Imagen principal */}
      <Image source={{ uri: vehicle.imageUrl || "http://via.placeholder.com/150" }} style={styles.mainImage} />
      <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
      <Text style={styles.subtitle}>{vehicle.year}</Text>
  
      {/* Estado de la reserva */}
      <View style={styles.detailsContainer}>
        <View style={[styles.statusContainer, { backgroundColor: statusBackgroundColor }]}>
          <Text style={[styles.statusText, { color: statusTextColor }]}>
            {reservation.status === "Cancelled" ? "Cancelada" : "Activa"}
          </Text>
        </View>
  
        {isEditing ? (
          <>
            <Text style={styles.sectionTitle}>Editar Reserva:</Text>
            <TouchableOpacity onPress={() => setPickupDatePickerVisible(true)}>
              <Text style={styles.detailText}>Fecha de inicio: {new Date(startDate).toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DatePickerModal
              locale="es"
              mode="single"
              visible={pickupDatePickerVisible}
              onDismiss={() => setPickupDatePickerVisible(false)}
              date={new Date(startDate)}
              onConfirm={onPickupDateConfirm}
            />
            <TouchableOpacity onPress={() => setReturnDatePickerVisible(true)}>
              <Text style={styles.detailText}>Fecha de fin: {new Date(endDate).toLocaleDateString()}</Text>
            </TouchableOpacity>
            <DatePickerModal
              locale="es"
              mode="single"
              visible={returnDatePickerVisible}
              onDismiss={() => setReturnDatePickerVisible(false)}
              date={new Date(endDate)}
              onConfirm={onReturnDateConfirm}
            />
            <Text style={styles.detailText}>Precio Total: €{totalPrice}</Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateReservation}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Detalles de la Reserva:</Text>
            <Text style={styles.detailText}>
              Fechas: {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
            </Text>
            <Text style={styles.detailText}>Precio Total: €{reservation.total_price}</Text>
            {reservation.status !== "Cancelled" && (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>Editar Reserva</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
  
      {/* Detalles del vehículo */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Detalles del Vehículo:</Text>
        <Text style={styles.detailText}>Capacidad: {vehicle.capacity} pasajeros</Text>
        <Text style={styles.detailText}>Tipo: {vehicle.type}</Text>
        <Text style={styles.detailText}>Transmisión: {vehicle.transmission}</Text>
        <Text style={styles.detailText}>Combustible: {vehicle.fuel_type}</Text>
        <Text style={styles.detailText}>Número de Puertas: {vehicle.num_doors}</Text>
        <Text style={styles.detailText}>Depósito: €{vehicle.deposit}</Text>
        <Text style={styles.detailText}>Precio por Día: €{vehicle.daily_price}</Text>
      </View>
  
      {/* Datos personales del propietario */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Propietario del Vehículo:</Text>
        {owner ? (
          <>
            <Text style={styles.detailText}>Nombre: {owner.name}</Text>
            <Text style={styles.detailText}>Email: {owner.email}</Text>
            <Text style={styles.detailText}>Teléfono: {owner.phone}</Text>
          </>
        ) : (
          <Text style={styles.detailText}>No se pudo cargar la información del propietario.</Text>
        )}
      </View>
  
      {/* Botón para cancelar la reserva */}
      {reservation.status !== "Cancelled" && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReservation}>
          <Text style={styles.cancelButtonText}>Cancelar Reserva</Text>
        </TouchableOpacity>
      )}
  
      {/* Botón para volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
        
          changedStatus ? router.push({pathname:"/misReservas", params: { id: reservation.id, status: reservation.status}}) : router.push("/misReservas")
        
        }} // Navegar a MisReservas
      >
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  mainImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  statusContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#3B6ED5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "gray",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#3B6ED5",
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});