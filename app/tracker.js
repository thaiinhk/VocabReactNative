import {
  Platform,
} from 'react-native';

import { Answers, Crashlytics } from 'react-native-fabric';
import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
import DeviceInfo from 'react-native-device-info';

import { config } from './config';

if (DeviceInfo.isEmulator()) {
  GoogleAnalyticsSettings.setDryRun(true);
}

Crashlytics.setUserName(DeviceInfo.getDeviceName());
Crashlytics.setUserIdentifier(DeviceInfo.getUniqueID());

const gaTracker = new GoogleAnalyticsTracker(config.googleAnalytics[Platform.OS]);
const tracker = {
  trackScreenView: (screen) => {
    gaTracker.trackScreenView(screen);
  },
  trackEvent: (eventCategory, eventName, parameters = {}) => {
    gaTracker.trackEvent(eventCategory, eventName, parameters);
    Answers.logCustom(eventName, { category: eventCategory, ...parameters });
  },
};
export default tracker;
