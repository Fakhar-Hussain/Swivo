import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Switch,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure you have this installed
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {getAuth} from '@react-native-firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';
import Loader from '../Loader';

const AddSwitchControl = ({route}) => {
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  const db = getFirestore();
  const navigation = useNavigation();
  const device_id = route.params.route.device_id;

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [switches, setSwitches] = useState([]);  


  const switch_details = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users', uid, 'devices', device_id, 'switches'));
      const docs = querySnapshot.docs.map(switchData => switchData.data());

      setSwitches(docs[0].switches);
    } catch (error) {
      console.error('Error fetching devices:', error.message);
    }

  };
  
  const toggleSwitch = async item => {
    
    const newValue = !item.isOn;
    const querySnap = await getDoc(doc(db, 'users', uid, 'devices', device_id));
    const wifi_address = querySnap.data().wifi_address;

    const url = `http://${wifi_address}/${newValue ? 'on' : 'off'}?channel=${String(item.id - 1)}`;

    
    
    try {
      const updatedSwitches = switches.map(sw =>
        sw.id === item.id ? {...sw, isOn: newValue} : sw,
      );

      await updateDoc(doc(db, 'users', uid, 'devices', device_id, 'switches', device_id),{
        switches: updatedSwitches,
      }).then(async () => {      
        switch_details();
        console.log('switch updated');
        await axios.get(url);
      });
    } catch (error) {
      console.error('switch toggle failed:', error);
    }
  };

  const resetDevice = async () => {
    setIsLoading(true);

    const querySnap = await getDoc(doc(db, 'users', uid, 'devices', device_id));
    const wifi_address = querySnap.data().wifi_address;

    try {
      setTimeout(async () => {
        await axios.post(`http://${wifi_address}/wifi-reset`)
        .then( async () => {
          await deleteDoc(doc(db, 'users', uid, 'devices', device_id, 'switches', device_id));
        }).then( async () => {
          await deleteDoc(doc(db, 'users', uid, 'devices', device_id));
          setIsLoading(false);
          navigation.replace('TabBar');
        }) 
      }, 8000);
    } catch (error) {
      if (error) {
        setIsLoading(false);
        console.error('device reset failed');
      }
    }
  };

  const fetchSwitchList = async () => {
    const querySnap = await getDoc(doc(db, 'users', uid, 'devices', device_id));
    const wifi_address = querySnap.data().wifi_address; 

    try {
      setRefreshing(true);
      setTimeout(async () => {
        await axios.get(`http://${wifi_address}/`).then((res) => {
          console.log(res.status);
        })
        switch_details();
      }, 1000);
    } catch (error) {
      console.error('Error fetching Switches list:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    switch_details();
  }, []);

  return (
      <View style={styles.container}>
        {/* TabBar */}
        <View style={styles.tabBarContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              style={{left: 15}}
              name={'arrow-back'}
              size={24}
              color={'#fff'}
            />
          </TouchableOpacity>
          <Text style={styles.tabBarText}>{route.params.route.room_name}</Text>
          <TouchableOpacity onPress={() => resetDevice()}>
            <Icon
              style={{right: 15}}
              name={'delete-outline'}
              size={24}
              color={'#fff'}
            />
          </TouchableOpacity>
        </View>

        {/* Switch List */}
        <FlatList
          data={switches}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.switchContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchSwitchList}
            />
          }
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => toggleSwitch(item)}
              key={item.id}
              style={[
                styles.switchRow,
                item.isOn
                  ? {backgroundColor: '#00ADB5'}
                  : {backgroundColor: '#f0f0f0'},
              ]}>
              {/* Power Icon */}
              <Icon
                name="offline-bolt"
                size={35}
                color={item.isOn ? '#fff' : '#3A3D5A'}
                style={styles.powerIcon}
              />

              <Text
                style={[
                  styles.input,
                  item.isOn ? {color: '#fff'} : {color: '#3A3D5A'},
                ]}>
                {item.name}
              </Text>

              {/* Toggle Switch Button */}
              <TouchableOpacity
                onPress={() => toggleSwitch(item)}
                style={styles.toggleButton}>
                <Icon
                  style={{top: 10}}
                  name={item.isOn ? 'toggle-on' : 'toggle-off'}
                  size={40}
                  color={item.isOn ? '#fff' : '#3A3D5A'}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
        <Loader loading={isLoading} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBarContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#00ADB5',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    elevation: 5,
  },
  tabBarText: {
    color: '#fff',
    fontFamily: 'Ubuntu-Bold',
    fontSize: 20,
  },
  switchContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  switchRow: {
    width: 140,
    height: 160,
    backgroundColor: '#f0f0f0',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 12,
    shadowRadius: 6,
    elevation: 5,
  },
  powerIcon: {},
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
    padding: 5,
    fontFamily: 'Ubuntu-Regular',
    color: '#fff',
  },
  toggleButton: {},
});

export default AddSwitchControl;

