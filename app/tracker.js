import {
  Platform,
} from 'react-native';

// 3rd party libraries
import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
import DeviceInfo from 'react-native-device-info';

import { config } from './config';

if (DeviceInfo.getDeviceName() === 'iPhone Simulator' || DeviceInfo.getDeviceName() === 'apple’s MacBook Pro' || DeviceInfo.getManufacturer() === 'Genymotion') {
  // GoogleAnalyticsSettings.setDryRun(true);
}

const tracker = new GoogleAnalyticsTracker(config.googleAnalytics[Platform.OS]);
export default tracker;
