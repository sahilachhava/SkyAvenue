import React, { Component, useState, useEffect } from "react";
import { Dimensions, TextInput, StyleSheet, View, Text, TouchableOpacity, BackHandler, Image, Alert, ScrollView } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
global.flatList = [];

const backAction = () => {
  Alert.alert("Hold on!", "Are you sure you want to exit?", [
    {
      text: "Cancel",
      onPress: () => null,
      style: "cancel"
    },
    { text: "YES", onPress: () => BackHandler.exitApp() }
  ]);
  return true;
};

function validateFlat(flatCode, finalFlatNo, props){
  if(flatCode.length!=4){
    alert("Please enter a valid 4 digit Flat Code / Family Ref Code");
  }else{
    firestore().collection('flats').doc(finalFlatNo).get().then(async (doc)=>{
        var data = doc.data();
        if(data.flatCode==flatCode){
          const userRef = JSON.parse(await AsyncStorage.getItem('userInfo'));
          await firestore().collection('memberFlags').doc(userRef.userID).update({
            'flatSelected':true,
            'flatNo': finalFlatNo,
          });
          await AsyncStorage.setItem('flatCode',JSON.stringify(flatCode));
          await AsyncStorage.setItem('flatNo',JSON.stringify(finalFlatNo));
          props.navigation.navigate("MemberDetails");
        }else if(data.familyRef==parseInt(flatCode)){
          const userRef = JSON.parse(await AsyncStorage.getItem('userInfo'));
          await firestore().collection('memberFlags').doc(userRef.userID).update({
            'flatSelected':true,
            'detailsFilled':true,
            'flatNo': finalFlatNo,
          });
          await AsyncStorage.setItem('flatCode',JSON.stringify(flatCode));
          await AsyncStorage.setItem('flatNo',JSON.stringify(finalFlatNo));
          var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
          var updateUser = {
            'flatNo': finalFlatNo,
            'userID': userInfo.userID,
            'userLoginName': userInfo.userName,
          };
          await AsyncStorage.setItem('userInfo',JSON.stringify(updateUser));
          props.navigation.navigate("Dashboard");
        }else{
          alert("Flat Validation Failed!, Please check your FlatCode / FamilyRef Code / Flat No");
        }
    })
  }
}

function SelectFlat(props) {
  const [flatCode, onChangeText] = React.useState('');
  const [finalFlatNo, onChangeFlat] = React.useState('');

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    //Getting Flat No
    firestore().collection('flats').get().then((docSnap)=>{
      docSnap.forEach((doc)=>{
        var data = doc.data();
        var flatID = data.flatWing+"-"+data.flatNo;
        flatList.push({label: flatID, value: flatID});
      })
    })
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.rect}>
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
              style={styles.logo1}
            ></Image>
          </View>
        </View>
        <Text style={styles.selectYourFlat}>Select your flat</Text>
        <DropDownPicker
          items={flatList}
          placeholder="Select your flat"
          searchable={true}
          searchablePlaceholder="Search your flat no"
          searchablePlaceholderTextColor="gray"
          searchableError={() => <Text>Flat Not Found</Text>}
          defaultValue={''}
          containerStyle={styles.selectFlatDrop}
          style={{backgroundColor: COLORS.whiteTxt}}
          itemStyle={{
              justifyContent: 'flex-start'
          }}
          labelStyle={{
              color: COLORS.blackTxt
          }}
          dropDownStyle={{backgroundColor: COLORS.whiteTxt}}
          onChangeItem={(item)=>{
            if(item.value!=""){
              onChangeFlat(item.value);
            }
          }}
        />
        <TextInput
          placeholder="Flat / Family Ref Code"
          textBreakStrategy="highQuality"
          clearButtonMode="never"
          dataDetector="phoneNumber"
          placeholderTextColor="rgba(0,0,0,1)"
          autoCapitalize="none"
          keyboardType="numeric"
          returnKeyType="go"
          maxLength={4}
          clearTextOnFocus={true}
          style={styles.phoneNumber1}
          onChangeText={text => onChangeText(text)}
          value={flatCode}
        ></TextInput>
        <View style={styles.phone2}>
          <TouchableOpacity
            onPress={() => validateFlat(flatCode,finalFlatNo,props)}
            style={styles.button1}
          >
            <View style={styles.image2Row}>
              <Image
                source={require("../assets/images/flat.png")}
                resizeMode="contain"
                style={styles.image2}
              ></Image>
              <Text style={styles.validateYourFlat}>Validate your Flat</Text>
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
  rect: {
    backgroundColor: COLORS.whiteTxt,
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
    color: COLORS.whiteTxt,
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
  titleStack: {
    height: SCREEN_HEIGHT
  },
  selectYourFlat: {
    color: COLORS.blackTxt,
    height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH,
    fontSize: SCREEN_WIDTH * 0.055,
    textAlign: "center",
    fontWeight: 'bold',
    textDecorationLine: "underline",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  selectFlatDrop: {
    marginTop: SCREEN_HEIGHT * 0.02,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center",
    height: SCREEN_HEIGHT * 0.055,
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  phoneNumber1: {
    color: COLORS.blackTxt,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center",
    height: SCREEN_HEIGHT * 0.07,
    fontSize: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  phone2: {
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
  image2: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06
  },
  validateYourFlat: {
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

export default SelectFlat;
