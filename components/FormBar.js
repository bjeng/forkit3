import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { scale, verticalScale, moderateScale } from '../scaler.js';
import Dash from 'react-native-dash';

export default class FormBar extends React.Component {
  constructor() {
    super()
  }

  render() {
    const aTextOn = this.props.title === "Facts" ? styles.selectedText : styles.unselectedText;
    const bTextOn = this.props.title === "Friends" ? styles.selectedText : styles.unselectedText;
    const aContOn = this.props.title === "Facts" ? styles.subContainerSelected : styles.subContainer;
    const bContOn = this.props.title === "Friends" ? styles.subContainerSelected : styles.subContainer;

    return (
      <View style={styles.container}>
        <TouchableOpacity style={aContOn} onPress={() => this.props.aLink()}>
          <View><Text style={aTextOn}>Facts</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={bContOn} onPress={() => this.props.bLink()}>
            <View><Text style={bTextOn}>Friends</Text></View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: verticalScale(75),
    width: scale(375),
    backgroundColor: "#EBEBEB",
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  subContainerSelected: {
    flexDirection: 'column',
    height: verticalScale(75),
    width: scale(375/2),
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#646464'
  },
  subContainer: {
    flexDirection: 'column',
    height: verticalScale(75),
    width: scale(375/2),
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#8D8D8D'
  },
  minibarText: {
    fontFamily: 'Futura',
    color: 'white',
    fontSize: moderateScale(26),
    textAlign: 'center'
  },
  selectedText: {
    fontFamily: 'Futura',
    color: '#646464',
    fontSize: moderateScale(25),
    marginBottom: verticalScale(12)
  },
  unselectedText: {
    fontFamily: 'Futura',
    color: '#B7B7B7',
    fontSize: moderateScale(25),
    marginBottom: verticalScale(12)
  }
});
