import { StyleSheet } from 'react-native';

export default {
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  navigatorBarIOS: {
    backgroundColor: '#4CAF50',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#388E3C',
  },
  navigatorLeftButton: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 50,
  },
  navigatorRightButton: {
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 10,
  },
  toolbar: {
    height: 56,
    backgroundColor: '#4CAF50',
    elevation: 10,
  },
};
