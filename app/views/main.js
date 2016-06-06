import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobBanner } from 'react-native-admob';
import GiftedListView from 'react-native-gifted-listview';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';

import {config} from '../config';

// Data
import {lessons} from '../data/lessons';

const LESSON_PER_SECTION = 8;

export default class Main extends React.Component {
  _onFetch(page = 1, callback, options) {
    var header = page;
    var rows = {};
    rows[header] = lessons.slice(LESSON_PER_SECTION * (page - 1), LESSON_PER_SECTION * page);

    if (LESSON_PER_SECTION * page >= lessons.length) {
      callback(rows, {
        allLoaded: true, // the end of the list is reached
      });
    } else {
      callback(rows);
    }
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

  _renderPaginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor="#C8C7CC"
        onPress={paginateCallback}
        style={styles.paginationView}
      >
        <View style={{flexDirection: 'row'}}>
          <Icon name="touch-app" size={15} color="gray"/>
          <Text style={{fontSize: 13}}>{'Load more'}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  _renderSectionHeaderView(sectionData, sectionID) {
    console.log(sectionID);
    if (sectionID !== '1') {
      return (
        <View>
          {Platform.OS === 'android' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.android} />}
          {Platform.OS === 'ios' && <AdMobBanner bannerSize={"smartBannerPortrait"} adUnitID={config.adUnitID.ios} />}
        </View>
      );
    } else {
      return null;
    }
  }

  _renderPaginationAllLoadedView() {
    return null;
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

          initialListSize={12}

          firstLoader={true}
          refreshable={false}

          withSections={true}
          sectionHeaderView={this._renderSectionHeaderView}

          paginationAllLoadedView={this._renderPaginationAllLoadedView}

          pagination={true}
          paginationWaitingView={this._renderPaginationWaitingView}

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
  paginationView: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
