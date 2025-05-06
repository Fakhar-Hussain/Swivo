import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";

import * as Animatable from "react-native-animatable";

export default function AnimatedTabBar({ state, descriptors, navigation }) {

    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabButton}>
                        <Animatable.View
                            animation={isFocused ? "bounceIn" : "fadeIn"}
                            duration={1500}
                            style={[styles.tabIconContainer, isFocused && styles.activeTab]}
                        >
                            <Icon name={options.tabBarIconName} style={{ fontFamily: undefined }} size={28} color={isFocused ? "#00ADB5" : "#fff"} />
                        </Animatable.View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};



const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: "row",
        backgroundColor: "#00ADB5",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: 10,
        height: 75,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: -6,
        elevation: 5,

    },
    tabButton: {
        flex: 1,
        alignItems: "center",
    },
    tabIconContainer: {
        padding: 10,
        marginTop: 5
    },
    activeTab: {
        backgroundColor: "#FFF",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },


});