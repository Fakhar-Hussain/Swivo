import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const SettingScreen = () => {

  // Profile State
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [phone , setPhone] = useState("");
  const [profileModalVisible , setProfileModalVisible] = useState(false);

  // Change Password State
  const [currentPass , setCurrentPass] = useState(false);
  const [newPass , setNewPass] = useState(false);
  const [changePasswordModalVisible , setChangePasswordModalVisible] = useState(false);
  
  // Contact Support
  const [contactSupportModalVisible , setContactSupportModalVisible] = useState(false);

  // App Info
  const [appInfoModalVisible , setAppInfoModalVisible] = useState(false);

  const auth = getAuth()
  const db = getFirestore();
  const uid = auth.currentUser.uid;

  const navigation = useNavigation();
  
  const signOut = () => {
    auth.signOut()
      .then(() => { console.log('User signed Out successfully') })
  }

  const profileModal = async () => {
    setProfileModalVisible(true)
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      setName(userSnap.data().name)
      setEmail(userSnap.data().email)
      setPhone(userSnap.data().phone)
    } catch (error) {
      console.error('Error fetching profileModal:', error.message);
    }
  }

  const newDevice = () => {
    navigation.navigate('AddNewDevice');
  };

  const changePasswordModal = () => {
    setChangePasswordModalVisible(true)
  };

  const contactSupportModal = () => {
    setContactSupportModalVisible(true)
  };

  const appInfoModal = () => {
    setAppInfoModalVisible(true)
  };



  return (
    <View style={{flex:1, backgroundColor: "#FFF", paddingBottom: 5}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem icon="person" label="Profile" onPress={() => profileModal()} />
        <SettingItem icon="lock" label="Change Password" onPress={() => changePasswordModal()} />
        <Text style={{borderColor: "#000", borderBottomWidth: 0.7,marginTop: -10}}></Text>

        <Text style={styles.sectionTitle}>Devices</Text>
        {/* <SettingItem icon="devices" label="Manage Devices" onPress={() => {}} /> */}
        <SettingItem icon="add-circle-outline" label="Add New Device" onPress={() => newDevice()} />

        <Text style={{borderColor: "#000", borderBottomWidth: 0.7,marginTop: -10}}></Text>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem icon="dark-mode" label="Dark Mode" onPress={() => {}} />
        {/* <SettingItem icon="language" label="Language" onPress={() => {}} /> */}
        <Text style={{borderColor: "#000", borderBottomWidth: 0.7,marginTop: -10}}></Text>


        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem icon="support-agent" label="Contact Support" onPress={() => contactSupportModal()} />
        <SettingItem icon="info" label="App Info" onPress={() => appInfoModal()} />
        <Text style={{borderColor: "#000", borderBottomWidth: 0.7,marginTop: -10}}></Text>

        <Text style={styles.sectionTitle}>Logout</Text>
        <SettingItem icon="logout" label="Log Out" onPress={() => signOut()} />
        <Text style={{borderColor: "#000", borderBottomWidth: 0.7,marginTop: -10}}></Text>

        
        {/* Profile */}
        <Modal
          visible={profileModalVisible}
          animationType="slide"
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Profile</Text>
              <View style={styles.iconItem}>
                <Text style={styles.iconText}>Name:</Text>
                <Text style={[styles.iconText, {fontFamily: "Ubuntu-Regular", fontSize: 16,paddingVertical: 4, top:2}]}>{name}</Text>
              </View>
              <View style={styles.iconItem}>
                <Text style={styles.iconText}>Email:</Text>
                <Text style={[styles.iconText, {fontFamily: "Ubuntu-Regular", fontSize: 16,paddingVertical: 4, top:2}]}>{email}</Text>
              </View>
              <View style={styles.iconItem}>
                <Text style={styles.iconText}>Phone:</Text>
                <Text style={[styles.iconText, {fontFamily: "Ubuntu-Regular", fontSize: 16,paddingVertical: 4, top:2}]}>{phone}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setProfileModalVisible(false)}
                style={{position: 'absolute', right: 10, top: 10}}>
                <Icon name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {/* Change Password */}
        <Modal
          visible={changePasswordModalVisible}
          animationType="slide"
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Change Password</Text>

              <View style={styles.iconItem}>
                <Text style={styles.iconText}>Current Password:</Text>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Current-Password"
                  value={currentPass}
                  onChangeText={txt => setCurrentPass(txt)}
                />
              </View>

              <View style={styles.iconItem}>
                <Text style={styles.iconText}>New Password:</Text>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="New-Password"
                  value={newPass}
                  onChangeText={txt => setNewPass(txt)}
                />
              </View>
              <TouchableOpacity style={styles.saveBtnContainer}>
                <Text style={styles.saveBtnTxt}>Save</Text>  
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => setChangePasswordModalVisible(false)}
                style={{position: 'absolute', right: 10, top: 10}}>
                <Icon name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Contact Support */}
        <Modal
          visible={contactSupportModalVisible}
          animationType="slide"
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Contact Support</Text>
              <TouchableOpacity style={[styles.iconItem, {flexDirection: "row",justifyContent: "center",borderBottomWidth: 0,backgroundColor: "#bef2d1",borderRadius: 6}]}>
                <FontAwesomeIcon name="whatsapp" size={24} color="green" />
                <Text style={[styles.iconText, {fontFamily: "Ubuntu-Medium", fontSize: 16,marginLeft: 10,color: "green",top:2}]}>+92-3486927664</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setContactSupportModalVisible(false)}
                style={{position: 'absolute', right: 10, top: 10}}>
                <Icon name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* App Info */}
        <Modal
          visible={appInfoModalVisible}
          animationType="slide"
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, {width: "55%", alignItems: "center"}]}>
              <Text style={styles.modalHeader}>App Info</Text>
              
              <Text style={[styles.iconText, {fontFamily: "Ubuntu-Medium",marginLeft: 10}]}>App Version: 1.0.3</Text>
              <Text style={[styles.iconText, {fontFamily: "Ubuntu-Medium",marginLeft: 10}]}>Build Number: 12</Text>
              <Text style={[styles.iconText, {fontFamily: "Ubuntu-Medium",marginLeft: 10}]}>Last Updated: Apr-2025</Text>
              
              <TouchableOpacity
                onPress={() => setAppInfoModalVisible(false)}
                style={{position: 'absolute', right: 10, top: 10}}>
                <Icon name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>

    </View>

  );
};

const SettingItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Icon name={icon} size={22} color="#3A3D5A" />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    // fontWeight: 'bold',
    color: '#3A3D5A',
    fontFamily: "Ubuntu-Medium"
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    color: '#3A3D5A',
    fontFamily: "Ubuntu-Regular",
    // textDecorationLine: "underline",
    // textDecorationColor: "#000",

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
    // alignItems: 'center',
  },
  modalHeader: {
    fontFamily: 'Ubuntu-Regular',
    paddingBottom: 20,
    top: -4,
    fontSize: 14,
    textAlign: "center"
  },
  iconItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  iconText: {
    fontSize: 12,
    fontFamily: 'Ubuntu-Bold',
    // marginLeft: -5,
    // textAlign: ""
  },

  inputPassword: {
    // width: '85%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'Ubuntu-Regular',
    borderColor: "#000",
    borderWidth: 1,
    marginTop: 5
  },
  saveBtnContainer: {
    width: 80, 
    height: 40, 
    marginVertical: 10,
    top: 10, 
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6, 
    backgroundColor: "#3A3D5A",
    alignSelf: "center"
  },
  saveBtnTxt: {
    color: "#fff",
    fontFamily: "Ubuntu-Regular"
  }


});

export default SettingScreen;
