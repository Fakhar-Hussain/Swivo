import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Animatable.View
        animation={'flash'}
        duration={1400}
    >
            <Image
              style={styles.tinyLogo}
              source={require('../../assets/logo.png')}
            />

        </Animatable.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ADB5',
    padding: 20,
  },
  tinyLogo: {
    width: 250,
    height: 250,
    // position: 'absolute',
  },
});
