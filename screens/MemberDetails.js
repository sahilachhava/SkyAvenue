import React, { Component, useState, useEffect } from "react";
import {    
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

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

async function saveMemberDetails(memType, fName, lName, email, mNo, famNo, vehNo, props){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let mReg = /^[0]?[6789]\d{9}$/;

    if(fName.length<3){
        alert("Please enter vaid First Name");
    }else{
        if(lName.length<3){
            alert("Please enter valid Last Name");
        }else{
            if(reg.test(email) === false){
                alert("Please enter valid Email address");
            }else{
                if(mNo.length!=10 || mReg.test(mNo)===false){
                    alert("Please enter valid Mobile number");
                }else{
                    if(famNo=="" || famNo=="0"){
                        alert("Please enter valid No of Person in your family");
                    }else{
                        if(vehNo==""){
                            alert("Please enter No of vehicle you owns");
                        }else{
                            if(memType==""){
                                alert("Please select member type");
                            }else{
                                await AsyncStorage.setItem('memType',JSON.stringify(memType));
                                await AsyncStorage.setItem('fName',JSON.stringify(fName));
                                await AsyncStorage.setItem('lName',JSON.stringify(lName));
                                await AsyncStorage.setItem('email',JSON.stringify(email));
                                await AsyncStorage.setItem('mNo',JSON.stringify(mNo));
                                await AsyncStorage.setItem('famNo',JSON.stringify(famNo));
                                await AsyncStorage.setItem('vehNo',JSON.stringify(vehNo));
                                BackHandler.removeEventListener("hardwareBackPress", backAction);
                                props.navigation.navigate('VehicleDetails', {
                                    totalVehicles: vehNo,
                                });
                            }
                        }
                    }
                }
            }
        }
    }
}

function MemberDetails(props) {
    const [fName, setFName] = React.useState('');
    const [lName, setLName] = React.useState(''); 
    const [email, setEmail] = React.useState('');
    const [mNo, setMNo] = React.useState('');
    const [famNo, setFamNo] = React.useState('');
    const [vehicle, setVehicle] = React.useState('');
    const [memType, setMemType] = React.useState('');
    const [flag, setFlag] = React.useState(false);

    useEffect(() => {
      async function setDetails(){
        setFName(JSON.parse(await AsyncStorage.getItem('fName')));
        setLName(JSON.parse(await AsyncStorage.getItem('lName')));
        setEmail(JSON.parse(await AsyncStorage.getItem('email')));
        setMNo(JSON.parse(await AsyncStorage.getItem('mNo')));
        setFamNo(JSON.parse(await AsyncStorage.getItem('famNo')));
        setVehicle(JSON.parse(await AsyncStorage.getItem('vehNo')));
        setMemType(JSON.parse(await AsyncStorage.getItem('memType')));
        setFlag(true);
      }
      
      if(!flag){
        setDetails();
      }

    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);
    
  return (
    <View style={styles.container}>
      <View style={styles.scrollArea1}>
        <ScrollView
          horizontal={false}
          contentContainerStyle={styles.scrollArea1_contentContainerStyle}
        >
          <Text style={styles.title1}>Sky Avenue</Text>
          <Text style={styles.title2}>1. Member Details</Text>
          <DropDownPicker
            items={[
                {label: 'Owned', value: 'Owned'},
                {label: 'Rented', value: 'Rented'}
            ]}
            placeholder="Member Type"
            defaultValue={memType}
            containerStyle={styles.firstName6}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            labelStyle={{
                color: '#2c3e50'
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={(item)=>{
                if(item.value!=""){
                    setMemType(item.value);
                }
            }}
          />
          <TextInput
            placeholder="First Name"
            textBreakStrategy="highQuality"
            placeholderTextColor="rgba(230, 230, 230,1)"
            returnKeyType="next"
            maxLength={50}
            returnKeyLabel="Next"
            clearTextOnFocus={true}
            autoCorrect={false}
            enablesReturnKeyAutomatically={false}
            style={styles.firstName}
            onChangeText={text => setFName(text)}
            value={fName}
          ></TextInput>
          <TextInput
            placeholder="Last Name"
            textBreakStrategy="highQuality"
            placeholderTextColor="rgba(230, 230, 230,1)"
            returnKeyType="next"
            maxLength={50}
            returnKeyLabel="Next"
            clearTextOnFocus={true}
            autoCorrect={false}
            enablesReturnKeyAutomatically={false}
            style={styles.firstName1}
            onChangeText={text => setLName(text)}
            value={lName}
          ></TextInput>
          <TextInput
            placeholder="Email Address"
            textBreakStrategy="highQuality"
            placeholderTextColor="rgba(230, 230, 230,1)"
            returnKeyType="next"
            maxLength={50}
            returnKeyLabel="Next"
            clearTextOnFocus={true}
            autoCorrect={false}
            enablesReturnKeyAutomatically={false}
            keyboardType="email-address"
            style={styles.firstName2}
            onChangeText={text => setEmail(text)}
            value={email}
          ></TextInput>
          <TextInput
            placeholder="Mobile Number"
            textBreakStrategy="highQuality"
            placeholderTextColor="rgba(230, 230, 230,1)"
            returnKeyType="next"
            maxLength={10}
            returnKeyLabel="Next"
            clearTextOnFocus={true}
            autoCorrect={false}
            enablesReturnKeyAutomatically={false}
            keyboardType="phone-pad"
            style={styles.firstName3}
            onChangeText={text => setMNo(text)}
            value={mNo}
          ></TextInput>
          <TextInput
            placeholder="Total Family Members"
            textBreakStrategy="highQuality"
            placeholderTextColor="rgba(230, 230, 230,1)"
            returnKeyType="next"
            maxLength={3}
            returnKeyLabel="Next"
            clearTextOnFocus={true}
            autoCorrect={false}
            enablesReturnKeyAutomatically={false}
            keyboardType="phone-pad"
            style={styles.firstName4}
            onChangeText={text => setFamNo(text)}
            value={famNo}
          ></TextInput>
          <TextInput
            placeholder="Total Vehicles Owns"
            textBreakStrategy="highQuality"
            placeholderTextColor="rgba(230, 230, 230,1)"
            returnKeyType="next"
            maxLength={3}
            returnKeyLabel="Next"
            autoCorrect={false}
            clearTextOnFocus={true}
            enablesReturnKeyAutomatically={false}
            keyboardType="phone-pad"
            style={styles.firstName5}
            onChangeText={text => setVehicle(text)}
            value={vehicle}
          ></TextInput>
          <View style={styles.phone1}>
            <TouchableOpacity
              onPress={() => saveMemberDetails(memType, fName, lName, email, mNo, famNo, vehicle,props)}
              style={styles.button1}
            >
              <View style={styles.image2Row}>
                <Image
                  source={require("../assets/images/next.png")}
                  resizeMode="contain"
                  style={styles.image2}
                ></Image>
                <Text style={styles.saveNext}>Save &amp; Next</Text>
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
  scrollArea1: {
    backgroundColor: COLORS.bgColor,
    flex: 1
  },
  scrollArea1_contentContainerStyle: {
    width: SCREEN_WIDTH
  },
  title1: {
    top: 0,
    left: 0,
    position: "absolute",
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.07,
    fontWeight: 'bold',
    textAlign: "center",
    right: 0,
    marginTop: SCREEN_HEIGHT * 0.05,
  },
  title2: {
    position: "absolute",
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.04,
    width: SCREEN_WIDTH,
    fontWeight: 'bold',
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: SCREEN_HEIGHT * 0.11,
  },
  firstName: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.05,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  firstName1: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.05,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  firstName2: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.05,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  firstName3: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.05,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  firstName4: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.05,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  firstName5: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.05,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  firstName6: {
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.17,
  },
  phone1: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.07,
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
  saveNext: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.1,
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

export default MemberDetails;
