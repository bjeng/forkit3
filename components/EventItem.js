import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { scale, verticalScale, moderateScale } from '../scaler.js';
import RightButton from '../assets/fasttrackGrey.png';
import axios from 'axios';

class EventItem extends Component{
    constructor(props){
        super(props);
        this.state = {
          show: true
        };
    }

    handleClick() {
        axios.get(`http://localhost:3000/db/search?password=$BIG_SHAQ103$&tableName=participants&fields=id,group_id,participant_id,pending,accepted,host_id,restaurant_chosen,played&conditions=participant_id='${this.props.user.id}' and group_id='${this.props.data.id}'`)
        .then((response) => {
            var toAdd = '';
            if (response.data.result[0].restaurant_chosen) {
              toAdd = 'Result'
            } else if (response.data.result[0].played === false) {
              toAdd = 'Play'
            } else {
              toAdd = 'Pending'
            }
            var newObj = Object.assign({}, this.props.data)
            newObj.type = toAdd;
            newObj.dates = this.props.data.dates;
            newObj.meal = this.props.data.meal_type;
            newObj.group_id = this.props.data.id;
            newObj.host_id = this.props.data.host_id;
            newObj.radius = this.props.data.radius;
            newObj.location = JSON.parse(this.props.data.location);
            this.props.clickedStatus(newObj);

            let Np = this.props.data.participants_id.split(',').length + 1; //length === 1
            axios.get(`http://localhost:3000/db/search?password=$BIG_SHAQ103$&tableName=responses&fields=group_event_id,host_id,participant_id,is_host,date_chosen,meal_chosen,radius_chosen&conditions=group_event_id='${this.props.data.id}'`)
            .then((response) => {
              var Nr = response.data.result.length;
              if (Np === (Nr + 1)) {
                this.props.lastPerson(true);
              }
            })
        })
        .catch((err) => {
          console.log('Event Notification error is ', err);
        })
      Actions.statuspage();
    }

    showEvent() {
      console.log(this.props.data, '********')
      return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.background} onPress={() => this.handleClick()}>
            <View style={styles.mealContainer}>
              <Text style={styles.subtitleText}>{this.props.data.meal_type}</Text>
              <View style={styles.rowContainer}>
                <View style={styles.colContainer}>
                  <Text style={styles.detailText}>{this.props.data.dates.split(',')[0]}</Text>
                  <Text style={styles.detailText}>{this.props.data.day}</Text>
                </View>
                <View style={styles.rowPicContainer}>
                  <View style={styles.hostContainer}>
                    <Text style={styles.hostText}>H</Text>
                    <View style={styles.circle}>
                      <Image style={styles.headShot} source={this.props.host}/>
                    </View>
                  </View>
                  <View style={styles.guestContainer}>
                    <Text style={styles.guestText}>G</Text>
                    {this.props.data.guests.map((result) =>
                      <View style={styles.circle}>
                        <Image style={styles.headShot} source={result}/>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{this.props.data.title}</Text>
              <Image style={styles.rightButton} source={RightButton}/>
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    showNone() {
      return (
        null
      );
    }

    render(){
        return (
          <View>
            {this.state.show ? this.showEvent() : this.showNone()}
          </View>
        );
    }
}

EventItem.propTypes = {
};

const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
      clickedStatus: (clicked) => dispatch({type: 'CLICKED', clicked: clicked}),
      lastPerson: (person) => dispatch({type: 'LAST', last:person})
    };
};

var styles = StyleSheet.create({
  container: {
    flex: 4,
    backgroundColor: 'transparent',
    width: scale(375),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(4)
  },
  background: {
    backgroundColor: 'rgba(255,255,255,.31)',
    width: scale(358),
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowColor: 'grey',
    shadowOffset: { height: verticalScale(4), width: 0 },
  },
  mealContainer: {
    flex: 1,
    top: verticalScale(8),
    left: scale(8)
  },
  titleText: {
    color: '#646464',
    fontSize: moderateScale(20),
    fontFamily: 'Futura',
  },
  subtitleText: {
    color: '#646464',
    fontSize: moderateScale(18),
    fontFamily: 'Futura',
  },
  detailText: {
    color: '#8D8D8D',
    fontSize: moderateScale(15),
    fontFamily: 'Futura',
  },
  titleContainer: {
    flex: 1,
    top: verticalScale(8),
    left: scale(8),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  colContainer: {
    flexDirection: 'column'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  rowPicContainer: {
    flexDirection: 'row',
    width: scale(375/2)
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: scale(45)
  },
  circle: {
    height: verticalScale(30),
    width: scale(30),
    borderRadius: scale(30/2),
    // borderColor: 'black',
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headShot: {
    height: verticalScale(30),
    width: scale(30)
  },
  guestContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: scale(150-45),
    left: scale(5)
  },
  guestText: {
    color: '#8D8D8D',
    fontSize: moderateScale(13),
    right: scale(5)
  },
  hostText: {
    color: '#8D8D8D',
    fontSize: moderateScale(13),
    right: scale(5)
  },
  rightButton: {
    width: scale(13),
    height: verticalScale(13),
    right: scale(18)
  }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventItem);
