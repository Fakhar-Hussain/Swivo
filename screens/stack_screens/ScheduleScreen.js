import { getAuth } from '@react-native-firebase/auth';
import { collection, deleteDoc, doc, getDocs, getFirestore } from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';


// const newSchedule = [
//   {
//     id: '1',
//     name: 'ON',
//     room: 'Living Room',
//     switch: 'Switch 01',
//     switchtime: '4:17 PM',
//   },
//   {
//     id: '2',
//     name: 'OFF',
//     room: 'Bedroom',
//     switch: 'Switch 06',
//     switchtime: '4:17 PM',
//   },
//   {
//     id: '3',
//     name: 'ON',
//     room: 'Kitchen',
//     switch: 'Switch 02',
//     switchtime: '4:17 PM',
//   },
//   {
//     id: '4',
//     name: 'ON',
//     room: 'Garage',
//     switch: 'Switch 04',
//     switchtime: '4:17 PM',
//   },
//   {
//     id: '5',
//     name: 'ON',
//     room: 'Bathroom',
//     switch: 'Switch 03',
//     switchtime: '4:17 PM',
//   },
// ];

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const auth = getAuth();
  const db = getFirestore();
  const uid = auth.currentUser.uid;

  const deleteSchedule = async (sid) => {
    setIsLoading(true);

    const localData = await AsyncStorage.getItem('@schedule_data');
    const schedules = localData ? JSON.parse(localData) : [];
    const updatedSchedules = schedules.filter(item => item.schedule_id !== sid);
    
    await deleteDoc(doc(db, "users", uid, "switch_schedule", sid)).then( () => {
      setTimeout( async () => {
        setIsLoading(false)
        await AsyncStorage.setItem('@schedule_data', JSON.stringify(updatedSchedules));
        getUserSchedules();
      },2000)
    }).catch( (error) => {
      console.error('Error fetching delete item in schedule list:', error.message);
    }) 
  };

  const getUserSchedules = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users', uid, 'switch_schedule'));
      const doc = querySnapshot.docs.map(user_device => user_device.data());
      
      // here we need to sort by ascending order ???

      setSchedule(doc);
      await AsyncStorage.setItem('@schedule_data', JSON.stringify(doc));
      
    } catch (error) {
      console.error('Error fetching getting all items in schedule list:', error.message);
    }
  };


  const fetchSwitchList = async () => {
    try {
      setRefreshing(true);
      setTimeout( async () => {
        getUserSchedules();
      }, 1000)
    } catch (error) {
      console.error("Error fetching schedule list:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getUserSchedules();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={schedule}
        keyExtractor={item => item.schedule_id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={schedule.length === 0 && styles.roomList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchSwitchList} /> }
        ListEmptyComponent={
          <View style={{alignItems: "center", justifyContent: "center"}}>
            <Ionicons name="add-circle-outline" size={80} style={styles.newDeviceIcon} />
            <Text style={styles.title}>No Schedule Found</Text>
            <Text style={styles.description}>Tap the button to add your first schedule.</Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.scheduleCard}>
            <Text style={styles.scheduleName}>{item.power_type}</Text>
            <Text style={styles.scheduleDetail}>{item.room}</Text>
            <Text style={styles.scheduleDetail}>{item.switch}</Text>
            <Text style={styles.scheduleDetail}>{item.time}</Text>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => deleteSchedule(item.schedule_id)}
              style={{position: 'absolute', right: 10, top: 10}}>
              <AntDesign name="delete" color="#3A3D5A" size={20} style={{}} />
            </TouchableOpacity>
          </View>
        )}
      />

      <Loader loading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 13,
    backgroundColor: '#FFF', // Soft dark card color
  },

  roomList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
    // flexWrap: 'wrap',
  },
  newDeviceIcon: {top: -10, color: "gray"},
  title: { fontSize: 20, fontFamily: 'Ubuntu-Medium', color: "gray" },
  description: { fontSize: 14, marginVertical: 10,fontFamily: 'Ubuntu-Medium', color: "gray" },


  scheduleCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    fontFamily: 'Ubuntu-Regular',
    shadowColor: '#000',
    shadowOpacity: 10,
    shadowRadius: 6,
    borderRadius: 10,
    elevation: 3,
  },
  scheduleName: {
    fontSize: 28,
    fontFamily: 'Ubuntu-Bold',
    color: '#00ADB5',
  },
  scheduleDetail: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    color: '#3A3D5A', // Soft gray text
  },
});

export default ScheduleScreen;
