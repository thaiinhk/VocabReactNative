import React, { Component } from 'react';
import {
  Actions,
  Router,
  Scene,
} from 'react-native-router-flux';

// 3rd party libraries
import GoogleAnalytics from 'react-native-google-analytics-bridge';

import {config} from './app/config';
GoogleAnalytics.setTrackerId(config.trackerId);

// Views
import Main from './app/views/main';
import Lesson from './app/views/lesson';

// @todo remove when RN upstream is fixed
console.ignoredYellowBox = ['Warning: Failed propType: SceneView'];

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="main" title="Vocab" component={Main} initial={true} />
    <Scene key="lesson" title="Lesson" component={Lesson} />
  </Scene>
);

export default class Periods extends Component {
  render() {
    return <Router scenes={scenes} />;
  }
}
