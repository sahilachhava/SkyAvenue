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
  Alert,
  BackHandler
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
global.EXTRA_HEIGHT = 1;
global.vehicleList = [
    {label: 'Four-Wheeler', value: 'Four Wheeler'},
    {label: 'Three Wheeler', value: 'Three Wheeler'},
    {label: 'Two Wheeler', value: 'Two Wheeler'},
    {label: 'Other', value: 'Other'}
];

async function saveVehicleDetails(vehType, vehName, vehNo, totalVehicles, props){
    var vehicles = [];
    if(vehType.length!=totalVehicles){
        alert("Please select all vehicle type");
    }else if(vehName.length!=totalVehicles){
        alert("Please enter all vehicle name");
    }else if(vehNo.length!=totalVehicles){
        alert("Please enter all vehicle number");
    }else{
        for (let i = 0; i < totalVehicles; i++) {  
            vehicles.push({'vehicleType':vehType[i], 'vehicleName':vehName[i], 'vehicleNo':vehNo[i]}); 
        }

        var flatNo = JSON.parse(await AsyncStorage.getItem('flatNo'));
        var flatCode = JSON.parse(await AsyncStorage.getItem('flatCode'));
        var familyRef = Math.floor(1000 + Math.random() * 9000);
        var fName = JSON.parse(await AsyncStorage.getItem('fName'));
        var lName = JSON.parse(await AsyncStorage.getItem('lName'));
        var email = JSON.parse(await AsyncStorage.getItem('email'));
        var mNo = JSON.parse(await AsyncStorage.getItem('mNo'));
        var famNo = JSON.parse(await AsyncStorage.getItem('famNo'));
        var vehTotal = JSON.parse(await AsyncStorage.getItem('vehNo'));
        var memType = JSON.parse(await AsyncStorage.getItem('memType'));

        //Updating local user data
        var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
        var updateUser = {
          'userName': fName + " " + lName,
          'userEmail': email,
          'userPhone': mNo,
          'flatNo': flatNo,
          'userID': userInfo.userID,
          'userLoginName': userInfo.userName
        };
        await AsyncStorage.setItem('userInfo',JSON.stringify(updateUser));


        firestore().collection('members').doc(flatNo).get().then((memDoc)=>{
            if(memDoc.exists){
              alert("Member for flat no: "+flatNo+", Already Exists!!");
            }else{
                firestore().collection('members').doc(flatNo).set({
                    'flatNo': flatNo,
                    'flatCode':flatCode,
                    'fName':fName,
                    'lName':lName,
                    'email':email,
                    'mobileNo':mNo,
                    'familyTotal':famNo,
                    'vehicleTotal':vehTotal,
                    'memberType':memType,
                    'familyRef':familyRef
                }).then(async()=>{
                    vehicles.forEach(async (vehicle)=>{
                        var type = vehicle.vehicleType;
                        var name = vehicle.vehicleName;
                        var no = vehicle.vehicleNo;
                        await firestore().collection('members').doc(flatNo).collection('vehicles').doc(no).set({
                            'vehicleType': type,
                            'vehicleName': name,
                            'vehicleNo': no
                        });
                    })
                    await firestore().collection('flats').doc(flatNo).update({
                      'familyRef': familyRef,
                    });
                }).then(async ()=>{
                  await firestore().collection('memberFlags').doc(updateUser.userID).update({
                    'detailsFilled':true,
                  });
                  alert("All details has been saved!");
                  props.navigation.navigate("Dashboard");
              })
            }
        })
    }
}

function VehicleDetails(props) {

    const { totalVehicles } = props.route.params;
    var vehType = [];
    var vehName = [];
    var vehNo = [];
    const vehicleDesign = [];

    if(totalVehicles>2){
        global.EXTRA_HEIGHT =  totalVehicles * 0.30 + 0.40;
    }

    for (let i = 1; i <= totalVehicles; i++) 
    {
        vehicleDesign.push(
            <View style={styles.topSection}>
            <Text style={styles.subTitle}>Vehicle {i}</Text>
            <DropDownPicker
                items={vehicleList}
                placeholder="Vehicle Type"
                defaultValue={''}
                containerStyle={styles.firstName6}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{justifyContent: 'flex-start'}}
                labelStyle={{color: '#2c3e50'}}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={(item)=>{
                    if(item.value!=""){
                       vehType[i-1] = item.value;
                    }
                }}
            />
            <TextInput
                placeholder="Vehicle Name & Model"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                maxLength={50}
                autoCorrect={false}
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                style={styles.firstName}
                onChangeText={text => vehName[i-1] = text}
                value={vehName}
            ></TextInput>
            <TextInput
                placeholder="Vehicle No (Ex. GJ01XX0000)"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                maxLength={50}
                returnKeyLabel="Next"
                autoCorrect={false}
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                style={styles.firstName1}
                onChangeText={text => vehNo[i-1] = text}
                value={vehNo}
            ></TextInput>
          </View>
        );
    }

    function dynamicExtraHeight() {
        return {
            height: SCREEN_HEIGHT * EXTRA_HEIGHT
        }
    }
    
  return (
    <View style={styles.container}>
      <View style={styles.scrollArea1}>
        <ScrollView
          horizontal={false}
          contentContainerStyle={dynamicExtraHeight()}
        >
          <Text style={styles.title1}>Sky Avenue</Text>
          <Text style={styles.title2}>2. Vehicle Details</Text>

          {vehicleDesign}

            <TouchableOpacity
              onPress={() => saveVehicleDetails(vehType, vehName, vehNo, totalVehicles, props)}
              style={styles.button1}
            >
              <View style={styles.image2Row}>
                <Image
                  source={require("../assets/images/save.png")}
                  resizeMode="contain"
                  style={styles.image2}
                ></Image>
                <Text style={styles.saveNext}>Save Details</Text>
              </View>
            </TouchableOpacity>
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
  topSection: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.25,
    marginTop: SCREEN_HEIGHT * 0.07
  },
  subTitle: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.035,
    width: SCREEN_WIDTH,
    fontWeight: 'bold',
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: SCREEN_HEIGHT * 0.09,
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
  firstName6: {
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.025,
  },
  button1: {
    height: SCREEN_HEIGHT * 0.064,
    backgroundColor: COLORS.blackTxt,
    borderWidth: 0,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    marginTop: SCREEN_HEIGHT * 0.16,
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
    height: SCREEN_HEIGHT * 0.2,
    flexDirection: "row",
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.01,
    marginLeft: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.002
  }
});

export default VehicleDetails;
