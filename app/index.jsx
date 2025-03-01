import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Zorg ervoor dat de bestanden correct in de assets-map staan
// import bgImage from "../assets/images/background/bgImage.jpg";
import logoImage from "../assets/images/logo/stLogo2.png";

export default function Index() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* <Image style={styles.bgImage} source={bgImage} /> */}
            <Text style={styles.header}>Welkom bij</Text>
            <Image style={styles.lgImage} source={logoImage} />
            <TouchableOpacity style={styles.hmButton} onPress={() => navigation.navigate("tabNavigator/tabNavigator")}>
                <Text style={styles.hmTextButton}>Let's Start</Text>
            </TouchableOpacity>
        </View>
    );  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'white',
    },
    header: {
        fontSize: 60,
        fontWeight: "bold",
        marginBottom: 20,
        zIndex: 11, 
    },
    bgImage: {
        resizeMode: "cover",
        position: "absolute",
        width: "100%", 
        height: "100%",
        zIndex: 1,
    },
    lgImage: {
        width: 380,
        height: 50,
        resizeMode: "cover",
        zIndex: 11,
    },
    hmButton: {
        marginTop: "10%",
        backgroundColor: "#ff5733",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#ff5733",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        zIndex: 11,
    },
    hmTextButton: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
});
