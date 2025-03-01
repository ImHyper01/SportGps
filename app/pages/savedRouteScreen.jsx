import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { getRoutes, deleteRoute } from "../database/database";
import MapView, { Polyline } from "react-native-maps";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  //hier fetch ik de routes uit de database
  const fetchRoutes = async () => {
    const routes = await getRoutes();
    setSavedRoutes(routes);
  };

  useFocusEffect(
    useCallback(() => {
      fetchRoutes();
    }, [])
  );
  //functie geschreven om de route te verwijders uit de database.
  const handleDeleteRoute = async (routeId) => {
    console.log(`Probeer route te verwijderen met ID: ${routeId}`);

    if (!routeId) {
      console.error("Geen geldig route ID ontvangen!");
      return;
    }
    //hier geef ik input als je de route verwijderd
    await deleteRoute(routeId);
    console.log("Route succesvol verwijderd uit database!");

    // Herlaad routes na verwijderen
    fetchRoutes();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedRoutes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.routeItem} 
            onPress={() => setSelectedRoute(item)} 
          >
            <Text style={styles.routeText}>Route {item.id}</Text>
            <MapView
              style={styles.miniMap}
              initialRegion={{
                latitude: item.data[0]?.latitude || 51.91972,
                longitude: item.data[0]?.longitude || 4.47778,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Polyline coordinates={item.data} strokeWidth={2} strokeColor="blue" />
            </MapView>

            <TouchableOpacity onPress={() => handleDeleteRoute(item.id)}>
              <MaterialCommunityIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {selectedRoute && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Geselecteerde Route</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedRoute.data[0]?.latitude || 51.91972,
              longitude: selectedRoute.data[0]?.longitude || 4.47778,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Polyline coordinates={selectedRoute.data} strokeWidth={5} strokeColor="red" />
          </MapView>
        
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => handleDeleteRoute(selectedRoute.id)}>
              <Text style={styles.trashIcon}> Verwijderen </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => setSelectedRoute(null)}>
              <Text style={styles.backButtonText}>Terug naar lijst</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  routeItem: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  miniMap: {
    width: "100%",
    height: 150,
    marginTop: 5,
  },
  detailContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  detailText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: 300,
  },
  backButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: '40%',
  },
  trashIcon: {
    color: "#fff",
    fontSize: 16,
    width: '80%',
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
  }
});
