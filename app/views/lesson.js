import React from 'react';
import {
  Dimensions,
  ListView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

// 3rd party libraries
import { Actions } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import Sound from 'react-native-sound';
import Speech from 'react-native-speech';

import { NativeAdsManager } from 'react-native-fbads';

import FbAds from './fbads';

// Component
import AdmobCell from './admob';

import commonStyle from '../common-styles';
import tracker from '../tracker';

import { config } from '../config';

const adsManager = new NativeAdsManager(config.fbads[Platform.OS].native);

const window = Dimensions.get('window');

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  block: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 20,
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    padding: 6,
    paddingLeft: 20,
    marginHorizontal: 12,
    marginVertical: 5,
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '400',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 32,
    fontWeight: '200',
  },
  taskSelectBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: (window.width / 3) - 20,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
  },
  taskSelectText: {
    fontSize: 14,
    lineHeight: 32,
    fontWeight: '200',
    marginTop: 12,
  },
  wordText: {
    fontSize: 18,
  },
  translationText: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 30,
  },
  actionButtonIcon: {
    fontSize: 20,
    fontWeight: '300',
    height: 22,
    color: 'white',
  },
}));

export default class LessonView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    };
  }

  componentDidMount() {
    this.prepareRows();
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
    tracker.trackEvent('user-action', 'play-lesson-sound', { label: pageData.word });
  }

  prepareRows() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.vocabulary),
    });
  }

  popAndAd() {
    if (Math.random() > 0.9) {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
    }
    Actions.pop();
  }

  goListening() {
    Actions.assignment({ title: this.props.title, vocabulary: this.props.vocabulary, testType: 'LISTENING' });
    tracker.trackEvent('user-action', 'start-assignment-listening', { label: this.props.title });
  }

  goMatching() {
    Actions.assignment({ title: this.props.title, vocabulary: this.props.vocabulary, testType: 'MATCHING' });
    tracker.trackEvent('user-action', 'start-assignment-matching', { label: this.props.title });
  }

  goCards() {
    Actions.card({ title: this.props.title, vocabulary: this.props.vocabulary });
    tracker.trackEvent('user-action', 'start-card', { label: this.props.title });
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
        />
      );
    }
  }

  render() {
    tracker.trackScreenView('lesson');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <ScrollView>
          <View style={{ padding: 20, paddingBottom: 0 }}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subtitle}>{this.props.entitle}</Text>
            <Text style={styles.subtitle}>{this.props.thtitle}</Text>
          </View>
          <View style={{ padding: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableHighlight underlayColor="white" style={{ flex: 1, margin: 6 }} onPress={() => this.goCards()}>
              <View style={styles.taskSelectBlock}>
                <Icon name="layers" size={28} color="#424242" />
                <Text style={styles.taskSelectText}>CARDS</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="white" style={{ flex: 1, margin: 6 }} onPress={() => this.goMatching()}>
              <View style={styles.taskSelectBlock}>
                <Icon name="assignment" size={28} color="#424242" />
                <Text style={styles.taskSelectText}>MATCHING</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight underlayColor="white" style={{ flex: 1, margin: 6 }} onPress={() => this.goListening()}>
              <View style={styles.taskSelectBlock}>
                <Icon name="hearing" size={28} color="#424242" />
                <Text style={styles.taskSelectText}>LISTENING</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={[styles.row, { paddingHorizontal: 0 }]}>
            <FbAds adsManager={adsManager} />
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={rowData => <TouchableOpacity onPress={() => this.onPlaySound(rowData)}>
              <View style={styles.row}>
                <Text style={styles.wordText}>{rowData.word}</Text>
                {(rowData.translation || rowData.entranslation) && <Text style={styles.translationText}>{rowData.translation} {rowData.entranslation}</Text>}
              </View>
            </TouchableOpacity>}
          />
        </ScrollView>
        <AdmobCell />
        <ActionButton buttonColor="#4CAF50">
          <ActionButton.Item
            buttonColor="#9B59B6"
            title="Listening test／聽力"
            onPress={() => this.goListening()}
          >
            <Icon name="hearing" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#00BCD4"
            title="Matching test／翻譯"
            onPress={() => this.goMatching()}
          >
            <Icon name="assignment" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498DB"
            title="Flash Cards／閃卡"
            onPress={() => this.goCards()}
          >
            <Icon name="layers" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

LessonView.propTypes = {
  title: React.PropTypes.string,
  entitle: React.PropTypes.string,
  thtitle: React.PropTypes.string,
  vocabulary: React.PropTypes.arrayOf(React.PropTypes.object),
};

LessonView.defaultProps = {
  title: '',
  vocabulary: [],
};
