import React from 'react';

import {
  Platform,
} from 'react-native';

import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';

// 3rd party libraries
import { AdMobInterstitial } from 'react-native-admob';
import DeviceInfo from 'react-native-device-info';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

// Views
import MainView from './app/views/main';
import LessonView from './app/views/lesson';
import AssignmentView from './app/views/assignment';

import { config } from './app/config';

GoogleAnalytics.setTrackerId(config.googleAnalytics[Platform.OS]);

if (DeviceInfo.getDeviceName() === 'iPhone Simulator' || DeviceInfo.getManufacturer() === 'Genymotion') {
  AdMobInterstitial.setTestDeviceID('EMULATOR');
  GoogleAnalytics.setDryRun(true);
}

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = [
  'Warning: Failed propType: SceneView',
  'Possible Unhandled Promise Rejection',
  'ActivityIndicatorIOS is deprecated. Use ActivityIndicator instead.',
];

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="main" title="Vocab" component={MainView} initial={true} />
    <Scene key="lesson" title="Lesson" component={LessonView} />
    <Scene key="assignment" title="Assignment" component={AssignmentView} />
  </Scene>
);

const Periods = function Photos() {
  return <Router scenes={scenes} />;
};

export default Periods;
