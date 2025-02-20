import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from "react-native";
import { getRoutes } from "../database/database";
import MapView, { Polyline } from "react-native-maps";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HistoryScreen() {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const routes = await getRoutes();
    setSavedRoutes(routes);
  };

  const handleDeleteRoute = async (routeToDelete) => {
    const updatedRoutes = savedRoutes.filter(route => route !== routeToDelete);
    setSavedRoutes(updatedRoutes);
    await deleteRoute(routeToDelete);
  };

//   const handleDeleteRoute = async (index) => {
//     await handleDeleteRoute(index);
//     fetchRoutes();
//   };


  return (
    <View style={styles.container}>
      
      <FlatList
        data={savedRoutes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.routeItem} 
            onPress={() => setSelectedRoute(item)} 
          >
            <Text style={styles.routeText}>Route {index + 1}</Text>
            <MapView
              style={styles.miniMap}
              initialRegion={{
                latitude: item[0]?.latitude || 51.91972,
                longitude: item[0]?.longitude || 4.47778,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Polyline coordinates={item} strokeWidth={2} strokeColor="blue" />
            </MapView>
          </TouchableOpacity>
        )}
      />

      
      {selectedRoute && (
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Geselecteerde Route</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedRoute[0]?.latitude || 51.91972,
              longitude: selectedRoute[0]?.longitude || 4.47778,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Polyline coordinates={selectedRoute} strokeWidth={5} strokeColor="red" />
          </MapView>

          <TouchableOpacity onPress={() => handleDeleteRoute(item)}>
            <MaterialCommunityIcons name="delete" size={24} color="red" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedRoute(null)}>
            <Text style={styles.backButtonText}>Terug naar lijst </Text>
          </TouchableOpacity>
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
    });
