import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getRoutes } from "../database/database";

export default function HistoryScreen() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const savedRoutes = await getRoutes();
      setRoutes(savedRoutes);
    };

    fetchRoutes();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opgeslagen Routes</Text>
      <FlatList
        data={routes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.routeItem}>
            <Text>Route {item.length} punten</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  routeItem: {
    padding: 10,
    backgroundColor: "#eee",
    marginVertical: 5,
    borderRadius: 5,
  },
});
