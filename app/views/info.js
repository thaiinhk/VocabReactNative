import React, { Component } from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationBar from 'react-native-navbar';
import Share from 'react-native-share';

// Component
import AdmobCell from './admob';

import commonStyle from '../common-styles';
import tracker from '../tracker';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  container: {
    flex: 1,
    backgroundColor: '#EFEFF4',
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
}));

export default class InfoView extends Component {
  onShareApp() {
    Share.open({
      title: 'Thai Vocabulary',
      message: 'Thai Vocabulary - your best Thai learning app',
      url: 'http://onelink.to/b2p298 ',
      // subject: 'Share Link',
    }, (e) => {
      console.log(e);
    });
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ style: 'light-content', tintColor: '#4CAF50' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: 'white' }}
          rightButton={{
            title: 'Close',
            tintColor: 'white',
            handler: Actions.pop,
          }}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          navIconName="md-arrow-back"
          onIconClicked={Actions.pop}
        />
      );
    }
  }

  render() {
    tracker.trackScreenView('info');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}

        <ScrollView>
          <TableView>
            <Section header={'Info'}>
              <Cell
                cellStyle="RightDetail"
                title={'Version'}
                detail={`${DeviceInfo.getReadableVersion()}`}
              />
            </Section>

            <Section header={'Others'}>
              <Cell
                cellStyle="Basic"
                title={'Feedback'}
                onPress={() => {
                  Linking.openURL('https://goo.gl/forms/noB7jUptpyYFGdr63');
                  tracker.trackEvent('user-action', 'open-url', { label: 'open-feedback' });
                }}
              />
              <Cell
                cellStyle="Basic"
                title={'Rate us'}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('itms-apps://itunes.apple.com/app/id1116896895');
                  } else if (Platform.OS === 'android') {
                    Linking.openURL('market://details?id=com.thaiinhk.vocab');
                  }
                  tracker.trackEvent('user-action', 'open-url', { label: 'rate-us' });
                }}
              />
              <Cell
                cellStyle="Basic"
                title={'Share this cool app!'}
                onPress={() => {
                  this.onShareApp();
                  tracker.trackEvent('user-action', 'share-app');
                }}
              />
              <Cell
                cellStyle="Basic"
                title={'View more by this developer'}
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('https://itunes.apple.com/us/developer/kf-pun/id1116896894');
                  } else if (Platform.OS === 'android') {
                    Linking.openURL('https://play.google.com/store/apps/developer?id=Kf');
                  }
                  tracker.trackEvent('user-action', 'open-url', { label: 'more-by-developer' });
                }}
              />
            </Section>
          </TableView>

          <AdmobCell bannerSize="mediumRectangle" />
        </ScrollView>
      </View>
    );
  }
}

InfoView.propTypes = {
  title: React.PropTypes.string,
};

InfoView.defaultProps = {
  title: '',
};
