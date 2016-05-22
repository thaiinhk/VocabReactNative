import {
  AppRegistry,
  BackAndroid,
} from 'react-native';
import Vocab from './vocab';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';

BackAndroid.addEventListener('hardwareBackPress', () => {
  console.log(Actions);
  try {
    Actions.pop();
    return true;
  } catch (err) {
    return false;
  }
});

AppRegistry.registerComponent('Vocab', () => Vocab);
