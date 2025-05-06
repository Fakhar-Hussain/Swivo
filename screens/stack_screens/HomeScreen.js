import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
  Button,
  Alert,
  Modal,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {getAuth} from '@react-native-firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
} from '@react-native-firebase/firestore';
// import { startBackgroundTimeCheck } from '../BackgroundTask';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [devices, setDevices] = useState([""]);
  const [refreshing, setRefreshing] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const uid = auth.currentUser.uid;

  const switch_schedule = async () => {
    const querySnap = await getDocs(collection(db, 'users', uid, 'devices'));
    const snapVal = querySnap.docs.map( (item) => item.data());
    const jsonData = JSON.stringify(snapVal);
    
    await AsyncStorage.setItem('@device_data', jsonData);
  }

  const SwitchControl = item => {
    navigation.navigate('SwitchControl', {route: item});
  };

  const getUserDevices = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'users', uid, 'devices'),
      );
      const doc = querySnapshot.docs.map(user_device => user_device.data());
      setDevices(doc);
      
    } catch (error) {
      console.error('Error fetching devices:', error.message);
    }
  };


  const fetchSwitchList = async () => {
    try {
      setRefreshing(true);
      setTimeout( async () => {
        switch_schedule();
        getUserDevices();
      }, 1000)
    } catch (error) {
      console.error("Error fetching Switches list:", error);
    } finally {
      setRefreshing(false);
    }
  };



  useEffect(() => {
    switch_schedule();
    getUserDevices();
  }, [0]);

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        keyExtractor={item => item.device_id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={devices.length === 0 && styles.roomList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchSwitchList} /> }
        ListEmptyComponent={
          <View style={{alignItems: "center", justifyContent: "center"}}>
            <Ionicons name="add-circle-outline" size={80} style={styles.newDeviceIcon} />
            <Text style={styles.title}>No Device Found</Text>
            <Text style={styles.description}>Tap the button to add your first device.</Text>
          </View>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.roomBox}
            onPress={() => SwitchControl(item)}>
            <Ionicons
              name={item.room_icon}
              color="#3A3D5A"
              style={{marginBottom: 30}}
              size={40}
            />
            <Text style={styles.roomTitle}>{item.room}</Text>
            <Text style={styles.roomName}>{item.room_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  newDeviceIcon: {top: -10, color: "gray"},
  title: { fontSize: 20, fontFamily: 'Ubuntu-Medium', color: "gray" },
  description: { fontSize: 14, marginVertical: 10,fontFamily: 'Ubuntu-Medium', color: "gray" },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  roomList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  roomBox: {
    width: 140,
    height: 160,
    backgroundColor: '#f0f0f0',
    justifyContent: 'space-around',
    margin: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 12,
    shadowRadius: 6,
    elevation: 5,
  },
  roomName: {
    fontSize: 14,
    fontFamily: 'Ubuntu-Light',
  },
  roomTitle: {
    marginBottom: 2,
    fontSize: 12,
    fontFamily: 'Ubuntu-Medium',
  },
  roomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    top: 5,
  },
  iconButton: {
    marginHorizontal: -3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    width: '100%',
  },

  addRoomBtn: {
    height: 60,
    width: 60,
    backgroundColor: '#96D4AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    position: 'absolute',
    bottom: 25,
    right: 20,
    shadowColor: '#000',
    shadowOpacity: 12,
    shadowRadius: 6,
    elevation: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContentBtn: {
    width: '100%',
    backgroundColor: '#1abc9c',
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  modalContentBtnTxt: {
    color: '#fff',
    fontFamily: 'Ubuntu-Medium',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    margin: 5,
  },
});

export default HomeScreen;
