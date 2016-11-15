import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import GiftedListView from 'react-native-gifted-listview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import timer from 'react-native-timer';

// Component
import AdmobCell from './admob';

import commonStyle from '../common-styles';
import tracker from '../tracker';

// Data
import { lessons } from '../data/lessons';

const LESSON_PER_SECTION = 20;

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  row: {
    padding: 15,
    paddingLeft: 20,
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
    timer.setTimeout(this, 'AdMobInterstitial', () => {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
    }, 1000);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Info'
      Actions.info();
    }
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
        underlayColor="#F1F8E9"
        onPress={() => {
          Actions.lesson(rowData);
          tracker.trackEvent('user-action', 'open-lesson', { label: rowData.title });
        }}
      >
        <View style={styles.row}>
          <Text style={styles.title}>{rowData.title}</Text>
          <Text style={styles.subtitle}>{rowData.entitle}</Text>
          <Text style={styles.subtitle}>{rowData.thtitle}</Text>
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
          rightButton={
            <TouchableOpacity onPress={Actions.info}>
              <Icon style={styles.navigatorRightButton} name="info" size={26} color="white" />
            </TouchableOpacity>
          }
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            { title: 'Info', iconName: 'info', iconSize: 26, show: 'always' },
          ]}
          onActionSelected={position => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    tracker.trackScreenView('main');
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
