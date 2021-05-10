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
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

function Feedback(props) {
  const [feedback, setFeedback] = React.useState("");

  async function sendFeedback(props){
    var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
    var currentTime = firestore.Timestamp.now().toDate();
    if(feedback=="" || feedback.length<3){
      alert("Please enter proper feedback or complaint");
    }else{
      firestore().collection("feedback").add({
        'flatNo': userInfo.flatNo,
        'timeStamp': currentTime,
        'feedback': feedback,
        'userID': userInfo.userID,
      }).then(()=>{
        alert("Your feedback / complaint sent successfully");
        props.navigation.navigate("AboutSky");
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
          <Text style={styles.feedback}>Feedback / Complaint</Text>
          <TextInput
            placeholder="Enter your feedback / complaint here"
            textBreakStrategy="highQuality"
            placeholderTextColor={COLORS.blackTxt}
            returnKeyType="next"
            returnKeyLabel="Next"
            clearTextOnFocus={true}
            multiline={true}
            enablesReturnKeyAutomatically={false}
            keyboardType="default"
            style={styles.vehicleTxt1}
            onChangeText={text => setFeedback(text)}
            value={feedback}
          ></TextInput>
          <View style={styles.searchBtn1}>
            <TouchableOpacity
              onPress={() => sendFeedback(props)}
              style={styles.searchButton1}
            >
              <View style={styles.imageRow}>
                <Image
                  source={require("../assets/images/feedSend.png")}
                  resizeMode="contain"
                  style={styles.image}
                ></Image>
                <Text style={styles.sendNow}>Send Now</Text>
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
    alignSelf: "center",
  },
  scrollArea1_contentContainerStyle: {
    width: SCREEN_WIDTH
  },
  feedback: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.055,
    textAlign: "center",
    fontWeight: 'bold',
    textDecorationLine: "underline",
    marginTop: SCREEN_HEIGHT * 0.06,
  },
  vehicleTxt1: {
    color: COLORS.blackTxt,
    height: SCREEN_HEIGHT * 0.45,
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH * 0.06,
    paddingLeft: SCREEN_WIDTH * 0.05,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: "rgba(0,0,0,1)",
    borderRadius: SCREEN_WIDTH * 0.02,
    alignSelf: 'center',
    textAlignVertical: 'top',
    marginTop: SCREEN_HEIGHT * 0.03,
    backgroundColor: COLORS.whiteTxt,
    borderColor: COLORS.blackTxt,
  },
  searchBtn1: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.065,
    marginTop: SCREEN_HEIGHT * 0.04
  },
  searchButton1: {
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
    height: SCREEN_HEIGHT * 0.06,
    marginLeft: SCREEN_WIDTH * 0.1,
  },
  sendNow: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.05,
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

export default Feedback;
