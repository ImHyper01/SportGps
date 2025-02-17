import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, StyleSheet } from "react-native";
import MapScreen from '../pages/mapScreen';
import SettingScreen from '../pages/settingScreen';

const Tab = createBottomTabNavigator();

export default function tabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: styles.tabLabel,  // Gebruik hier de stijl voor tab label
        tabBarStyle: styles.tabBar,        // Gebruik hier de stijl voor tab bar
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerStyle: styles.header,        // Pas de stijl van de header aan
          headerTitleStyle: styles.headerTitle, // Pas de stijl van de header title aan
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
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
    backgroundColor: '#f8f8f8', 
    height: 70,                 
  },
  headerTitle: {
    fontSize: 20,               
    fontWeight: '600',  
  }       
});
