/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import { startBackgroundTask } from './screens/BackgroundNewTask'
import { startBackgroundTasking } from './screens/BackgroundTasking';


AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerHeadlessTask('MyBackgroundTask', () => startBackgroundTask);
AppRegistry.registerHeadlessTask('MyBackgroundTask', () => startBackgroundTasking);
