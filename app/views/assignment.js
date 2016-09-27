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
import Button from 'apsl-react-native-button';
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
// import Share from 'react-native-share';
import Sound from 'react-native-sound';
import Speech from 'react-native-speech';
import timer from 'react-native-timer';

// Component
import AdmobCell from './admob';

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
  scoreText: {
    fontSize: 18,
    margin: 10,
    textAlign: 'center',
  },
  buttonLeft: {
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    borderColor: '#4DB6AC',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 3,
  },
  buttonRight: {
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    borderColor: '#FFB74D',
    backgroundColor: 'white',
    borderRadius: 0,
    borderWidth: 3,
  },
});

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
    } else {
      // AndroidSpeech.speak({
      //   text: 'this is ระฆัง',
      //   pitch: 1.5,
      //   forceStop : false,
      //   language : 'th-TH',
      // });

      const s = new Sound(pageData.sound, Sound.MAIN_BUNDLE, (e) => {
        if (e) {
          console.log('error', e);
        } else {
          console.log('duration', s.getDuration());
          s.play();
        }
      });
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
        corrent: ++this.state.corrent,
        total: ++this.state.total,
      });
    } else {
      console.log('Wrong');
      this.setState({
        rightOrWrong: false,
        total: ++this.state.total,
      });
    }

    // this.getNext();
    timer.setTimeout('next', () => this.getNext(), 1200);
  }

  renderToolbar() {
    if (Platform.OS === 'ios') {
      return (
        <NavigationBar
          style={styles.navigatorBarIOS}
          title={{ title: this.props.title }}
          leftButton={<Icon style={styles.navigatorLeftButton} name="arrow-back" size={26} color="gray" onPress={() => Actions.pop()} />}
        />
      );
    } else if (Platform.OS === 'android') {
      return (
        <Icon.ToolbarAndroid
          navIconName="arrow-back"
          onIconClicked={Actions.pop}
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
            <Icon name="play-circle-outline" size={120} color="gray" />
            {this.state.rightOrWrong === true && <Icon name="check" size={60} color="#4CAF50" />}
            {this.state.rightOrWrong === false && <Icon name="close" size={60} color="#F44336" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button style={styles.buttonLeft} textStyle={{ fontSize: 22 }} onPress={() => this.reply(this.state.suffled_answers[0])} >
            {this.state.suffled_answers[0]}
          </Button>
          <Button style={styles.buttonRight} textStyle={{ fontSize: 22 }} onPress={() => this.reply(this.state.suffled_answers[1])} >
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
