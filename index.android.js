import {
  AppRegistry,
  BackAndroid,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';

import Vocab from './vocab';

BackAndroid.addEventListener('hardwareBackPress', () => {
  try {
    Actions.pop();
    return true;
  } catch (err) {
    return false;
  }
});

AppRegistry.registerComponent('Vocab', () => Vocab);
