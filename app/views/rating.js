import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import * as StoreReview from 'react-native-store-review';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import store from 'react-native-simple-store';
import timer from 'react-native-timer';

import tracker from '../tracker';

const STARS_TO_APP_STORE = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingLeft: 20,
    marginHorizontal: 12,
    marginVertical: 5,
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  button: {
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#3B5998',
    borderRadius: 2,
  },
  text: {
    color: 'white',
    fontSize: 14,
  },
  close: {
    position: 'absolute',
    top: 6,
    right: 10,
  },
});

export default class Rating extends React.Component {
  static openFeedbackUrl() {
    const url = 'https://goo.gl/forms/LebZHLZK33CxAkSz1';
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      starCount: 0,
      isRatingGiven: false,
    };
  }

  componentDidMount() {
    const that = this;
    store.get('isRatingGiven').then((isRatingGiven) => {
      if (isRatingGiven) {
        that.setState({ isRatingGiven });
      }
    });

    timer.setTimeout(this, 'rating', () => this.setState({ isRatingShow: true }), 4 * 60 * 1000);
  }

  componentWillUnmount() {
    timer.clearInterval(this);
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });

    if (rating >= STARS_TO_APP_STORE) {
      if (StoreReview.isAvailable) {
        StoreReview.requestReview();
      } else if (Platform.OS === 'ios') {
        Linking.openURL('itms-apps://itunes.apple.com/app/id1116896895');
      } else if (Platform.OS === 'android') {
        Linking.openURL('market://details?id=com.kfpun.vocab');
      }
    }

    store.save('isRatingGiven', true);

    timer.setTimeout(this, 'hideRating', () => this.setState({ isRatingGiven: true }), 5 * 1000);
    tracker.trackEvent('user-action', 'give-rating', { label: rating.toString() });
  }

  render() {
    if (this.state.isRatingShow && !this.state.isRatingGiven) {
      return (<Animatable.View style={styles.container} animation="fadeIn">
        <Icon name="thumb-up" size={28} color="#616161" />
        <Text style={{ fontSize: 12, lineHeight: 30 }}>{'喜歡我們的應用程序嗎？給 5 顆星鼓勵我們吧'}</Text>
        <Text style={{ fontSize: 12, lineHeight: 20 }}>{'Please give us 5 stars if you like this application'}</Text>
        <StarRating
          starSize={32}
          rating={this.state.starCount}
          selectedStar={rating => this.onStarRatingPress(rating)}
        />
        {this.state.starCount > 0
        && this.state.starCount < STARS_TO_APP_STORE
        && <TouchableOpacity onPress={() => Rating.openFeedbackUrl()}>
          <Animatable.View style={styles.button} animation="fadeIn">
            <Text style={styles.text}>{'你能給我一些建議嗎？'}</Text>
            <Text style={styles.text}>{'Give us some feedback'}</Text>
          </Animatable.View>
        </TouchableOpacity>}
      </Animatable.View>);
    }

    return null;
  }
}
