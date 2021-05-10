import React, { Component, useState, useEffect } from "react";
import { Dimensions, StyleSheet, View, Text, Image } from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

async function redirectScreen(props){
  var currentMonth = firestore.Timestamp.now().toDate().getMonth()+1 + "-" + firestore.Timestamp.now().toDate().getFullYear();
  var penaltyMonth = await AsyncStorage.getItem('penaltyMonth');

  if(currentMonth!=penaltyMonth){
    await AsyncStorage.setItem('penaltyMonth', currentMonth);
    await AsyncStorage.setItem('penaltyFlag', "0");
  }

  const loginStatus = await AsyncStorage.getItem('loginStatus');
  if(loginStatus==null){
    setTimeout(()=>{
      props.navigation.navigate("Login");
    },
    300);
  }else{
    var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
    if(userInfo==null){
      alert("Something went wrong!!, Please login again");
      await AsyncStorage.removeItem('loginStatus');
      LoginManager.logOut();
      GoogleSignin.revokeAccess();
      GoogleSignin.signOut();
      auth().signOut();
      props.navigation.navigate("Login");
    }else{
      await firestore().collection('memberFlags').doc(userInfo.userID).get().then((doc)=>{
        var data = doc.data();
        if(data.flatSelected==false){
          props.navigation.navigate("SelectFlat");
        }else if(data.detailsFilled==false){
          props.navigation.navigate("MemberDetails");
        }else{
          props.navigation.navigate("Dashboard");
        }
      })
    }
  }
}

function Splash(props) {

  useEffect(() => {
    redirectScreen(props);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.group}>
        <View style={styles.screenStack}>
          {/* <View style={styles.screen}>
            <Text style={styles.title}>Sky Avenue</Text>
          </View> */}
          <Image
            source={require("../assets/images/logo.png")}
            resizeMode="contain"
            style={styles.logo}
          ></Image>
          <Image
            source={require("../assets/images/splash_image.png")}
            resizeMode="contain"
            style={styles.image}
          ></Image>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteTxt
  },
  group: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  },
  screen: {
    top: 0,
    left: 0,
    position: "absolute",
    right: 0,
    bottom: 13
  },
  title: {
    fontFamily: "Times New Roman",
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.13,
    fontWeight: 'bold',
    textAlign: "center",
    marginTop: SCREEN_HEIGHT * 0.15
  },
  image: {
    top: SCREEN_HEIGHT * 0.7,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.3,
    position: "absolute"
  },
  logo:{
    top: SCREEN_HEIGHT * 0.07,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.4,
    position: "absolute"
  },  
  screenStack: {
    flex: 1,
    marginBottom: 1
  }
});

export default Splash;