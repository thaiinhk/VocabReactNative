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
import * as Animatable from 'react-native-animatable';
import { Actions } from 'react-native-router-flux';
import { AdMobInterstitial } from 'react-native-admob';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
// import Share from 'react-native-share';
import Sound from 'react-native-sound';
import Speech from 'react-native-speech';
import timer from 'react-native-timer';

// Component
import AdBanner from './ad-banner';

import commonStyle from '../common-styles';
import tracker from '../tracker';

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
    flexDirection: 'column',
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
    flexDirection: 'column',
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

    this.state = {
      corrent: 0,
      total: 0,
    };
  }

  componentDidMount() {
    timer.clearTimeout(this);
    this.getNext();
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
    if (this.props.testType === 'MATCHING') {
      tracker.trackEvent('user-action', 'play-assignment-matching-sound', { label: pageData.word });
    } else {
      tracker.trackEvent('user-action', 'play-assignment-listening-sound', { label: pageData.word });
    }
  }

  getNext() {
    const answers = _.sample(this.props.vocabulary, 2);
    this.setState(Object.assign({}, answers[0], {
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

      if (this.props.testType === 'MATCHING') {
        tracker.trackEvent('user-action', 'answer-assignment-matching', { label: 'correct' });
      } else {
        tracker.trackEvent('user-action', 'answer-assignment-listening', { label: 'correct' });
      }
    } else {
      console.log('Wrong');
      this.setState({
        rightOrWrong: false,
        total: this.state.total + 1,
      });

      if (this.props.testType === 'MATCHING') {
        tracker.trackEvent('user-action', 'answer-assignment-matching', { label: 'incorrect' });
      } else {
        tracker.trackEvent('user-action', 'answer-assignment-listening', { label: 'incorrect' });
      }
    }

    // this.getNext();
    timer.setTimeout(this, 'next', () => this.getNext(), 500);
  }

  popAndAd() {
    if (Math.random() > 0.95) {
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
              <Icon style={styles.navigatorLeftButton} name="close" size={26} color="white" />
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
    if (this.props.testType === 'MATCHING') {
      tracker.trackScreenView('assignment-matching');

      return (
        <View style={styles.container}>
          {this.renderToolbar()}
          <View style={styles.block}>
            <Text style={styles.scoreText}>{this.state.corrent} / {this.state.total}</Text>
            <TouchableOpacity style={styles.center} onPress={() => this.onPlaySound(this.state)}>
              <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                {this.state.word && <Text style={{ fontSize: 120 - (6 * this.state.word.length) }}>{this.state.word}</Text>}
              </View>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {this.state.rightOrWrong === true && <Animatable.View animation="fadeOut" duration={500}><Icon name="check" size={80} color="#4CAF50" /></Animatable.View>}
                {this.state.rightOrWrong === false && <Animatable.View animation="fadeOut" duration={500}><Icon name="close" size={80} color="#F44336" /></Animatable.View>}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {this.state.suffled_answers && <Button style={styles.buttonLeft} textStyle={{ fontSize: 24 }} onPress={() => this.reply(this.state.suffled_answers[0].word)} >
              {this.state.suffled_answers[0].translation && <Text style={{ textAlign: 'center', fontSize: 18 }}>{this.state.suffled_answers[0].translation}</Text>}
              {this.state.suffled_answers[0].entranslation && <Text style={{ textAlign: 'center', fontSize: 18 }}>{this.state.suffled_answers[0].entranslation}</Text>}
            </Button>}
            {this.state.suffled_answers && <Button style={styles.buttonRight} textStyle={{ fontSize: 24 }} onPress={() => this.reply(this.state.suffled_answers[1].word)} >
              {this.state.suffled_answers[1].translation && <Text style={{ textAlign: 'center', fontSize: 18 }}>{this.state.suffled_answers[1].translation}</Text>}
              {this.state.suffled_answers[1].entranslation && <Text style={{ textAlign: 'center', fontSize: 18 }}>{this.state.suffled_answers[1].entranslation}</Text>}
            </Button>}
          </View>
          <AdBanner />
        </View>
      );
    }

    tracker.trackScreenView('assignment-listening');
    return (
      <View style={styles.container}>
        {this.renderToolbar()}
        <View style={styles.block}>
          <Text style={styles.scoreText}>{this.state.corrent} / {this.state.total}</Text>
          <TouchableOpacity style={styles.center} onPress={() => this.onPlaySound(this.state)}>
            <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="play-circle-filled" size={100} color="#4CAF50" />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {this.state.rightOrWrong === true && <Animatable.View animation="fadeOut" duration={500}><Icon name="check" size={80} color="#4CAF50" /></Animatable.View>}
              {this.state.rightOrWrong === false && <Animatable.View animation="fadeOut" duration={500}><Icon name="close" size={80} color="#F44336" /></Animatable.View>}
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {this.state.suffled_answers && <Button style={styles.buttonLeft} textStyle={{ fontSize: 24 }} onPress={() => this.reply(this.state.suffled_answers[0].word)} >
            {this.state.suffled_answers[0].word}
          </Button>}
          {this.state.suffled_answers && <Button style={styles.buttonRight} textStyle={{ fontSize: 24 }} onPress={() => this.reply(this.state.suffled_answers[1].word)} >
            {this.state.suffled_answers[1].word}
          </Button>}
        </View>
        <AdBanner />
      </View>
    );
  }
}

AssignmentView.propTypes = {
  title: React.PropTypes.string,
  vocabulary: React.PropTypes.arrayOf(React.PropTypes.object),
  testType: React.PropTypes.string,
};

AssignmentView.defaultProps = {
  title: '',
  vocabulary: [],
  testType: 'MATCHING',
};
