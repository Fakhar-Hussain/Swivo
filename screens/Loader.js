import React from 'react';
import {View, ActivityIndicator, Modal, StyleSheet, Text} from 'react-native';

const Loader = ({loading}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={loading}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#3A3D5A" />
          <Text style={styles.text}>Please wait</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay to prevent clicks
  },
  container: {
    width: 110,
    height: 120,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  text: {
    top: 15,
    fontFamily: "Ubuntu-Regular",
    fontSize: 13,
    color: "#3A3D5A"
  }
});

export default Loader;
