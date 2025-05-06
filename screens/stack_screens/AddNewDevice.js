import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RadioGroup from 'react-native-radio-buttons-group';
import WifiManager from 'react-native-wifi-reborn';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import axios from 'axios';
import uuid from 'react-native-uuid';

import {getAuth} from '@react-native-firebase/auth';
import {doc, getFirestore, setDoc} from '@react-native-firebase/firestore';
import Loader from '../Loader';

const roomIcons = [
  {id: 1, name: 'bed-outline', label: 'Bedroom'},
  {id: 2, name: 'water-outline', label: 'Washroom'},
  {id: 3, name: 'tv-outline', label: 'Living Room'},
  {id: 4, name: 'restaurant-outline', label: 'Kitchen'},
];

const radioButtons = [
  {id: 2, label: '2 Switch Module'},
  {id: 4, label: '4 Switch Module'},
  {id: 6, label: '6 Switch Module'},
  {id: 8, label: '8 Switch Module'},
];

const switches = [
  {id: 1, name: 'Switch 1', isOn: false},
  {id: 2, name: 'Switch 2', isOn: false},
  {id: 3, name: 'Switch 3', isOn: false},
  {id: 4, name: 'Switch 4', isOn: false},
  {id: 5, name: 'Switch 5', isOn: false},
  {id: 6, name: 'Switch 6', isOn: false},
  {id: 7, name: 'Switch 7', isOn: false},
  {id: 8, name: 'Switch 8', isOn: false},
]

const AddNewDevice = ({navigation}) => {
  const [roomName, setRoomName] = useState('');
  const [deviceName, setDeviceName] = useState('WiFi_Smart_Switch');
  const [selectedIcon, setSelectedIcon] = useState(roomIcons[0]);
  const [wifiList, setWifiList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRadioId, setSelectedRadioId] = useState(radioButtons[0].id);

  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('lucky0099');
  
  const [wifiIP, setWifiIP] = useState('');
  const [wifiStatus, setWifiStatus] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [wiFiModalVisible, setWiFiModalVisible] = useState(false);
  const [wiFiSetupModalVisible, setWiFiSetupModalVisible] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const wifi_smart_switch_ip = '192.168.4.1'; // Default IP in AP mode

  const fetchWifiList = async () => {
    try {
      setRefreshing(true);

      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });
  
      const result = await request(permission);
  
      if (result !== RESULTS.GRANTED) {
        console.warn('Location permission not granted:', result);
        return;
      }

      const networks = await WifiManager.loadWifiList();
      setWifiList(networks.map(network => network.SSID));
    } catch (error) {
      console.error('Error fetching WiFi list:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handle_device_btn = async () => {
    setIsLoading(true);
    const new_device_id = uuid.v4().split('-').join('');
    const auth = getAuth();
    const db = getFirestore();
    const uid = auth.currentUser.uid;

    try {
      await setDoc(doc(db, 'users', uid, 'devices', new_device_id), {
        room_name: roomName,
        room: selectedIcon.label,
        room_icon: selectedIcon.name,
        device_id: new_device_id,
        device_name: deviceName,
        switch_type: selectedRadioId,
        wifi_status: wifiStatus,
        wifi_address: wifiIP
      }).then( async() => {
        console.log('Info', 'device added successfully!');
        try {
          await setDoc(
            doc(db, 'users', uid, 'devices', new_device_id, 'switches', new_device_id),
            selectedRadioId == 2
              ? {
                  device_id: new_device_id,
                  switches: switches.slice(0, 2),
                }
              : selectedRadioId == 4
              ? {
                  device_id: new_device_id,
                  switches: switches.slice(0, 4),
                }
              : selectedRadioId == 6
              ? {
                  device_id: new_device_id,
                  switches: switches.slice(0, 6),
                }
              : {
                  device_id: new_device_id,
                  switches: switches,
                },
          ).then(() => {
            console.log('Info', 'switches added successfully!');
            setTimeout(() => {
              setIsLoading(false);
              navigation.replace('TabBar');
              Alert.alert('Alert', 'Device added successfully!');
            },2000)
          });
        } catch (error) {
          console.error('Error adding device:', error.message);
        }
        
      });
    } catch (error) {
      console.error('Error adding device:', error.message);
    }
    
    
  };

  const close_modal = () => {
    navigation.replace('TabBar');
  };

  const configureWiFi = async (ssid, password) => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `http://${wifi_smart_switch_ip}/wifi-config`, // ESP32's AP mode IP
          {ssid, pass: password},
          {headers: {'Content-Type': 'application/json'}},
        );
        setIsLoading(false);
        setWiFiSetupModalVisible(false);

        const {status, ip} = response.data;
        if (status === 'connected') {
          setWifiIP(ip);
          setWifiStatus(status);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('wifi setup failed');
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Board Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Board Name"
        value={roomName}
        onChangeText={setRoomName}
        maxLength={15}
      />

      <Text style={styles.label}>Select Room</Text>
      <TouchableOpacity
        style={styles.iconPicker}
        onPress={() => setModalVisible(true)}>
        <Icon name={selectedIcon.name} size={20} color="#000" />
        <Text style={[styles.wifiText, {left: 10}]}>{selectedIcon.label}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Device Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Device Name"
        value={deviceName}
        onChangeText={setDeviceName}
      />

      <Text style={styles.label}>Select Switch</Text>
      <View style={styles.checkboxContainer}>
        <RadioGroup
          radioButtons={radioButtons}
          onPress={setSelectedRadioId}
          selectedId={selectedRadioId}
          containerStyle={styles.radioContainer}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => handle_device_btn()}>
        <Text style={styles.saveButtonTxt}>Add Device</Text>
      </TouchableOpacity>

      {/* Modal for Room Selection */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Room</Text>

            <FlatList
              data={roomIcons}
              keyExtractor={item => item.name}
              keyboardShouldPersistTaps="handled"
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.iconItem}
                  onPress={() => {
                    setSelectedIcon(item);
                    setModalVisible(false);
                  }}>
                  <Icon name={item.name} size={24} color="#000" />
                  <Text style={styles.iconText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{position: 'absolute', right: 10, top: 10}}>
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for WiFi Selection */}
      <Modal
        visible={wiFiModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select WiFi</Text>
            <FlatList
              style={{height: 200}}
              data={wifiList}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={fetchWifiList}
                />
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.iconItem}
                  onPress={() => {
                    setWifiSSID(item);
                    setWiFiModalVisible(false);
                  }}>
                  <Icon name="wifi" size={24} color="#000" />
                  <Text style={styles.iconText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setWiFiModalVisible(false)}
              style={{position: 'absolute', right: 10, top: 10}}>
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for WiFi Setup */}
      <Modal
        visible={wiFiSetupModalVisible}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.wifiModalContent}>
            <Text style={styles.modalHeader}>WiFi Setup</Text>
            <View style={styles.instructionContainer}>
              <FontAwesome
                name="exclamation-circle"
                size={20}
                color="red"
                style={{padding: 10, top: 0}}
              />
              <Text style={styles.modaldesc}>
                Before proceeding, please ensure your phone is connected to the
                Wi-Fi smart switch's network.
              </Text>
            </View>

            <View style={[styles.instructionContainer, {paddingLeft: 10,marginVertical: 10}]}>
              <Text style={styles.modaldesc}>
              آگے بڑھنے سے پہلے، براہ کرم یقینی بنائیں کہ آپ کا فون وائی فائی سمارٹ سوئچ کے نیٹ ورک سے منسلک ہے۔
              </Text>
              <FontAwesome
                name="exclamation-circle"
                size={20}
                color="red"
                style={{top: 3,left: 10}}
              />
            </View>

            <Text style={[styles.label, {alignSelf: 'flex-start',marginTop: 30}]}>
              WiFi Network
            </Text>
            <TouchableOpacity
              style={[
                styles.iconPicker,
                {alignSelf: 'flex-start', width: '100%'},
              ]}
              onPress={() => {
                setWiFiModalVisible(true);
                fetchWifiList();
              }}>
              <Icon name="wifi" size={20} color="#000" />
              <Text style={[styles.wifiText, {left: 10}]}>
                {wifiSSID || 'Select WiFi Network'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.label, {alignSelf: 'flex-start'}]}>
              WiFi Password
            </Text>
            <TextInput
              style={[
                styles.input,
                {alignSelf: 'flex-start', width: '100%', height: 40},
              ]}
              placeholder="Wi-Fi Password"
              value={wifiPassword}
              onChangeText={setWifiPassword}
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => configureWiFi(wifiSSID, wifiPassword)}>
              <Text style={styles.saveButtonTxt}>Save Wi-Fi</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => close_modal()}
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
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Medium',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontFamily: 'Ubuntu-Regular',
  },
  inputWiFi: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
  iconText: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Ubuntu-Regular',
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
  saveButtonTxt: {
    color: '#fff',
    fontFamily: 'Ubuntu-Regular',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '64%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  wifiModalContent: {
    width: '90%',
    height: '68%',
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
  instructionContainer: {
    flexDirection: 'row', 
    paddingVertical: 5, 
    left: -5,
    backgroundColor: "#FFCCCB",
    width: "100%",
    borderRadius: 5
  },
  modaldesc: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 12,
    color: 'gray',
    width: '86%',
    color: "#3A3D5A"
  },

  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
  },
  checkboxContainer: {
    marginTop: 15,
    marginBottom: -10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkboxItemTxt: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Ubuntu-Regular',
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default AddNewDevice;
