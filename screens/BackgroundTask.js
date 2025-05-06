import { getAuth } from '@react-native-firebase/auth';
import { collection, getDocs, getFirestore } from '@react-native-firebase/firestore';
import moment from 'moment';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const checkTimeMatch = async () => {   
  const currentTime = moment().format('hh:mm A'); // eg. 05:00:00 PM
  
  const jsonScheduleValue = await AsyncStorage.getItem('@schedule_data');
  const getJsonSchedule =  jsonScheduleValue != null ? JSON.parse(jsonScheduleValue) : null;
  
  getJsonSchedule?.forEach( async (schedule) => {
    // const IP = "192.168.100.7";
    const num = schedule.switch.split(' ')[1]  
    const type = schedule.power_type === 'ON' ? "on" : "off";
    const IP = schedule.wifi_address;
    
    const url = `http://${IP}/${type}?channel=${String(num - 1)}`;
      if (currentTime === schedule.time) {
        await axios.get(url).then((res) => {
          if (res.status === 200) {
            console.log("Switch Time Matched>>");
          }
        })
        
      }
    })
  };

const verySimpleTask = async () => {
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      await checkTimeMatch();
      await sleep(60000); // check every 10 seconds
    }
  });
};

const options = {
  taskName: 'TimeChecker',
  taskTitle: 'Time Scheduler Running',
  taskDesc: 'Will trigger when time matches',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {},
};

export const startBackgroundTimeCheck = async () => {
  await BackgroundService.start(verySimpleTask, options);
};

export const stopBackgroundTimeCheck = async () => {
  await BackgroundService.stop();
};
