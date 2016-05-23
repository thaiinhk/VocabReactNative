import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import GoogleAnalytics from 'react-native-google-analytics-bridge';

// Data
import {lessons} from '../data/lessons';

export default class Main extends Component {
  _onFetch(page = 1, callback, options) {
    setTimeout(() => {
      var rows = lessons;

      if (page === 3) {
        callback(rows, {
          allLoaded: true, // the end of the list is reached
        });
      } else {
        callback(rows);
      }
    }, 500);
  }

  _renderRowView(rowData) {
    return (
      <TouchableHighlight
        style={styles.row}
        underlayColor="#EEEEEE"
        onPress={() => Actions.lesson(rowData)}
      >
        <Text>{rowData.title}</Text>
      </TouchableHighlight>
    );
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title}}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white" />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('main');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <GiftedListView
          rowView={this._renderRowView}
          onFetch={this._onFetch}
          firstLoader={true}
          pagination={false}
          refreshable={false}
          withSections={false}
          customStyles={{
            paginationView: {
              backgroundColor: '#eee',
            },
          }}

          refreshableTintColor="blue"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  navigatorBarIOS: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#4CAF50',
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
  },
  row: {
    height: 50,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    borderBottomColor: '#E0E0E0',
    backgroundColor: 'white',
  },
});
