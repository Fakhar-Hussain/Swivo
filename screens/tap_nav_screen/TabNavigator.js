import React, { useState, useRef, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/FontAwesome';

import AnimatedTabBar from "../AnimatedTabBar";
import HomeScreen from "../stack_screens/HomeScreen";
import SwitchScheduleScreen from "../stack_screens/ScheduleScreen";
import AddNewDevice from "../stack_screens/AddNewDevice";
import AddNewSchedule from "../stack_screens/AddNewSchedule";
import SettingScreen from "../stack_screens/SettingScreen";


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (


    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#00ADB5' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: "Ubuntu-Bold", },
        headerShown: true
      }}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen}
        options={({ navigation }) => ({
          tabBarIconName: "home",
          title: 'Home',
          headerTitleAlign: 'center',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate(AddNewDevice)}>
                <Icon name="plus-circle" size={28} color="#fff" style={{ marginRight: 15, }} />
              </TouchableOpacity>
          )
        })}
      />
      <Tab.Screen name="ScheduleScreen" component={SwitchScheduleScreen}
        options={({ navigation }) => ({
          tabBarIconName: "calendar-check-o",
          title: 'Switch Schedule',
          headerTitleAlign: 'center',
          headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate(AddNewSchedule)}>
                <Icon name="plus-circle" size={28} color="#fff" style={{ marginRight: 15, }} />
              </TouchableOpacity>
          )
        })}
      />
      <Tab.Screen name="SettingScreen" component={SettingScreen} options={{ tabBarIconName: "gear", title: 'Settings', headerTitleAlign: 'center', }} />
    </Tab.Navigator>
  );
}


