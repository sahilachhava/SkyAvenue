import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking
} from "react-native";
import firestore from '@react-native-firebase/firestore';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

function AboutSky(props) {
  const [cPersons, setCPersons] = React.useState([]);

  useEffect(() => {
    async function fetchData(){
      await firestore().collection('settings').doc('settings').get().then((doc)=>{
        var data = doc.data();
        setCPersons(data.contactPersons);
      });
    }
    fetchData();
  },[]);

  function openURL(){
    firestore().collection('settings').doc('settings').get().then(async (doc)=>{
      var data = doc.data().termsURL;
      await Linking.openURL(data).catch(()=> {
        alert("Error Opening Do's & Don'ts");
      });
    });
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.scrollArea1}>
        <ScrollView
          horizontal={false}
          contentContainerStyle={styles.scrollArea1_contentContainerStyle}
        >
          <View style={styles.mainStats1Stack}>
            <View style={styles.mainStats1}>
              <View style={styles.skyAddressStack}>
                <View style={styles.skyAddress}>
                  <Text style={styles.address}>Address:</Text>
                  <View>
                  <Text style={styles.fullAddress}>Sky Avenue, TP-85</Text>
                  <Text style={styles.fullAddress}>Near Sona Palace</Text>
                  <Text style={styles.fullAddress}>Kadri Party Plot Lane</Text>
                  <Text style={styles.fullAddress}>Sarkhej Road - 380055</Text>
                  <Text style={styles.fullAddress}>Ahmedabad, Gujarat INDIA</Text>
                  </View>
                </View>
                <View style={styles.skyContact}>
                  <Text style={styles.contact}>Contact Person:</Text>
                  <View>
                    <Text style={styles.fullcontact}>Chairman:   {cPersons[0]}</Text>
                    <Text style={styles.fullcontact}>Accounts:   {cPersons[1]}</Text>
                    <Text style={styles.fullcontact}>Secretary:   {cPersons[2]}</Text>
                    <Text style={styles.fullcontact}>Other:          {cPersons[3]}</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.title1}>Sky Avenue</Text>
          </View>
          <View style={styles.skyaccounts}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Accounts")}
              style={styles.accountBtn}
            >
              <View style={styles.accountImgRow}>
                <Image
                  source={require("../assets/images/accounts.png")}
                  resizeMode="contain"
                  style={styles.accountImg}
                ></Image>
                <Text style={styles.skyAccounts}>Sky Accounts</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.privacy}>
            <TouchableOpacity
              onPress={() => openURL()}
              style={styles.privacyBtn}
            >
              <View style={styles.privacyImgRow}>
                <Image
                  source={require("../assets/images/terms.png")}
                  resizeMode="contain"
                  style={styles.privacyImg}
                ></Image>
                <Text style={styles.privacyPolicy}>Do&#39;s &amp; Don&#39;ts</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.terms}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Feedback')}
              style={styles.termsBtn}
            >
              <View style={styles.termsImgRow}>
                <Image
                  source={require("../assets/images/feedback.png")}
                  resizeMode="contain"
                  style={styles.termsImg}
                ></Image>
                <Text style={styles.dosDonts}>Feeback / Complaint</Text>
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
    flex: 1,
    justifyContent: "center"
  },
  scrollArea1: {
    backgroundColor: COLORS.bgColor,
    alignSelf: "center",
  },
  scrollArea1_contentContainerStyle: {
    width: SCREEN_WIDTH
  },
  mainStats1: {
    backgroundColor: COLORS.blackTxt,
    borderWidth: SCREEN_WIDTH * 0.003,
    height: SCREEN_HEIGHT * 0.45,
    width: SCREEN_WIDTH * 0.9,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.04
  },
  skyAddress: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.03,
    position: "absolute"
  },
  address: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  fullAddress: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.045,
    textAlign: "center",
    //marginTop: SCREEN_HEIGHT * 0.01,
    alignSelf: "center"
  },
  skyContact: {
    marginTop: SCREEN_HEIGHT * 0.2,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.03,
    position: "absolute"
  },
  contact: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  fullcontact: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.045,
    //textAlign: "center",
    //marginTop: SCREEN_HEIGHT * 0.01,
    alignSelf: "center"
  },
  skyAddressStack: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.3,
    marginTop: SCREEN_HEIGHT * 0.07,
    alignSelf: 'center'
  },
  title1: {
    top: SCREEN_HEIGHT * 0.01,
    left: 0,
    position: "absolute",
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.07,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: "center",
    right: 0,
    marginLeft: SCREEN_WIDTH * 0.05,
  },
  mainStats1Stack: {
    height: SCREEN_HEIGHT * 0.5,
    marginTop: SCREEN_HEIGHT * 0.04,
    alignSelf: 'center',
  },
  skyaccounts: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.06
  },
  accountBtn: {
    height: SCREEN_HEIGHT * 0.064,
    backgroundColor: COLORS.blackTxt,
    borderWidth: 0,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center"
  },
  accountImg: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06
  },
  skyAccounts: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.055,
    marginLeft: SCREEN_WIDTH * 0.1,
    marginTop: SCREEN_HEIGHT * 0.0125
  },
  accountImgRow: {
    height: SCREEN_HEIGHT * 0.5,
    flexDirection: "row",
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.01,
    marginLeft: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.002
  },
  privacy: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.06,
    marginTop: SCREEN_HEIGHT * 0.04
  },
  privacyBtn: {
    height: SCREEN_HEIGHT * 0.064,
    backgroundColor: COLORS.blackTxt,
    borderWidth: 0,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center"
  },
  privacyImg: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06
  },
  privacyPolicy: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.055,
    marginLeft: SCREEN_WIDTH * 0.1,
    marginTop: SCREEN_HEIGHT * 0.0125
  },
  privacyImgRow: {
    height: SCREEN_HEIGHT * 0.5,
    flexDirection: "row",
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.01,
    marginLeft: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.002
  },
  terms: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.08,
    marginTop: SCREEN_HEIGHT * 0.04
  },
  termsBtn: {
    height: SCREEN_HEIGHT * 0.065,
    backgroundColor: COLORS.blackTxt,
    borderWidth: 0,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center"
  },
  termsImg: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06
  },
  dosDonts: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.055,
    marginLeft: SCREEN_WIDTH * 0.05,
    marginTop: SCREEN_HEIGHT * 0.0125
  },
  termsImgRow: {
    height: SCREEN_HEIGHT * 0.5,
    flexDirection: "row",
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.01,
    marginLeft: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.002
  }
});

export default AboutSky;