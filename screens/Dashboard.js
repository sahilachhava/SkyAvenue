import React, { Component, useState, useEffect } from "react";
import { 
    Dimensions, 
    StyleSheet, 
    View, 
    ScrollView, 
    Text, 
    Image,
    TouchableOpacity,
    BackHandler,
    Alert
} from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from '@react-native-community/google-signin';
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

async function logOut(props){
  await AsyncStorage.removeItem('loginStatus');
  LoginManager.logOut();
  GoogleSignin.revokeAccess();
  GoogleSignin.signOut();
  auth().signOut();
  props.navigation.navigate("Login");
}

function Dashboard(props) {
  const [mainDueAmount, setMainDueAmount] = React.useState("Rs. 0 /-");
  const [incomeAmount, setIncomeAmount] = React.useState("Rs. 0 /-");
  const [expenseAmount, setExpenseAmount] = React.useState("Rs. 0 /-");
  const [flatNo, setFlatNo] = React.useState("-");
  var currentMonth = firestore.Timestamp.now().toDate().getMonth()+1 + "-" + firestore.Timestamp.now().toDate().getFullYear();
  var currentDay = firestore.Timestamp.now().toDate().getDate().toString();

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    async function fetchData(){
      var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
      setFlatNo(userInfo.flatNo);

      //Penalty Raising for everyone
      var penaltyFlag = await AsyncStorage.getItem('penaltyFlag');
      firestore().collection('settings').doc('settings').get().then((doc)=>{
        var data = doc.data();
        var mDate = data.maintainanceLastDate;
        if(currentDay>mDate && penaltyFlag=="0"){
          raisePenalty(data.penaltyPerDay);
        }
      });

      //Getting & Setting Maintainance Due Amount
      firestore().collection('maintainance').doc('allFlats').collection(userInfo.flatNo.toString()).doc(currentMonth.toString()).onSnapshot(async (doc)=>{
        var tAmount = 0;
        if(doc.exists){
          var mdata = doc.data();
          if(mdata.status=="UNPAID"){
              firestore().collection('maintainance').doc('allFlats').collection(userInfo.flatNo.toString()).onSnapshot((allDoc)=>{
                  allDoc.forEach((adoc)=>{
                      var data = adoc.data();
                      if(data.status=="UNPAID"){
                          tAmount = tAmount +  parseInt(parseInt(data.amount) + parseInt(data.penalty));
                          setMainDueAmount("Rs. " + tAmount + "/-");
                      }
                  })
              });
          }else{
              setMainDueAmount("Rs. 0 /-");
          }
        }
      });

      //Getting & Setting Total Income 
      firestore().collection('incomes').onSnapshot((docSnap)=>{
        var totalIncome = 0;
        docSnap.forEach((doc)=>{
          var data = doc.data();
          var timeStamp = data.timeStamp.toDate().getMonth()+1 + "-" + data.timeStamp.toDate().getFullYear();
          if(timeStamp.toString() == currentMonth){
            totalIncome = totalIncome + parseInt(data.amount);
          }
        })
        setIncomeAmount("Rs. " + totalIncome + " /-");
      });

      //Getting & Setting Total Expenses 
      firestore().collection('expenses').onSnapshot((docSnap)=>{
        var totalExpense = 0;
        docSnap.forEach((doc)=>{
          var data = doc.data();
          var timeStamp = data.timeStamp.toDate().getMonth()+1 + "-" + data.timeStamp.toDate().getFullYear();
          if(timeStamp.toString() == currentMonth){
            totalExpense = totalExpense + parseInt(data.amount);
          }
        })
        setExpenseAmount("Rs. " + totalExpense + " /-");
      });
    }
    fetchData();
    return () =>
        BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  async function raisePenalty(pAmt){
    firestore().collection('flats').get().then((docSnap)=>{
      docSnap.forEach(async (doc)=>{
        var data = doc.data();
        var flat = data.flatWing+"-"+data.flatNo;
        await firestore().collection("maintainance").doc("allFlats").collection(flat).doc(currentMonth).get().then(async (adoc)=>{
          var aData = adoc.data();
          if(aData.status=="UNPAID" && aData.penalty=="0"){
            await firestore().collection('maintainance').doc('allFlats')
            .collection(flat).get().then((allDoc)=>{
                allDoc.forEach(async (aaDoc)=>{
                    var ndata = aaDoc.data();
                    if(ndata.status=="UNPAID"){
                        var newPenalty = parseInt(pAmt) + parseInt(ndata.penalty);
                        await aaDoc.ref.update({
                            'penalty': newPenalty.toString(),
                        });
                    }   
                });
            });
          }
        });
      });
    }).then(async ()=>{
      await AsyncStorage.setItem('penaltyFlag',"1");
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.scrollArea1}>
        <ScrollView
          horizontal={false}
          contentContainerStyle={styles.scrollArea1_contentContainerStyle}
        >
          <View style={styles.topSection}>
            <View style={styles.mainStats}>
                <Text style={styles.title}>Flat no: {flatNo}</Text>
              <View style={styles.currentMonthRow}>
                <Text style={styles.currentMonth}>Current Month:</Text>
                <Text style={styles.month}>{currentMonth}</Text>
              </View>
              <View style={styles.subMainStatGroup}>
                <View style={styles.subMainStat}>
                  <Text style={styles.maintainanaceDue}>
                    Your Due Maintenance:
                  </Text>
                  <Text style={styles.maintainanceAmount}>{mainDueAmount}</Text>
                  <View style={styles.miniDividerStyle} />
                  <View style={styles.totalIncomeRow}>
                    <Text style={styles.totalIncome}>Total Income:</Text>
                    <Text style={styles.totalExpenses}>Total Expenses:</Text>
                  </View>
                  <View style={styles.incomeRow}>
                    <Text style={styles.income}>{incomeAmount}</Text>
                    <Text style={styles.expense}>{expenseAmount}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.btn1Row}>
            <TouchableOpacity 
                onPress={() => {
                  BackHandler.removeEventListener("hardwareBackPress", backAction); 
                  props.navigation.navigate('Maintenance');
                }}
                style={styles.btn1}
              >
                <View style={styles.maintainance}>
                  <Image
                    source={require("../assets/images/maintenance.png")}
                    resizeMode="contain"
                    style={styles.pay}
                  ></Image>
                  <Text style={styles.payText}>Maintenance</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  BackHandler.removeEventListener("hardwareBackPress", backAction); 
                  props.navigation.navigate('Notices');
                }}
                style={styles.btn2}
              >
                <View style={styles.notices}>
                  <Image
                    source={require("../assets/images/notice.png")}
                    resizeMode="contain"
                    style={styles.img2}
                  ></Image>
                  <Text style={styles.img2Text}>Notices</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.btn3Row}>
            <TouchableOpacity 
                onPress={() => {
                  BackHandler.removeEventListener("hardwareBackPress", backAction); 
                  props.navigation.navigate('Incomes');
                }}
                style={styles.btn3}
              >
                <View style={styles.incomes}>
                  <Image
                    source={require("../assets/images/income.png")}
                    resizeMode="contain"
                    style={styles.img3}
                  ></Image>
                  <Text style={styles.img3Text}>Income</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  BackHandler.removeEventListener("hardwareBackPress", backAction); 
                  props.navigation.navigate('Expenses');
                }}
                style={styles.btn4}
              >
                <View style={styles.expenses}>
                  <Image
                    source={require("../assets/images/expense.png")}
                    resizeMode="contain"
                    style={styles.img4}
                  ></Image>
                  <Text style={styles.img4Text}>Expenses</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.btn5Row}>
            <TouchableOpacity 
                onPress={() => {
                  BackHandler.removeEventListener("hardwareBackPress", backAction); 
                  props.navigation.navigate('SkyFamily');
                }}
                style={styles.btn5}
              >
                <View style={styles.vehicles}>
                  <Image
                    source={require("../assets/images/family.png")}
                    resizeMode="contain"
                    style={styles.img5}
                  ></Image>
                  <Text style={styles.img5Text}>Sky Family</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  BackHandler.removeEventListener("hardwareBackPress", backAction); 
                  props.navigation.navigate('MyProfile');
                }}
                style={styles.btn6}
              >
                <View style={styles.myProfile}>
                  <Image
                    source={require("../assets/images/profile.png")}
                    resizeMode="contain"
                    style={styles.img6}
                  ></Image>
                  <Text style={styles.img6Text}>My Profile</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.logOutGroup}>
            <TouchableOpacity 
                onPress={() => {
                  BackHandler.removeEventListener("hardwareBackPress", backAction); 
                  props.navigation.navigate('AboutSky');
                }}
            >
              <View style={styles.aboutBtn}>
                <Text style={styles.about}>About Sky</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
                onPress={() => logOut(props)}
            >
              <View style={styles.logoutBtn}>
                <Text style={styles.logout}>Logout</Text>
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
    justifyContent: "center",
  },
  scrollArea1: {
    backgroundColor: COLORS.bgColor,
    alignSelf: "center"
  },
  scrollArea1_contentContainerStyle: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  },
  topSection: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.25,
    marginTop: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    alignSelf: 'center',
  },
  mainStats: {
    backgroundColor: COLORS.bgDashStat,
    borderWidth: SCREEN_WIDTH * 0.015,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.04
  },
  currentMonth: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.05,
    textDecorationLine: "underline",
  },
  month: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  title: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.055,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  currentMonthRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.01,
    alignSelf: 'center',
  },
  subMainStatGroup: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.21,
  },
  subMainStat: {
    backgroundColor: COLORS.bgDashSubStat,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    height: SCREEN_HEIGHT * 0.19,
    marginTop: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.85,
    alignSelf: 'center',
  },
  maintainanaceDue: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.043,
    textDecorationLine: "underline",
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  maintainanceAmount: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.053,
    fontWeight: 'bold',
    textAlign: "left",
    alignSelf: 'center',
  },
  totalIncome: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.035,
    textDecorationLine: "underline",
    fontWeight: 'bold',
    textAlign: "left",
    alignSelf: 'center',
    marginLeft: SCREEN_WIDTH * 0.13,
  },
  totalExpenses: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.035,
    textDecorationLine: "underline",
    fontWeight: 'bold',
    textAlign: "left",
    alignSelf: 'center',
    marginLeft: SCREEN_WIDTH * 0.15,
  },
  totalIncomeRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.85,
  },
  income: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.043,
    fontWeight: 'bold',
    textAlign: "left",
    alignSelf: 'center',
    marginLeft: SCREEN_WIDTH * 0.125,
  },
  expense: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.043,
    fontWeight: 'bold',
    textAlign: "left",
    alignSelf: 'center',
    marginLeft: SCREEN_WIDTH * 0.235,
  },
  incomeRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.85,
  },
  bottomSection: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.75,
    marginTop: SCREEN_HEIGHT * 0.085,
    alignItems: 'center',
  },
  btn1: {
    marginLeft: SCREEN_WIDTH * 0.08,
  },
  maintainance: {
    width: SCREEN_WIDTH * 0.33,
    height: SCREEN_HEIGHT * 0.15,
    backgroundColor: COLORS.dashBtnColor,
    borderWidth: SCREEN_WIDTH * 0.012,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.05,
    alignSelf: 'center'
  },
  pay: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.1,
    alignSelf: 'center',
  },
  payText: {
    color: COLORS.whiteTxt,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: SCREEN_HEIGHT * 0.009,
  },
  btn2: {
    marginLeft: SCREEN_WIDTH * 0.18,
  },
  notices: {
    width: SCREEN_WIDTH * 0.33,
    height: SCREEN_HEIGHT * 0.15,
    backgroundColor: COLORS.dashBtnColor,
    borderWidth: SCREEN_WIDTH * 0.012,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.05,
    alignSelf: 'center'
  },
  img2: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.1,
    alignSelf: 'center',
  },
  img2Text: {
    color: COLORS.whiteTxt,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: SCREEN_HEIGHT * 0.009,
  },
  btn1Row: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: 'row',
  },
  btn3: {
    marginLeft: SCREEN_WIDTH * 0.08,
  },
  incomes: {
    width: SCREEN_WIDTH * 0.33,
    height: SCREEN_HEIGHT * 0.15,
    backgroundColor: COLORS.dashBtnColor,
    borderWidth: SCREEN_WIDTH * 0.012,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.05,
    alignSelf: 'center'
  },
  img3: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.1,
    alignSelf: 'center',
  },
  img3Text: {
    color: COLORS.whiteTxt,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: SCREEN_HEIGHT * 0.009,
  },
  btn4: {
    marginLeft: SCREEN_WIDTH * 0.18,
  },
  expenses: {
    width: SCREEN_WIDTH * 0.33,
    height: SCREEN_HEIGHT * 0.15,
    backgroundColor: COLORS.dashBtnColor,
    borderWidth: SCREEN_WIDTH * 0.012,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.05,
    alignSelf: 'center'
  },
  img4: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.1,
    alignSelf: 'center',
  },
  img4Text: {
    color: COLORS.whiteTxt,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: SCREEN_HEIGHT * 0.009,
  },
  btn3Row: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  btn5: {
    marginLeft: SCREEN_WIDTH * 0.08,
  },
  vehicles: {
    width: SCREEN_WIDTH * 0.33,
    height: SCREEN_HEIGHT * 0.15,
    backgroundColor: COLORS.dashBtnColor,
    borderWidth: SCREEN_WIDTH * 0.012,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.05,
    alignSelf: 'center'
  },
  img5: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.1,
    alignSelf: 'center',
  },
  img5Text: {
    color: COLORS.whiteTxt,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: SCREEN_HEIGHT * 0.009,
  },
  btn6: {
    marginLeft: SCREEN_WIDTH * 0.18,
  },
  myProfile: {
    width: SCREEN_WIDTH * 0.33,
    height: SCREEN_HEIGHT * 0.15,
    backgroundColor: COLORS.dashBtnColor,
    borderWidth: SCREEN_WIDTH * 0.012,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.05,
    alignSelf: 'center'
  },
  img6: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.1,
    alignSelf: 'center',
  },
  img6Text: {
    color: COLORS.whiteTxt,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: SCREEN_HEIGHT * 0.009,
  },
  btn5Row: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  logOutGroup: {
    width: SCREEN_WIDTH * 0.9,
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.03,
    marginLeft: SCREEN_WIDTH * 0.1,
  },
  logoutBtn: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: COLORS.dashBtnColor,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.05,
    marginLeft: SCREEN_WIDTH * 0.05,
  },
  logout: {
    color: COLORS.whiteTxt,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.05,
    marginTop: SCREEN_HEIGHT * 0.009
  },
  aboutBtn: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.055,
    backgroundColor: COLORS.dashBtnColor,
    borderWidth: SCREEN_WIDTH * 0.005,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.05,
    marginLeft: SCREEN_WIDTH * 0.13,
  },
  about: {
    color: COLORS.whiteTxt,
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.048,
    marginTop: SCREEN_HEIGHT * 0.009
  },
  miniDividerStyle: {
    borderBottomColor: COLORS.blackTxt,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    borderBottomWidth: SCREEN_HEIGHT * 0.003,
    marginTop: SCREEN_HEIGHT * 0.015,
    borderRadius: SCREEN_WIDTH,
  },
});

export default Dashboard;
