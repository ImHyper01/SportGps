import React, { useRef, useState } from "react";
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

  // Verkrijg de huidige locatie
  let location = await Location.getCurrentPositionAsync({});
  const { latitude, longitude } = location.coords;

  // Verplaats de kaart naar de huidige locatie
  mapRef.current?.animateToRegion({
    latitude,
    longitude,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
};

const showLocationPrompt = () => {
  // Toon een pop-up met een vraag of ze hun locatie willen delen
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

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: 51.91972, // Stel een standaard locatie in
          longitude: 4.47778,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
        onMapReady={showLocationPrompt} // Toon de pop-up wanneer de kaart geladen is
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
