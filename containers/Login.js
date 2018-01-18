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

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  async componentWillMount() {
    let emailObj = await AsyncStorage.getItem('email');
    let email = JSON.parse(emailObj);
    var userObj = {};
    if (email) {
      if (email.type === 'regular') {
        axios.get(`http://desolate-caverns-97737.herokuapp.com/db/query?password=forkit.co&query=select%20*%20from%20users%20where%20email='${email.email}'`)
        .then(resp => {
          if (resp.data) {
            if (bcrypt.compareSync(email.email, resp.data.result[0].token)) {
              userObj = {firstname: resp.data.result[0].firstname, lastname: resp.data.result[0].lastname, email: resp.data.result[0].email, friends: resp.data.result[0].friends, forks: resp.data.result[0].forks, wishlist: resp.data.result[0].wishlist, os: resp.data.result[0].os, number: resp.data.result[0].number, id: resp.data.result[0].id};
              this.props.userProfile(userObj);
              Actions.discover();
            }
          }
        })
        .catch(e => console.log(e))
      }
      if (email.type === 'facebook') {
        axios.get(`https://guarded-dawn-44803.herokuapp.com/db/search?password=$BIG_SHAQ103$&tableName=users&fields=token,email,firstname,lastname,friends,forks,wishlist,os&conditions=email='${email.email}'`)
        .then(resp => {
          if (bcrypt.compareSync(email.email, resp.data.result[0].token)) {
            userObj = {firstname: resp.data.result[0].firstname, lastname: resp.data.result[0].lastname, email: resp.data.result[0].email, friends: resp.data.result[0].friends, forks: resp.data.result[0].forks, wishlist: resp.data.result[0].wishlist, os: resp.data.result[0].os};
            this.props.userProfile(userObj);
            Actions.discover();
          }
        })
        .catch(e => console.log(e))
      }
    }
  }

  // See when the result.length is 0
  login(ev) {
    ev.preventDefault();

    var userObj = {};

    axios.get(`http://desolate-caverns-97737.herokuapp.com/db/query?password=forkit.co&query=select%20*%20from%20users%20where%20email='${this.state.email}'`)
    .then(resp => {
      if (resp.data.result.length > 0) {
        if (bcrypt.compareSync(this.state.password, resp.data.result[0].password)) {
          userObj = {firstname: resp.data.result[0].firstname, lastname: resp.data.result[0].lastname, email: resp.data.result[0].email, friends: resp.data.result[0].friends, forks: resp.data.result[0].forks, wishlist: resp.data.result[0].wishlist, os: resp.data.result[0].os};
          this.props.userProfile(userObj);
          AsyncStorage.setItem('email', JSON.stringify({
            email: this.state.email,
            type: 'regular'
            }));
          Actions.discover();
        } else {
          Alert.alert('Error', 'We don\'t recognize this combination! Please try again', {text: 'Ok'})
        }
      } else {
        Alert.alert('Error', 'We don\'t recognize this combination! Please try again', {text: 'Ok'})
      }
    })
    .catch(e => {
      console.log('ERROR', e);
    })
  }

  async facebookLogin() {
    var userObj = {};
    const {
      type,
      token,
    } = await Expo.Facebook.logInWithReadPermissionsAsync('288424861584897', {
      permissions: ['public_profile', 'email'],
    });

    if (type === 'success') {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=email,last_name,first_name,picture,gender,locale,timezone,verified&access_token=${token}`
      );
      var userData = await response.json();
      // console.log(userData.id);
      // axios.get(`https://guarded-dawn-44803.herokuapp.com/db/search?password=$BIG_SHAQ103$&tableName=users&fields=id&conditions=id=${userData.id}`)
      // .then((resp) => {
        // console.log('Resp is ', resp.data);
        // if (resp.data.result.length > 0) {
        //   console.log('Found it!!!!!!!');
        //   Actions.discover();
        // } else {
        //   axios({
        //     method: 'POST',
        //     url: 'https://guarded-dawn-44803.herokuapp.com/db/insertrows',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     data: {
        //       password: '$BIG_SHAQ102$',
        //       tableName: 'users',
        //       params: `{"id":${userData.id}, "firstname": "${userData.first_name}", "lastname":"${userData.last_name}","email":"${userData.email}"}`
        //     }
        //   })
        //   .then(response => {
        //     console.log('Success')
        //     Actions.discover();
        //   })
        // }
      // })
      // .catch(e => {
      //   console.log('ERROR', e);
      // })

      // console.log(userData.id);
      axios.get(`https://guarded-dawn-44803.herokuapp.com/db/search?password=$BIG_SHAQ103$&tableName=users&fields=email,password,firstname,lastname,friends,forks,wishlist,os&conditions=fb_id='${userData.id}'`)
      .then(resp => {
        if (resp.data.result.length > 0) {
          AsyncStorage.setItem('email', JSON.stringify({
            email: `fb${userData.email}`,
            type: 'facebook'
            }));
          userObj = {firstname: resp.data.result[0].firstname, lastname: resp.data.result[0].lastname, email: resp.data.result[0].email, friends: resp.data.result[0].friends, forks: resp.data.result[0].forks, wishlist: resp.data.result[0].wishlist, os: resp.data.result[0].os};
          this.props.userProfile(userObj);
          // console.log(this.props.userInformation);
          Actions.discover();
        } else {
          var salt = bcrypt.genSaltSync(10);
          var token = bcrypt.hashSync(`fb${userData.email}`, salt);

          axios({
            method: 'POST',
            url: 'https://guarded-dawn-44803.herokuapp.com/db/insertrows',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              password: '$BIG_SHAQ102$',
              tableName: 'users',
              params: `{"fb_id":"${userData.id}", "firstname":"${userData.first_name}","lastname":"${userData.last_name}","email":"fb${userData.email}","password":"${userData.id}","token":"${token}"}`
            }
          })
          .then(response => {
            AsyncStorage.setItem('email', JSON.stringify({
              email: `fb${userData.email}`,
              type: 'facebook'
              }));
              userObj = {firstname: userData.first_name, lastname: userData.last_name, email: userData.email, friends: '', forks: '', wishlist: '', os: ''};
              this.props.userProfile(userObj);
              console.log(this.props.userInformation);
            Actions.discover();
          })
        }
      })
      .catch(e => console.log(e))
    }
  }

  render() {
    return (
      <LinearGradient colors={['#303F4C', '#3B4955', '#AFAFAF']} style={styles.background} location={[0.3, 0.4, 1]}>
        <View style={styles.container}>
          <Image style={styles.logotext} source={require("../assets/DesktopCopy3trans.png")}/>
          <View style={styles.inputForm}>
            <View style={styles.input}>
              <Image style={styles.userIcon} source={require("../assets/username.png")}/>
              <TextInput style={styles.inputText} autoCapitalize={"none"} placeholder={'Email                                   '} onChangeText={(text) => this.setState({email: text})}/>
            </View>
            <View style={styles.input}>
              <Image style={styles.passIcon} source={require("../assets/password.png")}/>
              <TextInput style={styles.inputText} secureTextEntry={true} placeholder={'Password                                '} onChangeText={(text) => this.setState({password: text})}/>
            </View>
            <TouchableOpacity onPress={Actions.forgot}>
              <Text style={styles.forgetText}>Forget Your Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonForm}>
            <TouchableOpacity style={styles.loginButton} onPress={(ev) => {this.login(ev)}}>
              <Text style={styles.loginText}> SIGN IN </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fbButton} onPress={() => this.facebookLogin()}>
              <Image style={styles.fbIcon} source={require("../assets/fb.png")}/>
              <Text style={styles.fbText}> LOGIN WITH FACEBOOK </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.signUp} onPress={Actions.register}>
            <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }
}

Login.propTypes = {
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
      userProfile: (user) => dispatch({type: 'ADD_USER', info: user})
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
)(Login);
