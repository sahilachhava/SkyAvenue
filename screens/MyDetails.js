import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  Dimensions
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';
import ProgressBar from 'react-native-progress/Bar';
import AsyncStorage from '@react-native-community/async-storage';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

function MyDetails(props) {
    const [mType, setType] = React.useState('');
    const [mFlatNo, setFlatNo] = React.useState('');
    const [mFamRef, setFamRef] = React.useState('');
    const [mFName, setFName] = React.useState('');
    const [mLName, setLName] = React.useState('');
    const [mMNo, setMNo] = React.useState('');
    const [mEmail, setEmail] = React.useState('');
    const [mTFam, setTFam] = React.useState('');
    const [editableFlag, setEditableFlag] = React.useState(false);

    useEffect(() => {
      async function getDetails(){
        var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
        await firestore().collection('members').doc(userInfo.flatNo).get().then((doc)=>{
          var data = doc.data();
          setType("Member Type: " + data.memberType.toString());
          setFlatNo("Flat No: " + data.flatNo.toString());
          setFamRef("Family Ref Code: "+data.familyRef.toString());
          setFName(data.fName);
          setLName(data.lName);
          setMNo(data.mobileNo);
          setEmail(data.email);
          setTFam(data.familyTotal);
        })
      }
      getDetails();
    }, []);

    async function saveDetails(){
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      let mReg = /^[0]?[6789]\d{9}$/;
      if(mFName=="" || mFName.length<3){
        alert("Please enter a valid first name");
      }else if(mLName=="" || mLName.length<3){
        alert("Please enter a valid last name");
      }else if(mMNo.length!=10 || mReg.test(mMNo)===false){
        alert("Please enter a valid phone number");
      }else if(reg.test(mEmail) === false){
        alert("Please enter a valid email address");
      }else if(mTFam=="" || mTFam=="0"){
        alert("Please enter no of valid family member");
      }else{
        await firestore().collection('members').doc(mFlatNo).update({
          'memberType': mType,
          'fName': mFName,
          'lName': mLName,
          'mobileNo': mMNo,
          'email': mEmail,
          'familyTotal': mTFam
        }).then(()=>{
          setEditableFlag(false);
          alert("Profile details updated!");
        })
      }
    }

    return (
    <View style={styles.container}>
        <View style={styles.scrollArea1}>
        <ScrollView
            horizontal={false}
            contentContainerStyle={styles.scrollArea1_contentContainerStyle}
        >
        { !editableFlag ? 
            <TextInput
                placeholder="Member Type"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                keyboardType="default"
                style={styles.flatNo}
                value={mType}
                editable={false}
            ></TextInput>
            :
            <DropDownPicker
                items={[
                    {label: 'Owned', value: 'Owned'},
                    {label: 'Rented', value: 'Rented'}
                ]}
                placeholder="Member Type"
                defaultValue={mType}
                containerStyle={styles.type}
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
                        setType(item.value);
                    }
                }}
            />
            }
            <TextInput
                placeholder="Flat No"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                keyboardType="default"
                style={styles.flatNo}
                onChangeText={text => setFlatNo(text)}
                value={mFlatNo}
                editable={false}
            ></TextInput>
            <TextInput
                placeholder="Family Code"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                keyboardType="numeric"
                style={styles.familyRef}
                onChangeText={text => setFamRef(text)}
                value={mFamRef}
                editable={false}
            ></TextInput>
            <TextInput
                placeholder="First Name"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                keyboardType="default"
                style={styles.fName}
                onChangeText={text => setFName(text)}
                value={mFName}
                editable={editableFlag}
            ></TextInput>
            <TextInput
                placeholder="Last Name"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                keyboardType="default"
                style={styles.lName}
                onChangeText={text => setLName(text)}
                value={mLName}
                editable={editableFlag}
            ></TextInput>
            <TextInput
                placeholder="Phone Number"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                maxLength={10}
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                keyboardType="numeric"
                style={styles.phone}
                onChangeText={text => setMNo(text)}
                value={mMNo}
                editable={editableFlag}
            ></TextInput>
            <TextInput
                placeholder="Email address"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                keyboardType='email-address'
                style={styles.email}
                onChangeText={text => setEmail(text)}
                value={mEmail}
                editable={editableFlag}
            ></TextInput>
            <TextInput
                placeholder="Total Family Members"
                textBreakStrategy="highQuality"
                placeholderTextColor="rgba(230, 230, 230,1)"
                returnKeyType="next"
                returnKeyLabel="Next"
                clearTextOnFocus={true}
                enablesReturnKeyAutomatically={false}
                keyboardType="numeric"
                style={styles.tFamNo}
                onChangeText={text => setTFam(text)}
                value={mTFam}
                editable={editableFlag}
            ></TextInput>
            <View style={styles.btn}>
            { !editableFlag ? 
              <TouchableOpacity
                  onPress={() => setEditableFlag(true)}
                  style={styles.pBtn}
              >
                  <View style={styles.imageRow}>
                  <Image
                      source={require("../assets/images/update.png")}
                      resizeMode="contain"
                      style={styles.image}
                  ></Image>
                  <Text style={styles.btnText}>Edit Details</Text>
                  </View>
              </TouchableOpacity>
            :
                <TouchableOpacity
                    onPress={() => saveDetails()}
                    style={styles.pBtn}
                >
                  <View style={styles.imageRow}>
                  <Image
                      source={require("../assets/images/save.png")}
                      resizeMode="contain"
                      style={styles.image}
                  ></Image>
                  <Text style={styles.btnText}>Save Details</Text>
                  </View>
              </TouchableOpacity>
          }
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
  type: {
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.035,
  },
  flatNo: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.04,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.redBorder,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  familyRef: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.04,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.redBorder,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  fName: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.04,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.greenBorder,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  lName: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.04,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.greenBorder,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  phone: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.04,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.greenBorder,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  email: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.04,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.greenBorder,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  tFamNo: {
    color: COLORS.whiteTxt,
    height: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.04,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.greenBorder,
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  btn: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.07,
    marginTop: SCREEN_HEIGHT * 0.04
  },
  pBtn: {
    height: SCREEN_HEIGHT * 0.064,
    backgroundColor: COLORS.blackTxt,
    borderWidth: 0,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center"
  },
  image: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06
  },
  btnText: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.1,
    marginTop: SCREEN_HEIGHT * 0.0125
  },
  imageRow: {
    height: SCREEN_HEIGHT * 0.5,
    flexDirection: "row",
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.01,
    marginLeft: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.002
  }
});

export default MyDetails;