import React from 'react';

import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

// 3rd party libraries
import { AdMobBanner } from 'react-native-admob';
import timer from 'react-native-timer';

import { config } from '../config';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default class AdmobCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    if (this.props.isForceRefresh) {
      timer.setInterval(this, 'adRefresh', () => this.setState({ adRefresh: Math.random() }), this.props.refreshInterval);
    }
  }

  componentWillUnmount() {
    timer.clearInterval(this);
  }

  render() {
    return (
      <View style={[styles.container, { margin: this.props.margin }]}>
        <AdMobBanner key={this.state.adRefresh} bannerSize={this.props.bannerSize} adUnitID={config.admob[Platform.OS].banner} />
      </View>
    );
  }
}

AdmobCell.propTypes = {
  margin: React.PropTypes.number,
  bannerSize: React.PropTypes.string,
  isForceRefresh: React.PropTypes.bool,
  refreshInterval: React.PropTypes.number,
};

AdmobCell.defaultProps = {
  margin: 0,
  bannerSize: 'smartBannerPortrait',
  isForceRefresh: true,
  refreshInterval: 30000,
};
