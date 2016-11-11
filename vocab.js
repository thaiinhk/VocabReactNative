import React from 'react';

import {
  Platform,
} from 'react-native';

// 3rd party libraries
import { Actions, Router, Scene } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import DeviceInfo from 'react-native-device-info';

// Views
import MainView from './app/views/main';
import LessonView from './app/views/lesson';
import CardView from './app/views/card';
import AssignmentView from './app/views/assignment';
import InfoView from './app/views/info';

import { config } from './app/config';

AdMobInterstitial.setAdUnitID(config.admob[Platform.OS].interstital);

if (DeviceInfo.getDeviceName() === 'iPhone Simulator' || DeviceInfo.getManufacturer() === 'Genymotion') {
  AdMobInterstitial.setTestDeviceID('EMULATOR');
}

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = [
  'Warning: Failed propType: SceneView',
  'Possible Unhandled Promise Rejection',
  'ActivityIndicatorIOS is deprecated. Use ActivityIndicator instead.',
  'Each ViewPager child must be a <View>.',
];

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="main" title="Vocab" component={MainView} initial={true} />
    <Scene key="lesson" title="Lesson" component={LessonView} />
    <Scene key="card" title="Card" component={CardView} direction="vertical" />
    <Scene key="assignment" title="Assignment" component={AssignmentView} direction="vertical" />
    <Scene key="info" title="Info" component={InfoView} direction="vertical" />
  </Scene>
);

const Periods = function Photos() {
  return <Router scenes={scenes} />;
};

export default Periods;
