import React, {useEffect, useState} from 'react';
import {Alert, BackHandler, NativeModules} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './screens/credentials_screens/LoginScreen';
import SignUpScreen from './screens/credentials_screens/SignUpScreen';
import MainScreens from './screens/credentials_screens/MainScreens';
import {getAuth} from '@react-native-firebase/auth';
import SplashScreen from './screens/credentials_screens/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isConnected, setIsConnected] = useState(true);

  //  const checkInternet = () => {
  //    NetInfo.fetch().then(state => {
  //      if (!state.isConnected) {
  //         // console.log(state);
  //         showNoInternetPopup();
  //      }
  //      setIsConnected(state.isConnected);
  //     //  BackHandler.exitApp()
  //    });
  //  };

  //  const showNoInternetPopup = () => {
  //    Alert.alert(
  //      'Connection Failed',
  //      'Please check your mobile data or Wi-Fi connection and try again.',
  //      [
  //        { text: 'Exit', onPress: () => BackHandler.exitApp() }
  //      ],
  //      { cancelable: false }
  //    );
  //  };

  // useEffect(() => {
  //   checkInternet();  // Check on app start

  //   const noInternetCheck = NetInfo.addEventListener(state => {
  //     if (!state.isConnected) {
  //       showNoInternetPopup();
  //     }
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => noInternetCheck();
  // }, []);

  const scheduleAlarm = () => {
    console.log("Schedule-Alarm-ON");
    NativeModules.AlarmScheduler.scheduleAlarm();
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      scheduleAlarm();
    }, 4000);

    const unsubscribe = getAuth().onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : isAuthenticated ? (
          <Stack.Screen name="Main" component={MainScreens} />
        ) : (
          <>
            <Stack.Screen name="Login">
              {props => (
                <LoginScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {props => (
                <SignUpScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
