import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import * as Location from 'expo-location';

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null); // ✅ useRef binnen de component

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
          "Wil je je huidige locatie delen?",
          [
              { text: "Nee", 
              onPress: () => console.log("User declined"), 
              style: "cancel" },

              { text: "Ja", 
              onPress: goToCurrentLocation }
          ],

          { cancelable: false }
      );
  };

  const startLocationTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
          console.log('Permission denied');
          return;
      }

      await Location.watchPositionAsync(
          {
              accuracy: Location.Accuracy.High,
              timeInterval: 1000,
              distanceInterval: 1,
          },
          (location) => {  // ✅ Correcte parameternaam
              const { latitude, longitude } = location.coords;

              mapRef.current?.animateToRegion({
                  latitude,
                  longitude,
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
              });

              setCurrentLocation(location.coords); // ✅ Correcte state-update
          }
      );
  };

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
    alignContent: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: 550,
    marginBottom: '40%',
  }
});
