import React from "react";
import { View, StyleSheet, Text, StatusBar, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";




export default function AnimatedTopBar({ title }) {
    const navigation = useNavigation();

    const GoBackScreen = () => {
        navigation.canGoBack();
    }
// || title == "Schedule" || title == "Devices" || title == "Settings"
    return (
        <View style={styles.topBarContainer}>
            {
                title === "Rooms"
                    ?
                    <Text style={styles.topBarText}>{title}</Text>
                    :
                    <>
                        <TouchableOpacity style={{ position: "absolute", bottom: 14, left: 22 }} onPress={() => GoBackScreen()}>
                            <Icon name="arrow-left" color="#fff" style={{ marginBottom: 0 }} size={25} />
                        </TouchableOpacity>
                        <Text style={styles.topBarText}>{title}</Text>
                    </>
            }
        </View>
    );
};

const styles = StyleSheet.create({

    topBarContainer: {
        height: 80,
        // backgroundColor: "#222",
        backgroundColor: "#96D4AF",
        justifyContent: "center",
        paddingLeft: 20,
        paddingTop: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    topBar: {
        height: 50,
        backgroundColor: "#222",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
    },
    topBarText: {
        fontSize: 20,
        color: "#fff",
        textAlign: "center",
        fontFamily: "Ubuntu-Bold"

    },
})