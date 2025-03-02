import React, { useEffect, useRef, useState } from "react";
import { Alert, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Polyline, Circle } from "react-native-maps";
import * as Location from "expo-location";
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { setupDatabase, saveRoute, getRoutes } from "../database/database";

const GEOFENCE_TASK = 'geofence-task';

TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.log('Geofence error:', error);
    return;
  }

  if (!data || !data.eventType || !data.region) {
    console.log('Geofence data ontbreekt.');
    return;
  }

  const { eventType, region } = data;

  let message = "";
  if (eventType === Location.GeofencingEventType.Enter) {
    message = `Je bent bij ${region.identifier} aangekomen!`;
  } else if (eventType === Location.GeofencingEventType.Exit) {
    message = `Je hebt ${region.identifier} verlaten!`;
  }

  if (message) {
    // Pop-up alert in plaats van notificatie
    Alert.alert(
      'Locatie update',
      message,
      [{ text: 'OK' }]
    );
  }
});

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [route, setRoute] = useState([]);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const mapRef = useRef(null);
  let locationSubscription = useRef(null);
  const [locatie, setLocatie] = useState([]);
  const [loading, setLoading] = useState(true);

//hier fetch json data van de stud hosted server en die laad ik vervolgens in
  const getLocatie = async () => {
    try {
      const response = await fetch('https://stud.hosted.hr.nl/1027469/locations.json');
      const json = await response.json();
      setLocatie(json.locations);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      getLocatie();
    }, []);


  useEffect(() => {
    const initDB = async () => {
      await setupDatabase();
      const routes = await getRoutes();
      setSavedRoutes(routes);
    };
    initDB();
    requestNotificationPermissions();
    getCurrentLocation();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.log('Notificatiepermissie geweigerd');
        return;
      }
    }
  };  

//hier vraag ik de gebruiker voor de exacte locatie, als die accepteer gaat die naar de locatie toe, anders  niet.
  const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('locatiepremissie denied');
    return;
  } 
  let location = await Location.getCurrentPositionAsync({});
  setCurrentLocation({
    latitude: location.coords.latitude, 
    longitude: location.coords.longitude
  });

  // Herstart geofencing na locatie-update
  setupGeofencing();
};

const setupGeofencing = async () => {
  let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  if (backgroundStatus !== 'granted') {
    console.log('Background locatiepermissie geweigerd');
    return;
  }

  if (!locatie || locatie.length === 0) {
    console.log('Geen locaties gevonden.');
    return;
  }

  const geofences = locatie.map(loc => ({
    identifier: loc.name,
    latitude: loc.latitude,
    longitude: loc.longitude,
    radius: 100,
    notifyOnEnter: true,
    notifyOnExit: true,
  }));

  console.log("Ingestelde geofences:", geofences); // Debugging

  await Location.startGeofencingAsync(GEOFENCE_TASK, geofences);
  console.log('Geofencing gestart!');
};

  useEffect(() => {
  if (locatie.length > 0) {
    console.log("Locaties ingeladen, starten met geofencing:", locatie);
    setupGeofencing();
  }
}, [locatie]);

  //functie geschreven die naar de exacte locatie gaat
  const goToCurrentLocation = async () => {
    if(currentLocation) {
      mapRef.current?.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    }
  }; 

  //hier heb ik heb een functie geschreven die als ik op de button start tracking doet, dat die dan mijn locatie tracked.
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
//Als ik op stop tracking drukt, dan stopt de tracking door deze functie
  const stopTracking = async () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    setTracking(false);
//hier saved ik de route, en die wordt naar de database gestuurd.
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
          latitude: currentLocation?.latitude || 51.91972,
          longitude: currentLocation?.longitude || 4.47778,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={5} strokeColor="blue" />}
        {locatie.map((loc, index) => (
          <Circle
            key={index}
            center={{ latitude: loc.latitude, longitude: loc.longitude }}
            radius={100} // Straal van 200 meter
            strokeColor="rgba(0, 0, 255, 0.8)" // Blauwe rand
            fillColor="rgba(0, 0, 255, 0.2)" // Lichtblauwe vulling
          />
        ))}
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
//styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "90%",
    marginBottom: '25%',
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
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
