import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  NativeModules
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import uuid from 'react-native-uuid';
import {getAuth} from '@react-native-firebase/auth';
import {addDoc, collection, doc, getDocs, getFirestore, setDoc} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';


const AddNewSchedule = ({navigation}) => {
  const [onTime, setOnTime] = useState(new Date(new Date().getTime() + 5 * 60000));
  const [showOnTimePicker, setShowOnTimePicker] = useState(false);

  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [powerSwitchBtnOn, setPowerSwitchBtnOn] = useState(false);
  
  const [rooms, setRooms] = useState();
  const [selectedRoom, setSelectedRoom] = useState();
  
  const [switches, setSwitches] = useState();
  const [selectedSwitch, setSelectedSwitch] = useState();

  const [isLoading, setIsLoading] = useState(false);
  


  const auth = getAuth();
  const uid = auth.currentUser.uid;
  const db = getFirestore();
  const new_device_id = uuid.v4().split('-').join('');


  const scheduleAlarm = () => {
    console.log("Schedule-Alarm-ON");
    NativeModules.AlarmScheduler.scheduleAlarm();
  };

  const handleToggle = (state) => {
    setPowerSwitchBtnOn(state);
  };
  
  
  const handle_save_schedule = async () => {
    setIsLoading(true);
    const power = powerSwitchBtnOn ? "ON" : "OFF"
    const schedule_id = uuid.v4().split('-').join('');

    try {
      await setDoc(doc(db, 'users', uid, 'switch_schedule', schedule_id), {
        room: selectedRoom.room_name,
        switch: selectedSwitch.name,
        time: onTime.toLocaleTimeString(
          'en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
          }),
        power_type: power,
        schedule_id: schedule_id,
        wifi_address: selectedRoom.wifi_address,
      })
      .then( () => {
        setTimeout(() => {
          setIsLoading(false);
          scheduleAlarm();
          navigation.goBack();
        },3000)
      })
    } catch (error) {
      console.log("Error in Save_Schedule : ", error.message)
    }
  }

  const fetch_room_devices = async () => {
    try {
      const jsonScheduleValue = await AsyncStorage.getItem('@device_data');
      const getJsonData =  jsonScheduleValue != null ? JSON.parse(jsonScheduleValue) : null;

      setRooms(getJsonData);
      setSelectedRoom(getJsonData[0]);
           
    } catch (error) {
      console.error('Error fetching in rooms schedule screen:', error.message);
    };
  }

  const fetch_room_switches = async (item) => {
    setSelectedRoom(item);
    setRoomModalVisible(false);

    try {

      const querySwitchSnapshot = await getDocs(collection(db, 'users', uid, 'devices', item.device_id , 'switches'));
      const switchDocs = querySwitchSnapshot.docs.map(doc => doc.data())
      setSwitches(switchDocs[0].switches);
      setSelectedSwitch(switchDocs[0].switches[0]);

    } catch (error) {
      console.error('Error fetching switches in schedule screen:', error.message);
    };
  }

  useEffect( () => {
    fetch_room_devices();
  }, [])



  return (
    <View style={styles.container}>
      {/* Room Selection */}
      <Text style={styles.label}>Select Room</Text>
      <TouchableOpacity
        style={styles.iconPicker}
        onPress={() => setRoomModalVisible(true)}>
        <Icon name={selectedRoom == "" ? "bed-outline" : selectedRoom?.room_icon} size={20} color="#000" />
        <Text style={[styles.wifiText, {left: 10}]}>{switches ? selectedRoom?.room_name : "Select Room"}</Text>
      </TouchableOpacity>

      {/* Switch Selection */}
      <Text style={styles.label}>Select Switch</Text>
      <TouchableOpacity
        style={styles.iconPicker}
        onPress={() => setSwitchModalVisible(true)}>
        <MaterialCommunityIcons
          name={'lightning-bolt-outline'}
          size={20}
          color="#000"
        />
        <Text style={[styles.wifiText, {left: 10}]}>
          {selectedSwitch ? selectedSwitch.name : "Select Switch"}
        </Text>
      </TouchableOpacity>

      {/* Switch Time */}
      <Text style={styles.label}>Select Time:</Text>
      <TouchableOpacity
        style={styles.iconPicker}
        onPress={() => setShowOnTimePicker(true)}>
        <MaterialCommunityIcons name={'alarm-check'} size={20} color="#000" />
        <Text style={[styles.wifiText, {left: 10}]}>
          {onTime.toLocaleTimeString(
            'en-US', {
              hour12: true,
              hour: '2-digit',
              minute: '2-digit'
            }
          )}
        </Text>
      </TouchableOpacity>

      {/* Time Modal */}
      {showOnTimePicker && (
        <DateTimePicker
          value={onTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowOnTimePicker(false);
            if (selectedTime) setOnTime(selectedTime);
          }}
        />
      )}

      {/* Switch Type */}
      <Text style={styles.label}>Select Type</Text>
      <View style={{flexDirection: 'row',justifyContent: 'space-around',marginTop: 10,}}>
        <TouchableOpacity style={[styles.powerBtn, powerSwitchBtnOn == true ? {backgroundColor: "#00ADB5"} : {backgroundColor: "#fff"}]} onPress={() => handleToggle(true)}>
          <Text style={[styles.powerBtnTxt, powerSwitchBtnOn == true ? {color: "#fff"} : {color: "#3A3D5A"}]}>ON</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.powerBtn, powerSwitchBtnOn == false ? {backgroundColor: "#00ADB5"} : {backgroundColor: "#fff"}]} onPress={() => handleToggle(false)}>
          <Text style={[styles.powerBtnTxt, powerSwitchBtnOn == false ? {color: "#fff"} : {color: "#3A3D5A"}]}>OFF</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={() => handle_save_schedule()}>
        <Text style={styles.saveButtonText}>Save Schedule</Text>
      </TouchableOpacity>

      {/* Modal for Room Selection */}
      <Modal
        visible={roomModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Room</Text>

            <FlatList
              data={rooms}
              keyExtractor={item => item.device_id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.iconItem}
                  onPress={() => {
                    fetch_room_switches(item)
                  }}>
                  <Icon name={item.room_icon} size={24} color="#000" />
                  <Text style={styles.iconText}>{item.room_name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setRoomModalVisible(false)}
              style={{position: 'absolute', right: 10, top: 10}}>
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Switch Selection */}
      <Modal
        visible={switchModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Switch</Text>

            <FlatList
              data={switches}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.iconItem}
                  onPress={() => {
                    setSelectedSwitch(item);
                    setSwitchModalVisible(false);
                  }}>
                  <Icon name={'power'} size={22} color="#000" />
                  <Text style={styles.iconText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setSwitchModalVisible(false)}
              style={{position: 'absolute', right: 10, top: 10}}>
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Loader loading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Ubuntu-Medium',
    marginBottom: 5,
  },
  wifiText: {
    fontFamily: 'Ubuntu-Regular',
  },
  iconPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '60%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontFamily: 'Ubuntu-Regular',
    paddingBottom: 20,
    top: -4,
    fontSize: 14,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  iconText: {
    fontSize: 16,
    marginLeft: 15,
    fontFamily: 'Ubuntu-Regular',
  },

  timeButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginVertical: 5,
    width: '100%',
    flexDirection: 'row',
  },
  timeText: {
    color: '#000',
    fontFamily: 'Ubuntu-Regular',
    marginLeft: 15,
  },
  powerBtn: {
    width: 120,
    height: 42,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerBtnTxt: {
    fontSize: 20,
    fontFamily: "Ubuntu-Bold"
  },

  saveButton: {
    backgroundColor: '#3A3D5A',
    borderRadius: 10,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'Ubuntu-Regular',
  },
});

export default AddNewSchedule;