import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useNavigation} from '@react-navigation/native';
import {getAuth} from '@react-native-firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
} from '@react-native-firebase/firestore';
import Loader from '../Loader';
import {database} from '../../firebase_config';

const SignupScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const db = getFirestore();

  const [name, setName] = useState('Fakhar');
  const [email, setEmail] = useState('fakharhussain.179@gmail.com');
  const [phone, setPhone] = useState('03123456789');
  const [password, setPassword] = useState('123456');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false); // Loading state

  const SignUp = async () => {
    console.log(' SignUp Processing Start');
    setLoading(true);

    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;
    console.log('User UID:', user);

    // const userRef = ;
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
      phone: phone,
      createdAt: new Date(),
    })
      .then(save_data => {
        setLoading(false);
        console.log('User add in firestore : ', save_data);
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Error : ', error.code);
      });

    // await auth
    //   .createUserWithEmailAndPassword(email, password)
    //   .then(async ({user}) => {
    //     setLoading(false);
    //     console.log('User Data : ', user.uid);

    //     const userRef = doc(db, 'users', user.uid);
    //     await setDoc(userRef, {
    //       uid: user.uid,
    //       name: name,
    //       email: user.email,
    //       phone: phone,
    //       password: password,
    //       createdAt: new Date(),
    //     })
    //     .then(data => {
    //     })

    //     try {
    //       // await addDoc(collection(db, 'users'), {
    //       //   uid: user.uid,
    //       //   name: name,
    //       //   email: user.email,
    //       //   phone: phone,
    //       //   password: password,
    //       //   createdAt: new Date(),
    //       // }).then(data => {
    //       //   console.log('User add in firestore : ', data);
    //       // });
    //     } catch (error) {
    //       console.log('Error : ', error.code);
    //     }
    //   })
    //   .catch(error => {
    //     setLoading(false);
    //   });
  };

  // const config = async () => {
  //   const db = getFirestore();
  //   try {
  //     const q = query(collection(db, 'users'));
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach(doc => {
  //       console.log(doc.id, ' => ', doc.data());
  //     });
  //   } catch (error) {
  //     console.log(error.code);
  //   }

  //   console.log('Users list : ' + querySnapshot);
  // };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <Image
        style={styles.tinyLogo}
        source={require('../../assets/logo.png')}
      />
      <Text style={styles.header}>Sign-Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={txt => setName(txt)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={txt => setEmail(txt)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="decimal-pad"
        value={phone}
        onChangeText={txt => setPhone(txt)}
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

      <TouchableOpacity style={styles.button} onPress={() => SignUp()}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      {/*  */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>
          Already have an account?
          <Text
            style={{
              color: '#FFF',
              fontFamily: 'Ubuntu-Bold',
              textDecorationLine: 'underline',
            }}>
            {' '}
            Login
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
    // backgroundColor: '#4A6781',
    // backgroundColor: '#508991',
    // backgroundColor: '#F5F5DC',
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

export default SignupScreen;
