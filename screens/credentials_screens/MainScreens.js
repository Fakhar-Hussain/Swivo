import React from 'react'
import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';

import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from '../tap_nav_screen/TabNavigator';
import AddNewDevice from '../stack_screens/AddNewDevice';
import SwitchControlScreen from '../stack_screens/SwitchControl';
import AddNewSchedule from '../stack_screens/AddNewSchedule';

const Stack = createStackNavigator();

const MainScreens = () => {
    return (

        <Stack.Navigator screenOptions={{
            headerStyle: { backgroundColor: '#00ADB5' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontFamily: "Ubuntu-Bold", },
            headerShown: true
        }}>
            <Stack.Screen name='TabBar' component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AddNewDevice" component={AddNewDevice} options={() => ({ title: 'New Device', headerTitleAlign: 'center', })} />
            <Stack.Screen name="SwitchControl" component={SwitchControlScreen} options={() => ({headerShown: false })} />
            <Stack.Screen name="AddNewSchedule" component={AddNewSchedule} options={() => ({ title: 'New Schedule', headerTitleAlign: 'center', })} />
        </Stack.Navigator>
    )
}

export default MainScreens