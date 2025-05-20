import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const startBackgroundTasking = async () => {
  console.log('🔁 Background task running...');

  try {
    const currentTime = moment(); // current time
    const jsonScheduleValue = await AsyncStorage.getItem('@schedule_data');
    const getJsonSchedule = jsonScheduleValue ? JSON.parse(jsonScheduleValue) : [];

    // Create an array to collect all API call promises
    const apiCalls = [];

    for (const schedule of getJsonSchedule) {
      const scheduledTime = moment(schedule.time, 'hh:mm A');
      const diffInMinutes = Math.abs(currentTime.diff(scheduledTime, 'minutes'));

      if (diffInMinutes <= 1) {
        const IP = schedule.wifi_address;
        const type = schedule.power_type === 'ON' ? 'on' : 'off';
        const num = schedule.switch.split(' ')[1];
        const url = `http://${IP}/${type}?channel=${String(num - 1)}`;

        console.log(`🕒 Matched: ${schedule.switch} -> ${schedule.power_type} at ${schedule.time}`);
        
        // Push the axios call to array (not await yet)
        apiCalls.push(
          axios.get(url)
            .then(() => console.log(`✅ Success: ${schedule.switch} toggled.`))
            .catch(err => console.log(`❌ Failed: ${schedule.switch}`, err.message))
        );
      } else {
        console.log(`⏳ Not time yet for ${schedule.switch} (scheduled: ${schedule.time})`);
      }
    }

    // Wait for all matching tasks to complete in parallel
    await Promise.all(apiCalls);

  } catch (err) {
    console.error('❌ Error in background task:', err.message);
  }
};
