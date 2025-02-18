import React, { useEffect, useRef, useState } from "react";
import { Alert, Text, View, StyleSheet, Button } from "react-native";
import MapView , { Polyline } from "react-native-maps";
import * as Location from 'expo-location';
import { savedRoute, setupDatabase } from '../database/database';

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null); 
  const [route, setRoute] = useState([]);
  const [tracking, setTracking] = useState(false);
  let locationSubscription = useRef(null);


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

      setCurrentLocation({ latitude, longitude });
  };

  const startLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if ( status !== 'granted' ) {
      console.log('Permission denied');
      return;
    }

    locationSubscription.current = await location,Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 3,
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        setRoute((prevRoute) => [...prevRoute, { latitude, longitude }]);
        setCurrentLocation({ latitude, longitude });

        mapRef.current?.animateToRegion({
          latitude,
          longitude, 
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });
      }
    );
    setTracking(true);
  };

  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setTracking(false);
  };

  const handleSaveRoute = () => {
    if (route.lenght === 0 ) return;
    savedRoute(route);
    Alert.alert('Succes, Route is opgeslagen');
    setRoute([]);
  };

  useEffect(() => {
    setupDatabase();
  }, []);

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
      >
        {route.length > 0 && <Polyline coordinates={route} strokeWidth={5} strokeColor="blue" />}
      </MapView>

      <View style={styles.buttons}>
        <Button title={tracking ? 'stop': 'start'} onPress={tracking ? stopLocationTracking : startLocationTracking} />
        <Button title='Opslaan' onPress={handleSaveRoute} disabled={route.length === 0} />
      </View>
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
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
