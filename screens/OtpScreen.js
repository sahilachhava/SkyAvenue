import React, { Component, useState, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import { COLORS } from "./Colors";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

async function validateOTP(otp, otpObject, props){
    if(otp.length!=6){
      alert("Please enter 6 digit valid OTP");
    }else{
        await otpObject.confirm(otp)
        .then(async (user)=>{
          var userInfo = {
            'userName': "None",
            'userID': user.phoneNumber
          };
          firestore().collection('memberFlags').doc(userInfo.userID).get().then(async (doc)=>{
            if(doc.exists){
              var data = doc.data();
              userInfo = {
                'userName': "None",
                'userID': userRef.phoneNumber,
                'flatNo': data.flatNo,
              };
              await AsyncStorage.setItem('loginStatus',"1");
              await AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
              if(data.flatSelected==false){
                props.navigation.navigate("SelectFlat");
              }else if(data.detailsFilled==false){
                props.navigation.navigate("MemberDetails");
              }else{
                props.navigation.navigate("Dashboard");
              }
            }else{
              await firestore().collection('memberFlags').doc(userInfo.userID).set({
                'flatSelected':false,
                'detailsFilled':false,
              });
              await AsyncStorage.setItem('loginStatus',"1");
              await AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
              props.navigation.navigate('SelectFlat');
            }
          });
        }).catch(error => {
            alert(error.message);
            console.log(error);
        });
    }
}

function OtpScreen(props) {
    useEffect(() => {
        auth().onAuthStateChanged( async (userRef) => {
            if (userRef) {
              var userInfo = {
                'userName': "None",
                'userID': userRef.phoneNumber
              };
              firestore().collection('memberFlags').doc(userInfo.userID).get().then(async (doc)=>{
                if(doc.exists){
                  var data = doc.data();
                  userInfo = {
                    'userName': "None",
                    'userID': userRef.phoneNumber,
                    'flatNo': data.flatNo,
                  };
                  await AsyncStorage.setItem('loginStatus',"1");
                  await AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
                  if(data.flatSelected==false){
                    props.navigation.navigate("SelectFlat");
                  }else if(data.detailsFilled==false){
                    props.navigation.navigate("MemberDetails");
                  }else{
                    props.navigation.navigate("Dashboard");
                  }
                }else{
                  await firestore().collection('memberFlags').doc(userInfo.userID).set({
                    'flatSelected':false,
                    'detailsFilled':false,
                  });
                  await AsyncStorage.setItem('loginStatus',"1");
                  await AsyncStorage.setItem('userInfo',JSON.stringify(userInfo));
                  props.navigation.navigate('SelectFlat');
                }
              });
            } 
        });
    }, []); 

    const { otpObject } = props.route.params;
    const [otp, onChangeText] = React.useState('');
  return (
    <View style={styles.container}>
      <View style={styles.scrollArea}>
        <ScrollView
          horizontal={false}
          contentContainerStyle={styles.scrollArea_contentContainerStyle}
        >
          <View style={styles.topSection1}>
            <View style={styles.title1Stack}>
              {/* <Text style={styles.title1}>Sky Avenue</Text> */}
              <Image
                source={require("../assets/images/logo.png")}
                resizeMode="contain"
                style={styles.logo1}
              ></Image>
            </View>
          </View>
          <View style={styles.bottomSection1}>
            <TextInput
              placeholder="Enter OTP"
              textBreakStrategy="highQuality"
              clearButtonMode="never"
              dataDetector="phoneNumber"
              placeholderTextColor="rgba(0,0,0,1)"
              autoCapitalize="none"
              keyboardType="numeric"
              returnKeyType="go"
              maxLength={10}
              clearTextOnFocus={true}
              style={styles.phoneNumber1}
              onChangeText={text => onChangeText(text)}
              value={otp}
            ></TextInput>
            <TouchableOpacity
                onPress={() => validateOTP(otp,otpObject,props)}
            >
            <View style={styles.phone1}>
              <View style={styles.rect}>
                <View style={styles.image2Row}>
                  <Image
                    source={require("../assets/images/phone.png")}
                    resizeMode="contain"
                    style={styles.image2}
                  ></Image>
                  <Text style={styles.continueWithPhone1}>Validate OTP</Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollArea: {
    backgroundColor: COLORS.whiteTxt,
    flex: 1
  },
  scrollArea_contentContainerStyle: {
    height: SCREEN_HEIGHT
  },
  topSection1: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.4,
    marginTop: SCREEN_HEIGHT * 0.07
  },
  title1: {
    top: 0,
    left: 0,
    position: "absolute",
    color: "rgba(0,0,0,1)",
    fontSize: SCREEN_WIDTH * 0.10,
    fontWeight: 'bold',
    textAlign: "center",
    right: 0
  },
  logo1: {
    top: SCREEN_HEIGHT * 0.01,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
    position: "absolute"
  },
  title1Stack: {
    height: SCREEN_HEIGHT
  },
  bottomSection1: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
    marginTop: SCREEN_HEIGHT * 0.015,
  },
  phoneNumber1: {
    color: COLORS.blackTxt,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center",
    height: SCREEN_HEIGHT * 0.07,
    fontSize: SCREEN_WIDTH * 0.06,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  phone1: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.06,
    marginTop: SCREEN_HEIGHT * 0.04
  },
  rect: {
    height: SCREEN_HEIGHT * 0.064,
    backgroundColor: COLORS.blackTxt,
    borderWidth: 0,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center"
  },
  image2: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06
  },
  continueWithPhone1: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.05,
    marginLeft: SCREEN_WIDTH * 0.045,
    marginTop: SCREEN_HEIGHT * 0.0125
  },
  image2Row: {
    height: SCREEN_HEIGHT * 0.5,
    flexDirection: "row",
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.01,
    marginLeft: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.002
  }
});

export default OtpScreen;
