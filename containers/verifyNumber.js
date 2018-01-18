import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Alert, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { scale, verticalScale, moderateScale } from '../scaler.js';
import { Font } from 'expo';
import axios from 'axios';
import bcrypt from 'react-native-bcrypt';
import PropTypes from 'prop-types';

class verifyNumber extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      showCode: false,
      code : '',
      email: '',
      password: '',
      first: '',
      last: '',
    };
  }

  async componentDidMount() {
    let personObj = await AsyncStorage.getItem('person');
    let person = JSON.parse(personObj);
    this.setState({
      email: person.email,
      password: person.password,
      first: person.first,
      last: person.last
    })
  }


  verify(){
    if (this.state.number.length !== 10) {
      Alert.alert('Oops', 'Please enter your 10 digit long number', {text: 'Ok'})
    } else {
      axios.get(`https://guarded-dawn-44803.herokuapp.com/platform/sendverification?number=${this.state.number}`)
      .then(response => {
        if (response.data.success) {
          Alert.alert('Awesome!', 'We sent you a verification code!', {text: 'Ok'})
          this.setState({
            showCode: true

          })
        } else {
          Alert.alert('Error', 'Something went wrong somewhere', {text: 'Ok'})
        }
      })
      .catch(e => {
        console.log(e);
      })
    }
  }

  showPhone(){
    return (
      <View style={styles.container}>
        <Image style={styles.logotext} source={require("../assets/DesktopCopy3trans.png")}/>
        <View style={styles.inputForm}>
          <View><Text>Enter 10 digit number here</Text></View>
          <View style={styles.input}>
            <Image style={styles.userIcon} source={require("../assets/username.png")}/>
            <TextInput style={styles.inputText} autoCapitalize={"none"} placeholder={'Enter Number                                   '} onChangeText={(text) => this.setState({number: text})}/>
          </View>
        </View>
        <View style={styles.buttonForm}>
          <TouchableOpacity style={styles.fbButton} onPress={() => this.verify()}>
            <Text style={styles.fbText}>Send verification code </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  showPin() {
    return (
      <View style={styles.container}>
        <Image style={styles.logotext} source={require("../assets/DesktopCopy3trans.png")}/>
        <View style={styles.inputForm}>
          <View><Text>Enter the 4 digit code you received for verification</Text></View>
          <View style={styles.input}>
            <Image style={styles.userIcon} source={require("../assets/username.png")}/>
            <TextInput style={styles.inputText} autoCapitalize={"none"} value={this.state.code} placeholder={'Enter Code                                   '} onChangeText={(text) => this.setState({code: text})}/>
          </View>
        </View>
        <View style={styles.buttonForm}>
          <TouchableOpacity style={styles.fbButton} onPress={() => this.checkPin()}>
            <Text style={styles.fbText}>Verify account</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  addUser() {
    var salt = bcrypt.genSaltSync(10);
    axios({
      method: 'POST',
      url: 'http://desolate-caverns-97737.herokuapp.com/db/insert',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        password: 'forkit.co',
        query: `insert into users(firstname, lastname, email, password, number, token) values('${this.state.first}','${this.state.last}','${this.state.email}','${this.state.password}', '+1${this.state.number}', '${bcrypt.hashSync(this.state.email, salt)}');`
      }
    })
      .then(response => {
        if (response.data.success) {
          Actions.discover();
        }
    })
      .catch(e => {
        console.log('ERROR', e);
    })
  }

  checkPin() {
    if (this.state.code.length === 4) {
      var url = `http://desolate-caverns-97737.herokuapp.com/db/query?password=forkit.co&query=select%20number,code%20from%20pin%20where%20number=%27${this.state.number}%27`
      axios.get(url)
      .then(response => {
        if (response.data.result[0].code === Number(this.state.code)) {
          var salt = bcrypt.genSaltSync(10);
          AsyncStorage.removeItem('person');
          AsyncStorage.setItem('email', JSON.stringify({
            email: this.state.email,
            type: 'regular'
            }));
          axios({
            method: 'POST',
            url: 'http://desolate-caverns-97737.herokuapp.com/db/insert',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              password: 'forkit.co',
              query: `delete from pin where number='${this.state.number}';`
            }
          })
          .then(response => {
            if (response.data.success) {
              this.addUser();
            }
          })
          .catch(e => {
            console.log('ERROR', e);
          })
        } else {
          Alert.alert('Oops', 'Code is not right', {text: 'Ok'})
        }
      })
      .catch(e => {
        console.log(e);
      })
    } else {
      Alert.alert('Oops', 'Number is not 4 digits long', {text: 'Ok'})
    }
  }

  render() {
    return (
      <LinearGradient colors={['#303F4C', '#3B4955', '#AFAFAF']} style={styles.background} location={[0.3, 0.4, 1]}>
        {this.state.showCode ? this.showPin() : this.showPhone()}
      </LinearGradient>
    );
  }
}

verifyNumber.propTypes = {
  userProfile: PropTypes.func,
};

const mapStateToProps = (state) => {
    // console.log(state);
    return {
      userInformation: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: verticalScale(700),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: verticalScale(400),
    width: scale(300),
    bottom: verticalScale(100)
  },
  logotext: {
    height: verticalScale(175),
    width: scale(250)
  },
  inputForm: {
    height: verticalScale(130),
    width: scale(300),
    justifyContent: 'space-around'
  },
  userIcon: {
    height: verticalScale(20),
    width: scale(20),
    left: scale(8)
  },
  passIcon: {
    height: verticalScale(25),
    width: scale(25),
    left: scale(5)
  },
  input: {
    height: verticalScale(45),
    width: scale(300),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 20
  },
  inputText: {
    position: 'absolute',
    fontFamily: 'Futura',
    fontSize: moderateScale(15),
    color: 'grey',
    left: scale(30)
  },
  forgetText: {
    fontSize: moderateScale(12),
    top: verticalScale(2),
    alignSelf: 'flex-end',
    color: 'white'
  },
  buttonForm: {
    top: verticalScale(40),
    height: verticalScale(125),
    width: scale(300),
    justifyContent: 'space-around'
  },
  loginButton: {
    height: verticalScale(45),
    width: scale(300),
    backgroundColor: '#192F4A',
    justifyContent: 'center',
    borderRadius: 20
  },
  loginText: {
    fontSize: moderateScale(15),
    color: 'white',
    alignSelf: 'center'
  },
  fbButton: {
    height: verticalScale(45),
    width: scale(300),
    backgroundColor: '#425BB4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row'
  },
  fbIcon: {
    height: verticalScale(20),
    width: scale(20),
    right: scale(12)
  },
  fbText: {
    fontSize: moderateScale(15),
    color: 'white',
    alignSelf: 'center'
  },
  signUp: {
    top: verticalScale(100),
  },
  signUpText: {
    fontWeight: 'bold',
    fontSize: moderateScale(12),
    alignSelf: 'center',
    color: 'white'
  }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(verifyNumber);
