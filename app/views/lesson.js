import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobBanner } from 'react-native-admob';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Sound from 'react-native-sound';
import ViewPager from 'react-native-viewpager';
// import Share from 'react-native-share';

import {config} from '../config';

export default class SettingsView extends Component {
  constructor(props) {
    var dataSource = new ViewPager.DataSource({
      pageHasChanged: (p1, p2) => p1 !== p2,
    });

    super(props);

    this.state = {
      dataSource: dataSource.cloneWithPages(this.props.vocabulary),
    };
  }

  onShare(pageData) {
    // Share.open({
    //   share_text: pageData.word + ' ' + pageData.pronunciation + ' ' + pageData.translation,
    //   title: pageData.word,
    // }, function(e) {
    //   console.log(e);
    // });
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Share'
      this.onShare();
    }
  }

  onPlaySound(sound) {
    var s = new Sound(sound, Sound.MAIN_BUNDLE, (e) => {
      if (e) {
        console.log('error', e);
      } else {
        console.log('duration', s.getDuration());
        s.play();
      }
    });
  }

  _renderPage(pageData) {
    return (
      <View style={styles.block}>
        <TouchableOpacity style={styles.center} onPress={() => this.onPlaySound(pageData.sound)}>
          <Text style={styles.wordText}>{pageData.word}</Text>
          {pageData.pronunciation && <Text style={styles.pronunciationText}>{'/ ' + pageData.pronunciation + ' /'}</Text>}
          {pageData.translation && <Text style={styles.translationText}>{pageData.translation}</Text>}
        </TouchableOpacity>
      </View>
    );
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{title: this.props.title}}
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="gray" onPress={() => Actions.pop()} />}
          // rightButton={<Icon style={styles.navigatorRightButton} name="share" size={26} color="gray" onPress={() => this.onShare()} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          navIconName="arrow-back"
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          // actions={[
          //   {title: "Share", iconName: 'share', iconSize: 26, show: 'always'},
          // ]}
          // onActionSelected={(position) => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('lesson');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ViewPager
          dataSource={this.state.dataSource}
          renderPage={(pageData) => this._renderPage(pageData)}/>

        {Platform.OS === 'android' && <AdMobBanner bannerSize={"fullBanner"} adUnitID={config.adUnitID.android} />}
        {Platform.OS === 'ios' && <AdMobBanner bannerSize={"fullBanner"} adUnitID={config.adUnitID.ios} />}
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
  block: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 20,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 120,
  },
  pronunciationText: {
    fontSize: 25,
  },
  translationText: {
    fontSize: 30,
  },
});
