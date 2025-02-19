import React, { useEffect, useRef, useState } from "react";
import { Alert, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { setupDatabase, saveRoute, getRoutes } from "../database/database";

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [route, setRoute] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const mapRef = useRef(null);
  let locationSubscription = useRef(null);

  useEffect(() => {
    const initDB = async () => {
      await setupDatabase();
      const routes = await getRoutes();
      setSavedRoutes(routes);
    };
    initDB();
  }, []);

  const goToCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });

    setCurrentLocation({ latitude, longitude });
  };

  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission denied");
      return;
    }

    setRoute([]); 
    setTracking(true);

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        const { latitude, longitude } = location.coords;

        mapRef.current?.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });

        setRoute((prevRoute) => [...prevRoute, { latitude, longitude }]);
      }
    );
  };

  const stopTracking = async () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    setTracking(false);

    if (route.length > 0) {
      await saveRoute(route);
      console.log("Route saved!");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: 51.91972,
          longitude: 4.47778,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={5} strokeColor="blue" />}
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={goToCurrentLocation}>
          <Text style={styles.buttonText}>Ga naar locatie</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, tracking ? styles.buttonStop : styles.buttonStart]} onPress={tracking ? stopTracking : startTracking}>
          <Text style={styles.buttonText}>{tracking ? "Stop tracking" : "Start tracking"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "80%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonStart: {
    backgroundColor: "green",
  },
  buttonStop: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
