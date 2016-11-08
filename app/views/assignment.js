import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

// 3rd party libraries
import _ from 'underscore';
import { Actions } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import Button from 'apsl-react-native-button';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
// import Share from 'react-native-share';
import Sound from 'react-native-sound';
import Speech from 'react-native-speech';
import timer from 'react-native-timer';

import commonStyle from '../common-styles';

// Component
import AdmobCell from './admob';

const styles = StyleSheet.create(Object.assign({}, commonStyle, {
  block: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    paddingBottom: 20,
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  buttonLeft: {
    flex: 1,
    height: 80,
    marginLeft: 10,
    marginRight: 5,
    borderColor: '#4DB6AC',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 3,
  },
  buttonRight: {
    flex: 1,
    height: 80,
    marginLeft: 5,
    marginRight: 10,
    borderColor: '#FFB74D',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 3,
  },
}));

export default class AssignmentView extends React.Component {
  constructor(props) {
    super(props);
    const rands = _.sample(this.props.vocabulary, 2);
    const answers = rands.map(e => e.word);
    this.state = Object.assign({}, rands[0], {
      answers,
      suffled_answers: _.shuffle(answers),
      corrent: 0,
      total: 0,
    });
  }

  componentDidMount() {
    timer.clearTimeout(this);
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
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

  getNext() {
    const rands = _.sample(this.props.vocabulary, 2);
    const answers = rands.map(e => e.word);
    this.setState(Object.assign({}, rands[0], {
      answers,
      suffled_answers: _.shuffle(answers),
      rightOrWrong: null,
    }));
    console.log(this.state);
  }

  reply(answer) {
    console.log(answer);
    if (answer === this.state.word) {
      console.log('Right');
      this.setState({
        rightOrWrong: true,
        corrent: this.state.corrent + 1,
        total: this.state.total + 1,
      });
    } else {
      console.log('Wrong');
      this.setState({
        rightOrWrong: false,
        total: this.state.total + 1,
      });
    }

    // this.getNext();
    timer.setTimeout('next', () => this.getNext(), 1000);
  }

  popAndAd() {
    if (Math.random() > 0.7) {
      AdMobInterstitial.requestAd(() => AdMobInterstitial.showAd(error => error && console.log(error)));
    }
    Actions.pop();
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
              <Icon
                style={styles.navigatorLeftButton}
                name="arrow-back"
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
        />
      );
    }
  }

  render() {
    GoogleAnalytics.trackScreenView('assignment');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={styles.block}>
          <Text style={styles.scoreText}>{this.state.corrent} / {this.state.total}</Text>
          <TouchableOpacity style={styles.center} onPress={() => this.onPlaySound(this.state)}>
            <Icon name="play-circle-filled" size={100} color="#4CAF50" />
            {this.state.rightOrWrong === true && <Icon name="check" size={60} color="#4CAF50" />}
            {this.state.rightOrWrong === false && <Icon name="close" size={60} color="#F44336" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button style={styles.buttonLeft} textStyle={{ fontSize: 24 }} onPress={() => this.reply(this.state.suffled_answers[0])} >
            {this.state.suffled_answers[0]}
          </Button>
          <Button style={styles.buttonRight} textStyle={{ fontSize: 24 }} onPress={() => this.reply(this.state.suffled_answers[1])} >
            {this.state.suffled_answers[1]}
          </Button>
        </View>

        <AdmobCell />
      </View>
    );
  }
}

AssignmentView.propTypes = {
  title: React.PropTypes.string,
  vocabulary: React.PropTypes.arrayOf(React.PropTypes.object),
};

AssignmentView.defaultProps = {
  title: '',
  vocabulary: [],
};
