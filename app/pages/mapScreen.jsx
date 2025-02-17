import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, View, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import * as Location from 'expo-location';

const mapRef = useRef(null);

const goToCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission denied');
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
};

const showLocationPrompt = () => {
  Alert.alert(
    "Locatie delen",
    "Wil je je huidige locatie delen en naar de kaart gaan?",
    [
      {
        text: "Nee",
        onPress: () => console.log("User declined"),
        style: "cancel",
      },
      {
        text: "Ja",
        onPress: goToCurrentLocation,
      },
    ],
    { cancelable: false }
  );
};

const startLocationTracking = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('premission denied');
        return;
    }

    Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
        },
        (Location) => {
            const { latitude, longitude } = location.coords;

            mapRef.current?.animateToRegion({
                latitude,
                longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            });

            setCurrentLopcation(location.coords);
        }
    );
};

export default function MapScreen() {
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        showLocationPrompt();
    }, []);

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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  }
});
