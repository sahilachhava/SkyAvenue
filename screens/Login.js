import React, { Component, useState, useEffect, useRef } from "react";
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
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

async function PhoneSignIn(phoneNumber, props){
    if(phoneNumber.length!=10){
      alert("Please enter a valid Phone Number");
    }else{
      await auth().signInWithPhoneNumber("+91"+phoneNumber)
      .then((confirmation)=>{
        props.navigation.navigate('OTPScreen', {
          otpObject: confirmation,
        });
      })
      .catch(error => {
        alert(error.message);
        console.log(error);
      });
    }
}

async function googleSignIn(props) {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    await GoogleSignin.signIn().then(async (useRef)=>{
      var userInfo = {
        'userName': useRef.user.name,
        'userID': useRef.user.email
      };
      firestore().collection('memberFlags').doc(userInfo.userID).get().then(async (doc)=>{
        if(doc.exists){
          var data = doc.data();
          userInfo = {
            'userName': useRef.user.name,
            'userID': useRef.user.email,
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
    }).catch((error) => {
      alert(error.message);
      console.log(error);
    })
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      alert("Signin Cancelled by user");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // progress
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      alert("Please update google play services");
    } else {
      alert("Something went wrong!\n"+error);
    }
  }
}

async function facebookSignIn(props) {

  await LoginManager.logInWithPermissions(["public_profile","email"]).then(async function(result) {
      if (result.isCancelled) {
        console.log("Login cancelled");
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          const processRequest = new GraphRequest(
            '/me?fields=email,name',
            null,
            async (error, result) => {
              if (result) {
                var userInfo = {
                  'userName': result.name,
                  'userID': result.email
                };
                firestore().collection('memberFlags').doc(userInfo.userID).get().then(async (doc)=>{
                  if(doc.exists){
                    var data = doc.data();
                    userInfo = {
                      'userName': result.name,
                      'userID': result.email,
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
              } else {
                alert("Trouble Logging, Please try again!");
              }
            }
          );
          new GraphRequestManager().addRequest(processRequest).start();
        });
      }
    },
    function(error) {
      console.log("Login fail with error: " + error);
    }
  );
}

function Login(props) {

    useEffect( () => {
      GoogleSignin.configure({
        webClientId: '227597061410-ot8s4ma18vld3qd9duaptggerk5lb4sg.apps.googleusercontent.com',
      });
    }, []); 

    const [phoneNumber, onChangeText] = React.useState('');
    return (
      <View style={styles.container}> 
        <View style={styles.loginScreen}>
          <ScrollView
            horizontal={false}
            contentContainerStyle={styles.loginScreen_contentContainerStyle}
          >
            <View style={styles.topSection}>
              <View style={styles.titleStack}>
                {/* <Text style={styles.title}>Sky Avenue</Text> */}
                <Image
                  source={require("../assets/images/logo.png")}
                  resizeMode="contain"
                  style={styles.logo}
                ></Image>
              </View>
            </View>
            <View style={styles.bottomSection}>
              <TextInput
                placeholder="(+91) Phone Number"
                textBreakStrategy="highQuality"
                clearButtonMode="never"
                dataDetector="phoneNumber"
                placeholderTextColor="rgba(0,0,0,1)"
                autoCapitalize="none"
                keyboardType="numeric"
                returnKeyType="go"
                maxLength={10}
                clearTextOnFocus={true}
                style={styles.phoneNumber}
                onChangeText={text => onChangeText(text)}
                value={phoneNumber}
              ></TextInput>
              <View style={styles.phone}>
                <TouchableOpacity
                  onPress={() => PhoneSignIn(phoneNumber,props)}
                  style={styles.button1}
                >
                  <View style={styles.image4Row}>
                    <Image
                      source={require("../assets/images/phone.png")}
                      resizeMode="contain"
                      style={styles.image4}
                    ></Image>
                    <Text style={styles.continueWithPhone}>
                      Continue with Phone
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.google}>
                <TouchableOpacity 
                  style={styles.button2}
                  onPress={() => googleSignIn(props)}
                >
                  <View style={styles.image2Row}>
                    <Image
                      source={require("../assets/images/google.png")}
                      resizeMode="contain"
                      style={styles.image2}
                    ></Image>
                    <Text style={styles.continueWithGoogle}>
                      Continue with Google
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.facebook}>
                <TouchableOpacity 
                  style={styles.button}
                  onPress={() => facebookSignIn(props)}
                >
                  <View style={styles.image3Row}>
                    <Image
                      source={require("../assets/images/facebook.png")}
                      resizeMode="contain"
                      style={styles.image3}
                    ></Image>
                    <Text style={styles.continueWithFacebook}>
                      Continue with Facebook
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.whiteTxt
    },
    loginScreen: {
      flex: 1
    },
    loginScreen_contentContainerStyle: {
      height: SCREEN_HEIGHT
    }, 
    topSection: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.4,
      marginTop: SCREEN_HEIGHT * 0.07
    },
    title: {
      top: 0,
      left: 0,
      position: "absolute",
      color: "rgba(0,0,0,1)",
      fontSize: SCREEN_WIDTH * 0.10,
      fontWeight: 'bold',
      textAlign: "center",
      right: 0
    },
    logo: {
      top: SCREEN_HEIGHT * 0.01,
      left: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.35,
      position: "absolute"
    },
    titleStack: {
      height: SCREEN_HEIGHT
    },
    bottomSection: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.6,
      marginTop: SCREEN_HEIGHT * 0.015,
    },
    phoneNumber: {
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
    phone: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.06,
      marginTop: SCREEN_HEIGHT * 0.04
    },
    button1: {
      height: SCREEN_HEIGHT * 0.064,
      backgroundColor: COLORS.blackTxt,
      borderWidth: 0,
      borderColor: COLORS.borderColor,
      borderRadius: SCREEN_WIDTH * 0.06,
      width: SCREEN_WIDTH * 0.8,
      alignSelf: "center"
    },
    image4: {
      width: SCREEN_WIDTH * 0.08,
      height: SCREEN_HEIGHT * 0.06
    },
    continueWithPhone: {
      color: COLORS.whiteTxt,
      fontSize: SCREEN_WIDTH * 0.05,
      marginLeft: SCREEN_WIDTH * 0.045,
      marginTop: SCREEN_HEIGHT * 0.0125
    },
    image4Row: {
      height: SCREEN_HEIGHT * 0.5,
      flexDirection: "row",
      flex: 1,
      marginRight: SCREEN_WIDTH * 0.01,
      marginLeft: SCREEN_WIDTH * 0.08,
      marginTop: SCREEN_HEIGHT * 0.002
    },
    google: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.06,
      marginTop: SCREEN_HEIGHT * 0.03
    },
    button2: {
      height: SCREEN_HEIGHT * 0.064,
      backgroundColor: COLORS.blackTxt,
      borderWidth: 0,
      borderColor: COLORS.borderColor,
      borderRadius: SCREEN_WIDTH * 0.06,
      width: SCREEN_WIDTH * 0.8,
      alignSelf: "center"
    },
    image2: {
      width: SCREEN_WIDTH * 0.06,
      height: SCREEN_HEIGHT * 0.06
    },
    continueWithGoogle: {
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
    },
    facebook: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.06,
      marginTop: SCREEN_HEIGHT * 0.03
    },
    button: {
      height: SCREEN_HEIGHT * 0.064,
      backgroundColor: COLORS.blackTxt,
      borderWidth: 0,
      borderColor: COLORS.borderColor,
      borderRadius: SCREEN_WIDTH * 0.06,
      width: SCREEN_WIDTH * 0.8,
      alignSelf: "center"
    },
    image3: {
      width: SCREEN_WIDTH * 0.07,
      height: SCREEN_HEIGHT * 0.06
    },
    continueWithFacebook: {
      color: COLORS.whiteTxt,
      fontSize: SCREEN_WIDTH * 0.05,
      marginLeft: SCREEN_WIDTH * 0.045,
      marginTop: SCREEN_HEIGHT * 0.0125
    },
    image3Row: {
      height: SCREEN_HEIGHT * 0.5,
      flexDirection: "row",
      flex: 1,
      marginRight: SCREEN_WIDTH * 0.01,
      marginLeft: SCREEN_WIDTH * 0.08,
      marginTop: SCREEN_HEIGHT * 0.002
    }
  });
  
  export default Login;
  