import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useNavigation} from '@react-navigation/native';
import {getAuth} from '@react-native-firebase/auth';
import Loader from '../Loader';

const LoginScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();

  const [email, setEmail] = useState('fakharhussain.179@gmail.com');
  const [password, setPassword] = useState('123456');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state


  const SignIn = () => {
    setLoading(true);

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        console.log('User signed in successfully');
      })
      .catch(error => {
        setLoading(false);
        console.error('Error : ' + error.code);
      });
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />

      <Image
        style={styles.tinyLogo}
        source={require('../../assets/logo.png')}
      />
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={txt => setEmail(txt)}
      />

      <View style={styles.inputPasswordView}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          secureTextEntry={secureText}
          value={password}
          onChangeText={txt => setPassword(txt)}
        />
        <TouchableOpacity
          onPress={() => setSecureText(!secureText)}
          style={{right: 10, top: 10, position: 'absolute'}}>
          <Ionicons name={secureText ? 'eye-off' : 'eye'} size={25} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => SignIn()}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.switchText}>
          Don't have an account?
          <Text
            style={{
              color: '#FFF',
              fontFamily: 'Ubuntu-Bold',
              textDecorationLine: 'underline',
            }}>
            {' '}
            SignUp
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00ADB5',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontFamily: 'Ubuntu-Bold',
    color: '#333',
    top: 20,
    margin: 40,
    color: '#FFF',
    // color: '#3A3D5A',
  },
  tinyLogo: {
    width: 170,
    height: 170,
    top: 25,
    position: 'absolute',
  },
  input: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    elevation: 2,
    fontFamily: 'Ubuntu-Regular',
  },
  inputPasswordView: {
    flexDirection: 'row',
    width: '90%',
    height: 45,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    elevation: 2,
    borderRadius: 5,
    marginVertical: 5,
  },
  inputPassword: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    fontFamily: 'Ubuntu-Regular',
  },
  button: {
    marginTop: 20,
    padding: 13,
    backgroundColor: '#3A3D5A',
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Ubuntu-Bold',
  },
  switchText: {
    color: '#3A3D5A',
    marginTop: 20,
    fontFamily: 'Ubuntu-Regular',
  },
});

export default LoginScreen;
