import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { withNativeAd } from 'react-native-fbads';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 5,
    justifyContent: 'center',
    borderRightWidth: StyleSheet.hairlineWidth * 2,
    borderRightColor: '#CCCCCC',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#CCCCCC',
    backgroundColor: 'white',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 5,
    marginTop: 5,
  },
  action: {
    color: 'white',
    fontSize: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    opacity: 0.8,
  },
});

class FbAds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHide: false,
    };
  }

  render() {
    if (this.state.isHide) {
      return null;
    }

    return (
      <View style={styles.container}>
        {!this.props.nativeAd.icon && (
          <View style={styles.button}>
            <Text style={styles.action}>{this.props.nativeAd.callToActionText}</Text>
          </View>
        )}
        <View style={{ flex: 1, padding: 8 }}>
          <Text style={styles.title}>{this.props.nativeAd.title}</Text>
          {this.props.nativeAd.subtitle && (
            <Text style={styles.subtitle}>{this.props.nativeAd.subtitle}</Text>
          )}
          {/* this.props.nativeAd.description && (
            <Text style={styles.description}>{this.props.nativeAd.description}</Text>
          ) */}
        </View>
        {this.props.nativeAd.icon && (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image style={styles.icon} source={{ uri: this.props.nativeAd.icon }} />
            <View style={styles.button}>
              <Text style={styles.action}>{this.props.nativeAd.callToActionText}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default withNativeAd(FbAds);

FbAds.propTypes = {
  nativeAd: React.PropTypes.object,
};

FbAds.defaultProps = {
  nativeAd: {},
};
