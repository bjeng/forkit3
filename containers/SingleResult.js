import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { scale, verticalScale, moderateScale } from '../scaler.js';
import Navbar from '../components/Navbar.js';
import {MapView} from 'expo';
import StarRating from 'react-native-star-rating';
import Stars from 'react-native-stars';
import Communications from 'react-native-communications';
import fourStars from "../assets/yelp_stars/web_and_ios/small/small_4.png";
import fourHalfStars from "../assets/yelp_stars/web_and_ios/small/small_4_half.png";
import fiveStars from "../assets/yelp_stars/web_and_ios/small/small_5.png";

class SingleResult extends Component {
  imageMatch(rating) {
    switch(rating) {
      case (4 || 4.1 || 4.2 || 4.3 || 4.4):
        let fourImage = fourStars;
        return fourImage;
      case (4.5 || 4.6 || 4.7 || 4.8 || 4.9):
        let fourHalfImage = fourHalfStars;
        return fourHalfImage;
      case (5):
        let fiveImage = fiveStars;
        return fiveImage;
      default:
        let image = fourStars;
        return image;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Navbar hasBack={true}/>
        <View style={styles.background}>
          <Image style={styles.backgroundColor} source={require("../assets/discoverHome.png")}/>
          <View style={styles.nameContainer}>
            <View style={styles.star}>
              
            </View>
            <View style={styles.name}>
              <Text style={styles.nameText}>{this.props.single.singleResult.name}</Text>
            </View>
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.details}>
              <Image style={styles.restaurantIcon} source={{uri: this.props.single.singleResult.image_url}}/>
              <TouchableOpacity onPress={() => Communications.phonecall(this.props.single.singleResult.display_phone, true)}>
                <Text style={{fontWeight: 'bold', color: 'skyblue'}}>{this.props.single.singleResult.display_phone}</Text>
              </TouchableOpacity>
              <Image source={this.imageMatch(this.props.single.singleResult.rating)}/>
              <Text style={styles.textStyle}>{(this.props.single.singleResult.distance*0.000621371).toPrecision(3)} miles away</Text>
            </View>
            <View style={styles.restaurantButtons}>
              <TouchableOpacity style={styles.yelp} onPress={Actions.yelp}>
                <Image style={styles.yelpIcon} source={require("../assets/yelp.jpg")}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.openTable}>
                <Image style={styles.openTableIcon} source={require("../assets/openTable.png")}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={{ width: scale(300), height: verticalScale(150) }}
              region={{
                latitude: this.props.location.latitude,
                longitude: this.props.location.longitude,
                latitudeDelta: .05,
                longitudeDelta: .05,

              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: this.props.location.latitude,
                  longitude: this.props.location.longitude
                }}
                pinColor={'#008000'}
                />
              <MapView.Marker
                coordinate={{
                  latitude: this.props.single.singleResult.coordinates.latitude,
                  longitude: this.props.single.singleResult.coordinates.longitude
                }}
                />
            </MapView>
          </View>
          <View style={styles.forkContainer}>
            <TouchableOpacity style={styles.forkit} onPress={Actions.resultlightbox}>
              <Image style={styles.logoText} source={require("../assets/DesktopCopy3trans.png")}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

SingleResult.propTypes = {
};

const mapStateToProps = (state) => {
    // console.log(state);
    return {
      location: state.area,
      single: state.results
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)'
  },
  background: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    height: verticalScale(667-70-50),
    width: scale(375)
  },
  backgroundColor: {
    top: verticalScale(0),
    position: 'absolute',
    opacity: 0.8,
    height: verticalScale(667-70-50),
    width: scale(375)
  },
  nameContainer: {
    flex: 1,
    borderBottomColor: "#ddd3dc",
    borderBottomWidth: moderateScale(0.5),
    width: scale(375),
    flexDirection: 'row'
  },
  detailsContainer: {
    flex: 3,
    borderBottomColor: "#ddd3dc",
    borderBottomWidth: moderateScale(0.5),
    width: scale(375),
    flexDirection: 'row'
  },
  mapContainer: {
    flex: 2,
    width: scale(375),
    justifyContent: 'center',
    alignItems: 'center'
  },
  forkContainer: {
    flex: 1,
    width: scale(375)
  },
  star: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    flex: 4,
    justifyContent: 'center'
  },
  details: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  restaurantButtons: {
    flex: 1
  },
  yelp: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: moderateScale(5),
  },
  openTable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    margin: moderateScale(5),
    position: 'relative'
  },
  textStyle: {
    fontSize: moderateScale(18),
    fontFamily: 'Futura',
    color: 'white'
  },
  nameText: {
    fontSize: moderateScale(20),
    fontFamily: 'Futura',
    color: 'white'
  },
  restaurantIcon: {
    height: verticalScale(80),
    width: scale(80),
    borderRadius: 40,
    opacity: 0.7
  },
  yelpIcon: {
    height: verticalScale(65),
    width: scale(150),
    borderRadius: 20
  },
  openTableIcon: {
    height: verticalScale(65),
    width: scale(150),
    borderRadius: 20
  },
  forkit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#00042E",
    borderRadius: moderateScale(40),
    margin: scale(10),
  },
  logoText: {
    height: verticalScale(90),
    width: scale(275),
    bottom: verticalScale(5)
  }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SingleResult);
