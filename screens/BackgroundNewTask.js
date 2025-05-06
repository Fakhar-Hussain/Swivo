import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const checkAndToggleSwitch = async () => {
  console.log('Checking if the time matches to toggle the switch...');

  try {
    const currentTime = moment().format('hh:mm A');
    const jsonScheduleValue = await AsyncStorage.getItem('@schedule_data');
    const getJsonSchedule = jsonScheduleValue != null ? JSON.parse(jsonScheduleValue) : [];

    
    
    for (const schedule of getJsonSchedule) {
      // const diffInMinutes = Math.abs(moment().diff(schedule.time, 'minutes'));
      // console.log(`Schedule: ${diffInMinutes}`);

      console.log("Welcome Time ",schedule);
      const IP = schedule.wifi_address;
      const type = schedule.power_type === 'ON' ? "on" : "off";
      const num = schedule.switch.split(' ')[1];

      if (currentTime === schedule.time) {
        const url = `http://${IP}/${type}?channel=${String(num - 1)}`;
        await axios.get(url);
        console.log('✅ Switch toggled successfully.');
      } else {
        console.log('⏳ Not yet time to toggle the switch.');
      }
    }

  } catch (err) {
    console.error('❌ Error fetching or processing schedule:', err);
  }
};

// 🧠 Headless JS entry point
export const startBackgroundTask = async () => {
  try {
    await checkAndToggleSwitch();
  } catch (e) {
    console.error("❌ Headless task crashed:", e);
  }
};
