import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import MapScreen from '../pages/mapScreen';
import SettingScreen from '../pages/settingScreen';
import saveRouteScreen from "../pages/savedRouteScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//bottom tab navigator gecreert, hier doe ik de routes bepalen van de bottom navigators.
const Tab = createBottomTabNavigator();

export default function tabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabLabel,  
        tabBarStyle: styles.tabBar,        
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="map" color={color} size={size} />
            ),
          headerStyle: styles.header,        
          headerTitleStyle: styles.headerTitle,
        }}
      />
        <Tab.Screen 
        name="Route"
        component={saveRouteScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="routes" color={color} size={size} />
          ),
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),  
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
        }}
      />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabBar: {
    height: 60,
  },
  header: { 
    height: 40,                 
  },
  headerTitle: {
    fontSize: 20,               
    fontWeight: 'bold',  
  }       
});
