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
import { AdMobInterstitial } from 'react-native-admob';
import GiftedListView from 'react-native-gifted-listview';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import timer from 'react-native-timer';

// Component
import AdmobCell from './admob';

import { config } from '../config';
import commonStyle from '../common-styles';

// Data
import { lessons } from '../data/lessons';

const LESSON_PER_SECTION = 20;

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  row: {
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    color: '#212121',
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',
    marginTop: 10,
  },
  paginationView: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
}));

export default class MainView extends Component {
  componentDidMount() {
    timer.clearTimeout(this);
    AdMobInterstitial.setAdUnitID(config.admob.ios.interstital);
    timer.setTimeout(this, 'AdMobInterstitial', () => {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd((error) => error && console.log(error)));
    }, 1000);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  onFetch(page = 1, callback, options) {
    const header = page;
    const rows = {};
    rows[header] = lessons.slice(LESSON_PER_SECTION * (page - 1), LESSON_PER_SECTION * page);

    if (LESSON_PER_SECTION * page >= lessons.length) {
      callback(rows, {
        allLoaded: true, // the end of the list is reached
      });
    } else {
      callback(rows);
    }
  }

  renderRowView(rowData) {
    return (
      <TouchableHighlight
        underlayColor="#EEEEEE"
        onPress={() => Actions.lesson(rowData)}
      >
        <View style={styles.row}>
          <Text style={styles.title}>{rowData.title}</Text>
          <Text style={styles.subtitle}>{rowData.subtitle}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderPaginationWaitingView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor="#C8C7CC"
        onPress={paginateCallback}
        style={styles.paginationView}
      >
        <View style={{ flexDirection: 'row' }}>
          <Icon name="touch-app" size={15} color="gray" />
          <Text style={{ fontSize: 13 }}>{'Load more'}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderSectionHeaderView(sectionData, sectionID) {
    console.log(sectionID);
    if (sectionID !== '1') {
      return <AdmobCell />;
    }

    return null;
  }

  renderPaginationAllLoadedView() {
    return null;
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ style: 'light-content', tintColor: '#4CAF50' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: 'white' }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('main');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <GiftedListView
          rowView={this.renderRowView}
          onFetch={this.onFetch}

          initialListSize={12}

          firstLoader={true}
          refreshable={false}

          withSections={true}
          sectionHeaderView={this.renderSectionHeaderView}

          paginationAllLoadedView={this.renderPaginationAllLoadedView}

          pagination={true}
          paginationWaitingView={this.renderPaginationWaitingView}

          refreshableTintColor="blue"
        />

        <AdmobCell />
      </View>
    );
  }
}

MainView.propTypes = {
  title: React.PropTypes.string,
};

MainView.defaultProps = {
  title: '',
};
