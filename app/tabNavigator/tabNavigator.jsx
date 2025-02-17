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
        tabBarLabelStyle: styles.tabLabel,  
        tabBarStyle: styles.tabBar,        
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerStyle: styles.header,        
          headerTitleStyle: styles.headerTitle,
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
    height: 40,                 
  },
  headerTitle: {
    fontSize: 20,               
    fontWeight: 'bold',  
  }       
});
