import React, {useEffect, useState }  from "react";
import { View, Text, FlatList, Button } from "react-native";
import { getRoutes } from '../database/database';

export default function saveRouteScreen() {
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        getRoutes(setRoutes);
    }, []);

    return(
        <View>
            <FlatList 
                data={routes}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>Route met {item.length}</Text>
                    </View>
                )}
            />
        </View>
    );
}