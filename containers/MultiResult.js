import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { scale, verticalScale, moderateScale } from '../scaler.js';
import Navbar from '../components/Navbar.js';
import axios from 'axios';
import PropTypes from 'prop-types';

class MultiResult extends Component{
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  handleResult() {
    axios.get(`http://localhost:3000/yelp/multiyelp?meal=${this.props.final.meal}&date=${this.props.final.date}&group=${this.props.final.group_id}&host=${this.props.final.host_id}&radius=${this.props.final.radius}&latitude=${this.props.status.location.latitude}&longitude=${this.props.status.location.longitude}&price=${this.props.final.price}`)
    .then(response => {
      if (response.data.success) {
        console.log(response.data.restaurant);
        this.props.finalDecision(response.data.restaurant);
        axios({
          method: 'POST',
          url: 'http://localhost:3000/db/101_super_duper_secret_101',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            password: '$BIG_SHAQ101$',
            type: 'search',
            query: `update group_event set yelp_id = '${response.data.restaurant.id}' where id = '${this.props.status.group_id}'`
          }
        })
        Actions.singleresult();
      }
    })
    .catch(e => {
      console.log(e);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <Image style={styles.backgroundColor} source={require("../assets/Discover.png")}/>
          <TouchableOpacity onPress={() => this.handleResult()}><Text>Result</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}

MultiResult.propTypes = {
  openTable: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
      final: state.finalMulti,
      status: state.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
      finalDecision: (result) => dispatch({type: 'SINGLE_RESULT', result: result})
    };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  background: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    height: verticalScale(667-50),
    width: scale(375)
  },
  backgroundColor: {
    top: verticalScale(0),
    position: 'absolute',
    height: verticalScale(667/2),
    width: scale(375),
    opacity: 0.3
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    width: scale(375),
    padding: scale(12)
  },
  detailsContainer: {
    flex: 3,
    width: scale(375/2),
    flexDirection: 'row'
  },
  mapContainer: {
    flex: 7,
    width: scale(375),
    justifyContent: 'center',
    alignItems: 'center'
  },
  nameContainer: {
    flex: 1,
    width: scale(375),
    paddingLeft: scale(15),
    bottom: verticalScale(5),
    alignItems: 'flex-start'
  },
  forkContainer: {
    flex: 2,
    width: scale(375)
  },
  star: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  left: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingLeft: scale(15),
  },
  right: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  leftAction: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  rightAction: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: scale(10)
  },
  details: {
    flex: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  yelp: {
    width: scale(50),
    height: verticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32323',
    borderRadius: moderateScale(25),
    margin: moderateScale(2)
  },
  openTable: {
    width: scale(50),
    height: verticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: moderateScale(25),
    margin: moderateScale(2)
  },
  call: {
    width: scale(50),
    height: verticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: moderateScale(25),
    margin: moderateScale(2)
  },
  textStyle: {
    fontSize: moderateScale(18),
    fontFamily: 'Futura',
    color: '#646464'
  },
  detailText: {
    fontSize: moderateScale(16),
    fontFamily: 'Futura',
    color: '#646464'
  },
  backText: {
    fontFamily: 'Futura',
    color: '#646464',
    fontSize: moderateScale(18)
  },
  nameText: {
    fontSize: moderateScale(25),
    fontFamily: 'Futura',
    color: '#646464',
  },
  yelpIcon: {
    height: verticalScale(16),
    width: scale(40),
  },
  openTableIcon: {
    height: verticalScale(20),
    width: scale(45),
  },
  phoneIcon: {
    height: verticalScale(25),
    width: scale(19)
  },
  forkit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#00042E",
  },
  logoText: {
    height: verticalScale(90),
    width: scale(275),
    bottom: verticalScale(5)
  },
  actionBar: {
    flex: 2,
    width: scale(375),
    flexDirection: 'row',
  },
  address: {
    flex: 1,
    width: scale(375),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ddd3dc',
  },
  addressText: {
    fontFamily: 'Futura',
    color: '#646464'
  },
  restaurantStats: {
    flex: 2,
    paddingRight: scale(20),
    justifyContent: 'space-around'
  },
  rating: {
    width: scale(150)
  },
  starMe: {
    width: scale(120),
    height: verticalScale(20),
    overflow: 'visible'
  },
  starIcon: {
    width: scale(40),
    height: verticalScale(40),
    overflow: 'visible'
  }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MultiResult);
