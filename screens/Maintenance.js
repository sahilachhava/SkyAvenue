import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import ProgressBar from 'react-native-progress/Bar';
import Timeline from 'react-native-timeline-flatlist';
import RazorpayCheckout from 'react-native-razorpay';
import RNSimpleCrypto from "react-native-simple-crypto";
import {COLORS} from './Colors';

const toHex = RNSimpleCrypto.utils.convertArrayBufferToHex;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

function Maintenance(props) {
    const [loader, setLoader] = React.useState(false);
    var [maintenance, setMaintenance] = React.useState([]);
    const [mainDueAmount, setMainDueAmount] = React.useState("Rs. 0 /-");
    const [penaltyAmount, setPenaltyAmount] = React.useState("Rs. 0 /-");
    const [totalAmount, setTotalAmount] = React.useState("Rs. 0 /-");
    const [orderID, setOrderID] = React.useState(null);
    const currentMonth = firestore.Timestamp.now().toDate().getMonth()+1 + "-" + firestore.Timestamp.now().toDate().getFullYear();
    
    useEffect(() => {
        async function fetchData(){
            var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));

            //Getting & Setting Maintainance Amount
            firestore().collection('maintainance').doc('allFlats').collection(userInfo.flatNo.toString()).doc(currentMonth.toString()).onSnapshot(async (doc)=>{
                var amount = 0;
                var penalty = 0;
                var tAmount = 0;
                if(doc.exists){
                    var mdata = doc.data();
                    if(mdata.status=="UNPAID"){
                        await firestore().collection('maintainance').doc('allFlats').collection(userInfo.flatNo.toString()).get().then((allDoc)=>{
                            allDoc.forEach((adoc)=>{
                                var data = adoc.data();
                                if(data.status=="UNPAID"){
                                    amount = amount + parseInt(data.amount);
                                    penalty = penalty + parseInt(data.penalty);
                                    tAmount = tAmount +  parseInt(parseInt(data.amount) + parseInt(data.penalty));
                                    setMainDueAmount("Rs. " + amount + "/-");
                                    setPenaltyAmount("Rs. " + penalty + "/-");
                                    setTotalAmount("Rs. " + tAmount + "/-");
                                }
                            })
                        });
                    }else{
                        setMainDueAmount("Rs. 0 /-");
                        setPenaltyAmount("Rs. 0 /-");
                        setTotalAmount("Rs. 0 /-");
                    }
                }
            });

            //Getting & Setting All months maintenance of current users
            await firestore().collection('maintainance').doc("allFlats").collection(userInfo.flatNo).orderBy("timeStamp","desc").get().then((docSnap)=>{
                var maintenanceData = [];
                var redFlag = false;
                var greenFlag = false;
                var blueFlag = false;
                docSnap.forEach((doc)=>{
                    var data = doc.data();
                    var timeStamp = data.timeStamp.toDate().getDate() + "/" + parseInt(data.timeStamp.toDate().getMonth()+1) + "/" + data.timeStamp.toDate().getFullYear();
                    var time = "";
                    var hours = data.timeStamp.toDate().getHours();
                    if(hours<12){
                        var am = "AM";
                        if(hours==0){
                        time = "12:" + data.timeStamp.toDate().getMinutes() +" "+am;
                        if(data.timeStamp.toDate().getMinutes()==0){
                            time = "12:00 "+am;
                        }else if(data.timeStamp.toDate().getMinutes()<=9){
                            time = "12:0" + data.timeStamp.toDate().getMinutes() +" "+am;
                        }
                        }else{
                        time = data.timeStamp.toDate().getHours() + ":" + data.timeStamp.toDate().getMinutes() +" "+am;
                        if(data.timeStamp.toDate().getMinutes()==0){
                            time = data.timeStamp.toDate().getHours() + ":" + data.timeStamp.toDate().getMinutes() +"0 "+am;
                        }else if(data.timeStamp.toDate().getMinutes()<=9){
                            time = data.timeStamp.toDate().getHours() + ":0" + data.timeStamp.toDate().getMinutes() +" "+am;
                        }
                        }
                    }else{
                        var pm = "PM";
                        var cHour = hours - 12;
                        time = cHour + ":" + data.timeStamp.toDate().getMinutes() +" "+pm;
                        if(data.timeStamp.toDate().getMinutes()==0){
                        time = cHour + ":" + data.timeStamp.toDate().getMinutes() +"0 "+pm;
                        }else if(data.timeStamp.toDate().getMinutes()<=9){
                        time = cHour + ":0" + data.timeStamp.toDate().getMinutes() +" "+pm;
                        }
                    }
                    if(data.status=="UNPAID"){
                        if(redFlag==false){
                            var singleMaintenance = {
                                time: parseInt(data.amount) + parseInt(data.penalty),
                                title: data.month + " Maintenance: " + data.status,
                                description: "Amount: " + data.amount + "\n\nPenalty: " + data.penalty + "\n\nNarration:\n" + data.narration + "\n\nInitiated on: " + timeStamp + " "+time,
                                lineColor: 'red', 
                            };
                            redFlag=true;
                            greenFlag=false;
                            maintenanceData.push(singleMaintenance);
                        }else if(greenFlag==false){
                            var singleMaintenance = {
                                time: parseInt(data.amount) + parseInt(data.penalty),
                                title: data.month + " Maintenance: " + data.status,
                                description: "Amount: " + data.amount + "\n\nPenalty: " + data.penalty + "\n\nNarration:\n" + data.narration + "\n\nInitiated on: " + timeStamp + " "+time,
                                lineColor: 'green', 
                            };
                            greenFlag=true;
                            blueFlag=false;
                            maintenanceData.push(singleMaintenance);
                        }else if(blueFlag==false){
                            var singleMaintenance = {
                                time: parseInt(data.amount) + parseInt(data.penalty),
                                title: data.month + " Maintenance: " + data.status,
                                description: "Amount: " + data.amount + "\n\nPenalty: " + data.penalty + "\n\nNarration:\n" + data.narration + "\n\nInitiated on: " + timeStamp + " "+time,
                                lineColor: '#0652DD', 
                            };
                            blueFlag=true;
                            redFlag=false;
                            maintenanceData.push(singleMaintenance);
                        }
                    }else{
                        if(redFlag==false){
                            var singleMaintenance = {
                                time: data.status,
                                title: data.month + " - Maintenance",
                                description: "Amount: " + data.amount + "\n\nPenalty: " + data.penalty + "\n\nPaid By: "+ data.paidBy  +"\n\nNarration:\n" + data.narration + "\n\nPaid on: " + timeStamp + " "+time,
                                lineColor: 'red', 
                            };
                            redFlag=true;
                            greenFlag=false;
                            maintenanceData.push(singleMaintenance);
                        }else if(greenFlag==false){
                            var singleMaintenance = {
                                time: data.status,
                                title: data.month + " - Maintenance",
                                description: "Amount: " + data.amount + "\n\nPenalty: " + data.penalty + "\n\nPaid By: "+ data.paidBy +"\n\nNarration:\n" + data.narration + "\n\nPaid on: " + timeStamp + " "+time,
                                lineColor: 'green', 
                            };
                            greenFlag=true;
                            blueFlag=false;
                            maintenanceData.push(singleMaintenance);
                        }else if(blueFlag==false){
                            var singleMaintenance = {
                                time: data.status,
                                title: data.month + " - Maintenance",
                                description: "Amount: " + data.amount + "\n\nPenalty: " + data.penalty + "\n\nPaid By: "+ data.paidBy +"\n\nNarration:\n" + data.narration + "\n\nPaid on: " + timeStamp + " "+time,
                                lineColor: '#0652DD', 
                            };
                            blueFlag=true;
                            redFlag=false;
                            maintenanceData.push(singleMaintenance);
                        }
                    }
                })
                return maintenanceData;
              }).then(async (maintenanceData)=>{
                setMaintenance(maintenanceData);
                setLoader(true);
              })
        }
        fetchData();
    }, []);

    async function getOrderID(){
      var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
      var amount = totalAmount.replace("Rs. ","").replace("/-","");
      var receiptNo = userInfo.flatNo+ " ("+currentMonth+")";
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Basic cnpwX2xpdmVfdXdhUGU3UDg5MERjRlE6M1liMVZaNXVyNGlDRHIwM1hTN2xkQkpP");
      //Test API myHeaders.append("Authorization", "Basic cnpwX3Rlc3RfVFBCWHFUNEVueUJWVFo6dDBRVDFtZGJ0Y2c5OWZTZTdTanRWV25I");
      var raw = JSON.stringify({
        "amount": amount.toString()+"00",
        "currency":"INR",
        "receipt": receiptNo,
        "payment_capture":1
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      fetch("https://api.razorpay.com/v1/orders", requestOptions)
        .then(response => response.json())
        .then(result => {
          setOrderID(result.id);
        })
        .catch(error => alert(error + "\nOrder creation failed!!\nPlease try again!"));
    }

    async function confirmPay(){
      if(totalAmount=="Rs. 0 /-"){
        alert("No maintenance due!! Well Done");
      }else{
        await getOrderID();
        Alert.alert("Pay Now!", "Maintainence "+totalAmount+"\nMaintainence ID: "+orderID, [
          {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
          },
          { text: "YES", onPress: () => waitForOrderID() }
        ]);
      }
    }

    function waitForOrderID(){
      if(orderID!="undefined" && orderID!=null){
        payNow();
      }else{
        alert("Getting your maintainence ID from Sky Server,\nPlease wait for 3 seconds and pay again");
      }
    }

    async function payNow(props){
        var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
        if(loader==false){
            alert("Please wait!! Data is not yet fetched");
        }else{
            var amount = totalAmount.replace("Rs. ","").replace("/-","");
            var options = {
              description: userInfo.flatNo + ' Maintainence',
              image: 'https://skyavenue.web.app/assets/login/images/logo.png',
              currency: 'INR',
              //Test key: 'rzp_test_TPBXqT4EnyBVTZ',
              key: 'rzp_live_uwaPe7P890DcFQ',
              amount: amount.toString()+"00",
              name: 'Sky Avenue',
              order_id: orderID,
              prefill: {
                name: userInfo.userName
              },
              theme: {color: COLORS.bgColor}
            }
            RazorpayCheckout.open(options).then(async (data) => {
              const keyHmac = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer('3Yb1VZ5ur4iCDr03XS7ldBJO');
              const messageHmac = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(orderID + "|" + data.razorpay_payment_id);
              const generated_sign = await RNSimpleCrypto.HMAC.hmac256(messageHmac, keyHmac);
              if(toHex(generated_sign)==data.razorpay_signature){
                await firestore().collection("maintainance").doc("allFlats")
                .collection(userInfo.flatNo.toString()).get().then((docSnap)=>{
                  docSnap.forEach(async (doc)=>{
                    var timeStamp = firestore.Timestamp.now().toDate();
                    if(doc.data().status=="UNPAID"){
                      await doc.ref.update({
                        'timeStamp': timeStamp,
                        'status': "PAID",
                        'narration': userInfo.flatNo + " Maintainence Received",
                        'paidBy': "M-Banking",
                        'orderID': orderID,
                        'paymentID': data.razorpay_payment_id,
                      });
                    }
                  })
                }).then(async ()=>{
                  var timeStamp = firestore.Timestamp.now().toDate();
                  await firestore().collection("incomes").add({
                    'timeStamp': timeStamp,
                    'title': userInfo.flatNo + " Maintainence",
                    'narration': userInfo.flatNo + " Maintainence Received",
                    'paidBy': "M-Banking",
                    'amount': amount.toString(),
                    'orderID': orderID,
                    'type': 'Maintainance',
                  });
                }).then(()=>{
                  alert("Maintainence paid successfully!!");
                })
              }else{
                alert("Problem confirming your payment,\n If money is deducted then please contact administrator maintainence ID\nMaintainence ID: "+orderID);
              }
            }).catch((error) => {
              var desc = JSON.parse(error.description);
              alert(desc.error.description);
            });
        }
    }

    return (
        <View style={styles.container}>
        <View style={styles.scrollArea1}>
            <ScrollView
            horizontal={false}
            contentContainerStyle={styles.scrollArea1_contentContainerStyle}
            >
            <View style={styles.topSection1}>
                <View style={styles.mainStats1}>
                <View style={styles.currentMonth1Row}>
                    <Text style={styles.currentMonth1}>Current Month:</Text>
                    <Text style={styles.month1}>{currentMonth}</Text>
                </View>
                <View style={styles.maintenanceTextRow}>
                    <Text style={styles.maintenanceText}>Maintenance:</Text>
                    <Text style={styles.manAmount}>{mainDueAmount}</Text>
                </View>
                <View style={styles.penaltyRow}>
                    <Text style={styles.penalty}>Penalty:</Text>
                    <Text style={styles.penAmount}>{penaltyAmount}</Text>
                </View>
                <View style={styles.miniDividerStyle} />
                <View style={styles.totalDueRow}>
                    <Text style={styles.totalDue}>Total due:</Text>
                    <Text style={styles.totalAmount}>{totalAmount}</Text>
                </View>
                </View>
            </View>
            <View style={styles.searchBtn1}>
                <TouchableOpacity
                onPress={() => confirmPay()}
                style={styles.searchButton1}
                >
                <View style={styles.pay1Row}>
                    <Image
                    source={require("../assets/images/pay.png")}
                    resizeMode="contain"
                    style={styles.pay1}
                    ></Image>
                    <Text style={styles.paynow}>Pay Now</Text>
                </View>
                </TouchableOpacity>
            </View>
            <View style={styles.dividerStyle} />
            { loader ? 
            <Timeline
                data={maintenance}
                innerCircle={'dot'}
                circleSize={SCREEN_WIDTH * 0.05}
                circleColor='rgb(45,156,219)'
                lineColor='rgb(45,156,219)'
                style={styles.timeline}
                timeContainerStyle={styles.tContainerStyle}
                timeStyle={styles.tStyle}
                descriptionStyle={styles.descriptionText}
                detailContainerStyle={styles.detailContainer}
                options={styles.timelineOptions}
            />
            :
            <View>
                <ProgressBar 
                    style={{
                        marginTop: SCREEN_HEIGHT * 0.2,
                        width: SCREEN_WIDTH * 0.5,
                        alignSelf: 'center',
                    }}
                    size={30} 
                    indeterminate={true} 
                    color="#2c3e50"
                />
                <Text
                    style={{
                        marginTop: SCREEN_HEIGHT * 0.01,
                        width: SCREEN_WIDTH,
                        textAlign: 'center',
                    }}
                >Getting data...</Text>
            </View>
            }
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
  topSection1: {
    marginTop: SCREEN_HEIGHT * 0.03,
    alignItems: 'center',
    alignSelf: 'center',
  },
  mainStats1: {
    backgroundColor: COLORS.bgDashStat,
    borderWidth: SCREEN_WIDTH * 0.003,
    height: SCREEN_HEIGHT * 0.24,
    width: SCREEN_WIDTH * 0.9,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.04
  },
  currentMonth1: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.048,
    textDecorationLine: "underline",
  },
  month1: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.048,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.05,
  },
  currentMonth1Row: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.01,
    alignSelf: 'center',
  },
  maintenanceText: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.06,
    textDecorationLine: "underline",
  },
  manAmount: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.325,
  },
  maintenanceTextRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  penalty: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.06,
    textDecorationLine: "underline",
  },
  penAmount: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.42,
  },
  penaltyRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  totalDue: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.06,
    textDecorationLine: "underline",
  },
  totalAmount: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.4,
  },
  totalDueRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  searchBtn1: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.065,
    marginTop: SCREEN_HEIGHT * 0.025
  },
  searchButton1: {
    height: SCREEN_HEIGHT * 0.064,
    backgroundColor: COLORS.whiteTxt,
    borderWidth: 0,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center"
  },
  pay1: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06,
  },
  paynow: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.15,
    marginTop: SCREEN_HEIGHT * 0.0125
  },
  pay1Row: {
    height: SCREEN_HEIGHT * 0.5,
    flexDirection: "row",
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.01,
    marginLeft: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.002
  },
  miniDividerStyle: {
    borderBottomColor: COLORS.whiteTxt,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    borderBottomWidth: SCREEN_HEIGHT * 0.0025,
    marginTop: SCREEN_HEIGHT * 0.015,
    borderRadius: SCREEN_WIDTH,
  },
  dividerStyle: {
    borderBottomColor: COLORS.blackTxt,
    width: SCREEN_WIDTH * 0.95,
    alignSelf: 'center',
    borderBottomWidth: SCREEN_HEIGHT * 0.007,
    marginTop: SCREEN_HEIGHT * 0.03,
    borderRadius: SCREEN_WIDTH,
  },
  timeline: {
    width: SCREEN_WIDTH * 0.95,
    alignSelf:'center',
  },  
  timelineOptions: {
    width: SCREEN_WIDTH * 0.95,
    marginTop: SCREEN_HEIGHT * 0.04,
  },
  tContainerStyle: {
    marginTop: SCREEN_HEIGHT * 0.005,
    alignSelf: 'center',
  },
  detailContainer: {
    marginBottom: SCREEN_HEIGHT * 0.05, 
    paddingLeft: SCREEN_WIDTH * 0.08, 
    paddingRight: SCREEN_WIDTH * 0.02, 
    backgroundColor: COLORS.whiteTxt, 
    borderRadius: SCREEN_WIDTH * 0.05,
  },
  tStyle: {
    textAlign: 'center', 
    backgroundColor: COLORS.blackTxt, 
    color:COLORS.whiteTxt, 
    fontWeight: 'bold',
    padding: SCREEN_WIDTH * 0.032, 
    alignSelf: 'center',
    borderRadius: SCREEN_WIDTH * 0.03,
  },
  descriptionText:{
    color: COLORS.blackTxt,
    justifyContent: 'space-evenly',
  }
});

export default Maintenance;
