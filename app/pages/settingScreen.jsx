import React, {useState, useEffect, useContext} from "react";
import { Text, View, StyleSheet, Switch} from "react-native";
import themeContext from "../theme/themeContext";
import { SafeAreaView } from "react-native";


export default function SettingScreen() {
    const theme = useContext(themeContext);
    const [darkmode, setDarkMode] = useState(false);
    
    //opslaan in async storage + het laden uit de async storage
  useEffect(() => {
    const loadDarkMode = async() => {
      const savedDarkMode = await AsyncStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        setDarkMode(JSON.parse(savedDarkMode));
        EventRegister.emit('ChangeTheme', JSON.parse(savedDarkMode));
      }
    };

    loadDarkMode();
  }, []);

  const toggleDarkMode = async (value) => {
    setDarkMode(value);
    EventRegister.emit('ChangeTheme', value);
    await AsyncStorage.setItem('darkMode', JSON.stringify(value));
  };

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Donkere modus</Text>
                <Switch value={darkmode} onValueChange={toggleDarkMode} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 80,
      },
      settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        alignContent: 'center',
        gap: 20,
      },
      settingLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
      },
});
