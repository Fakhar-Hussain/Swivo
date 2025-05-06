// Install dependencies
// npm install @react-native-firebase/app @react-native-firebase/auth

import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import LoginScreen from './screens/credentials_screens/LoginScreen';
// import SignUpScreen from './screens/credentials_screens/SignUpScreen';
// import MainScreens from './screens/credentials_screens/MainScreens';

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    const unsubscribe = getAuth().onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainScreens} />
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {(props) => <SignUpScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// MainScreen.js
const MainScreens = ({ setIsAuthenticated }) => {

  const auth = getAuth()

  const signOut = () => {
    auth.signOut()
    .then(() => {
      console.log('User signed Out successfully');
    })

  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ padding: 20 }}>MainScreen</Text>
      <Text></Text>
      <Button title="SignOut" onPress={() => signOut()} />
    </View>
  );
};

const LoginScreen = ({ setIsAuthenticated }) => {

  const navigation = useNavigation();
  const auth = getAuth()

  const [email, setEmail] = useState('hello123@gmail.com');
  const [password, setPassword] = useState('123456');

  const login = async () => {
    console.log(email);
    console.log(password);

    auth.signInWithEmailAndPassword(email , password)
      .then(() => {
        console.log('User signed in successfully');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is incorrect!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });

  };

  const signup = () => {
    navigation.navigate("Signup")
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ padding: 20 }}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "80%" }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "80%" }} />
      <Button title="Login" onPress={login} />
      <Text></Text>
      <Button title="SignUp" onPress={() => signup()} />
    </View>
  );
};

// SignUpScreen.js
const SignUpScreen = ({ setIsAuthenticated }) => {

  const navigation = useNavigation();
  const auth = getAuth()

  const [email, setEmail] = useState('hello123@gmail.com');
  const [password, setPassword] = useState('123456');

  const signUp = async () => {
    console.log(email);
    console.log(password);

      auth.createUserWithEmailAndPassword(email , password)
      .then(() => {
        console.log('User account created.');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const login = () => {
    navigation.navigate("Login")
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ padding: 20 }}>SignUp</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "80%" }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword}  style={{ borderWidth: 1, marginBottom: 10, padding: 8, width: "80%" }} />
      <Button title="Sign Up" onPress={signUp} />
      <Text></Text>
      <Button title="Login" onPress={() => login()} />
    </View>
  );
};
