import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Sound from 'react-native-sound';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import Speech from 'react-native-speech';

import commonStyle from '../common-styles';

// Component
import AdmobCell from './admob';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  block: {
    flex: 1,
    backgroundColor: 'white',
    // margin: 10,
    paddingBottom: 20,
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 120,
  },
  pronunciationText: {
    fontSize: 22,
    marginTop: 20,
  },
  translationText: {
    fontSize: 28,
  },
}));

export default class LessonView extends React.Component {
  componentDidMount() {
    Speech.supportedVoices()
      .then((locales) => {
        console.log('Supported voices', locales);  // ["ar-SA", "en-ZA", "nl-BE", "en-AU", "th-TH", ...]
      });
  }

  onActionSelected(position) {
    if (position === 0) {  // index of 'Assignment'
      Actions.assignment({ title: this.props.title, vocabulary: this.props.vocabulary });
    }
  }

  onPlaySound(pageData) {
    if (Platform.OS === 'ios') {
      Speech.speak({
        text: pageData.word,
        voice: 'th-TH',
        rate: 0.2,
      });
    } else if (Platform.OS === 'android') {
      if (pageData.sound) {
        const s = new Sound(pageData.sound, Sound.MAIN_BUNDLE, (e) => {
          if (e) {
            console.log('error', e);
          } else {
            console.log('duration', s.getDuration());
            s.play();
          }
        });
      } else {
        Speech.speak({
          text: pageData.word,
          voice: 'th_TH',
          rate: 0.2,
          forceStop: true,
        });
      }
    }
  }

  popAndAd() {
    if (Math.random() > 0.9) {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
    }
    Actions.pop();
  }

  renderPage(pageData, i) {
    return (
      <View key={i} style={styles.block}>
        <Text style={[styles.wordText, { fontSize: 120 - (7 * pageData.word.length) }]}>{pageData.word}</Text>
        {pageData.pronunciation && <Text style={styles.pronunciationText}>{`/ ${pageData.pronunciation} /`}</Text>}
        {pageData.translation && <Text style={styles.translationText}>{pageData.translation}</Text>}
        {pageData.translation && <Text style={styles.translationText}>{pageData.entranslation}</Text>}
        <TouchableOpacity onPress={() => this.onPlaySound(pageData)}>
          <Icon style={{ marginTop: 20 }} name="play-circle-filled" size={100} color="#4CAF50" />
        </TouchableOpacity>
      </View>
    );
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          statusBar={{ style: 'light-content', tintColor: '#4CAF50' }}
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title, tintColor: 'white' }}
          leftButton={
            <TouchableOpacity onPress={() => this.popAndAd()}>
              <Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
          }
          rightButton={
            <TouchableOpacity onPress={() => Actions.assignment({ title: this.props.title, vocabulary: this.props.vocabulary })}>
              <FoundationIcon
                style={styles.navigatorRightButton}
                name="clipboard-pencil"
                size={26}
                color="white"
              />
            </TouchableOpacity>
          }
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          navIconName="arrow-back"
          onIconClicked={this.popAndAd}
          style={styles.toolbar}
          title={this.props.title}
          titleColor="white"
          actions={[
            { title: 'Test', iconName: 'assignment', iconSize: 26, show: 'always' },
          ]}
          onActionSelected={position => this.onActionSelected(position)}
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('lesson');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <IndicatorViewPager
          style={{ flex: 1 }}
          indicator={<PagerDotIndicator pageCount={Math.max(this.props.vocabulary.length, 10)} />}
        >
          {this.props.vocabulary.map((object, i) => this.renderPage(object, i))}
        </IndicatorViewPager>

        <AdmobCell />
      </View>
    );
  }
}

LessonView.propTypes = {
  title: React.PropTypes.string,
  vocabulary: React.PropTypes.arrayOf(React.PropTypes.object),
};

LessonView.defaultProps = {
  title: '',
  vocabulary: [],
};
