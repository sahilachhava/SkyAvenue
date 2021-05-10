import React, { Component, useState, useEffect, useCallback  } from "react";
import { 
    StyleSheet, 
    View, 
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    Text
} from "react-native";
import firestore from '@react-native-firebase/firestore';
import ProgressBar from 'react-native-progress/Bar';
import MonthPicker from 'react-native-month-year-picker';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

function Accounts(props) {
    const [loader, setLoader] = React.useState(false);
    const [flag, setFlag] = React.useState(false);
    const [date, setDate] = useState(firestore.Timestamp.now().toDate().getMonth()+1 + "-" + firestore.Timestamp.now().toDate().getFullYear());
    const [show, setShow] = useState(false);
    const currentMonth = firestore.Timestamp.now().toDate().getMonth()+1 + "-" + firestore.Timestamp.now().toDate().getFullYear();
    const [incomes, setIncomes] = React.useState([]);
    const [expenses, setExpenses] = React.useState([]);

    useEffect(() => {
        props.navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setShow(true)}
              style={{marginRight: SCREEN_WIDTH * 0.03}}
            >
              <Image
                source={require("../assets/images/calender.png")}
                resizeMode="contain"
                style={{width: SCREEN_WIDTH * 0.07, height: SCREEN_HEIGHT * 0.07}}
              ></Image>
            </TouchableOpacity>
          ),
        });

        async function fetchData(){
            if(incomes.length == 0 && expenses.length == 0){
                //Getting & Setting Incomes
                await firestore().collection("incomes").get().then((docSnap)=>{
                    var cash = 0;
                    var cheque = 0;
                    var mBanking = 0;
                    var total = 0;
                    docSnap.forEach((doc)=>{
                        var data = doc.data();
                        var incMonth = parseInt(data.timeStamp.toDate().getMonth()+1) + "-" + data.timeStamp.toDate().getFullYear();
                        if(incMonth==currentMonth){
                            if(data.paidBy=="Cash"){
                                cash = cash + parseInt(data.amount);
                                total = total + parseInt(data.amount);
                            }else if(data.paidBy=="Cheque"){
                                cheque = cheque + parseInt(data.amount);
                                total = total + parseInt(data.amount);
                            }else if(data.paidBy=="M-Banking"){
                                mBanking = mBanking + parseInt(data.amount);
                                total = total + parseInt(data.amount);
                            }
                        }
                    })
                    setIncomes([cash,cheque,mBanking,total]);
                });

                //Getting & Setting Expenses
                await firestore().collection("expenses").get().then((docSnap)=>{
                    var cash = 0;
                    var cheque = 0;
                    var mBanking = 0;
                    var total = 0;
                    docSnap.forEach((doc)=>{
                        var data = doc.data();
                        var expMonth = parseInt(data.timeStamp.toDate().getMonth()+1) + "-" + data.timeStamp.toDate().getFullYear();
                        if(expMonth==currentMonth){
                            if(data.paidBy=="Cash"){
                                cash = cash + parseInt(data.amount);
                                total = total + parseInt(data.amount);
                            }else if(data.paidBy=="Cheque"){
                                cheque = cheque + parseInt(data.amount);
                                total = total + parseInt(data.amount);
                            }else if(data.paidBy=="M-Banking"){
                                mBanking = mBanking + parseInt(data.amount);
                                total = total + parseInt(data.amount);
                            }
                        }
                    })
                    setExpenses([cash,cheque,mBanking,total]);
                }).then(()=>{
                    setLoader(true);
                    setFlag(true);
                })
            }
        }
        if(flag==false){
            fetchData();
        }
    });

    async function fetchCustomData(selectedDate){
        var month = selectedDate.split('-')[0];
        var customMonth = "";
        var index = month.charAt(0);
        if (index == "0") {
            customMonth = month.charAt(1) + "-" + selectedDate.split('-')[1];
        }
        setLoader(false);
        //Getting & Setting Incomes
        await firestore().collection("incomes").get().then((docSnap)=>{
            var cash = 0;
            var cheque = 0;
            var mBanking = 0;
            var total = 0;
            docSnap.forEach((doc)=>{
                var data = doc.data();
                var incMonth = parseInt(data.timeStamp.toDate().getMonth()+1) + "-" + data.timeStamp.toDate().getFullYear();
                if(incMonth==customMonth){
                    if(data.paidBy=="Cash"){
                        cash = cash + parseInt(data.amount);
                        total = total + parseInt(data.amount);
                    }else if(data.paidBy=="Cheque"){
                        cheque = cheque + parseInt(data.amount);
                        total = total + parseInt(data.amount);
                    }else if(data.paidBy=="M-Banking"){
                        mBanking = mBanking + parseInt(data.amount);
                        total = total + parseInt(data.amount);
                    }
                }
            })
            setIncomes([cash,cheque,mBanking,total]);
        });

        //Getting & Setting Expenses
        await firestore().collection("expenses").get().then((docSnap)=>{
            var cash = 0;
            var cheque = 0;
            var mBanking = 0;
            var total = 0;
            docSnap.forEach((doc)=>{
                var data = doc.data();
                var expMonth = parseInt(data.timeStamp.toDate().getMonth()+1) + "-" + data.timeStamp.toDate().getFullYear();
                if(expMonth==customMonth){
                    if(data.paidBy=="Cash"){
                        cash = cash + parseInt(data.amount);
                        total = total + parseInt(data.amount);
                    }else if(data.paidBy=="Cheque"){
                        cheque = cheque + parseInt(data.amount);
                        total = total + parseInt(data.amount);
                    }else if(data.paidBy=="M-Banking"){
                        mBanking = mBanking + parseInt(data.amount);
                        total = total + parseInt(data.amount);
                    }
                }
            })
            setExpenses([cash,cheque,mBanking,total]);
        }).then(()=>{
            setLoader(true);
        });
    }

    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || date;
            setShow(false);
            setDate(selectedDate);
            if(selectedDate!=currentMonth){
                fetchCustomData(selectedDate);
            }
        },
        [date, setShow],
    );

    return (
        <View style={styles.container}>
        <View style={styles.scrollArea1}>
            <ScrollView
            horizontal={false}
            contentContainerStyle={styles.scrollArea1_contentContainerStyle}
            >
            <Text style={styles.accounts}>Month: {date}</Text>
            { loader ? 
            <View>
            <View style={styles.topSection1}>
            <View style={styles.mainStats1}>
                <View style={styles.currentMonth1Row}>
                    <Text style={styles.currentMonth1}>Income</Text>
                </View>
                <View style={styles.maintenanceTextRow}>
                    <Text style={styles.maintenanceText}>Cash:</Text>
                    <Text style={styles.manAmount}>Rs. {incomes.length != 0 ? incomes[0] : "0"} /-</Text>
                </View>
                <View style={styles.penaltyRow}>
                    <Text style={styles.penalty}>Cheque:</Text>
                    <Text style={styles.penAmount}>Rs. {incomes.length != 0 ? incomes[1] : "0"} /-</Text>
                </View>
                <View style={styles.penalty1Row}>
                    <Text style={styles.penalty1}>M-Banking:</Text>
                    <Text style={styles.pen1Amount}>Rs. {incomes.length != 0 ? incomes[2] : "0"} /-</Text>
                </View>
                <View style={styles.miniDividerStyle} />
                <View style={styles.totalDueRow}>
                    <Text style={styles.totalDue}>Total Income:</Text>
                    <Text style={styles.totalAmount}>Rs. {incomes.length != 0 ? incomes[3] : "0"} /-</Text>
                </View>
            </View>
            </View>

            <View style={styles.topSection1}>
            <View style={styles.mainStats1}>
                <View style={styles.currentMonth1Row}>
                    <Text style={styles.currentMonth1}>Expense</Text>
                </View>
                <View style={styles.maintenanceTextRow}>
                    <Text style={styles.maintenanceText}>Cash:</Text>
                    <Text style={styles.manAmount}>Rs. {expenses.length != 0 ? expenses[0] : "0"} /-</Text>
                </View>
                <View style={styles.penaltyRow}>
                    <Text style={styles.penalty}>Cheque:</Text>
                    <Text style={styles.penAmount}>Rs. {expenses.length != 0 ? expenses[1] : "0"} /-</Text>
                </View>
                <View style={styles.penalty1Row}>
                    <Text style={styles.penalty1}>M-Banking:</Text>
                    <Text style={styles.pen1Amount}>Rs. {expenses.length != 0 ? expenses[2] : "0"} /-</Text>
                </View>
                <View style={styles.miniDividerStyle} />
                <View style={styles.totalDueRow}>
                    <Text style={styles.totalDue}>Total Expenses:</Text>
                    <Text style={{...styles.totalAmount, marginLeft: SCREEN_WIDTH * 0.275}}>Rs. {expenses.length != 0 ? expenses[3] : "0"} /-</Text>
                </View>
            </View>
            </View>

            <View style={styles.topSection1}>
            <View style={{...styles.mainStats1, height: SCREEN_HEIGHT * 0.24}}>
                <View style={styles.currentMonth1Row}>
                    <Text style={styles.currentMonth1}>Sky Money Balance</Text>
                </View>
                <View style={styles.maintenanceTextRow}>
                    <Text style={styles.maintenanceText}>Cash:</Text>
                    <Text style={styles.manAmount}>Rs. {expenses.length != 0 ? (incomes[0] - expenses[0]) : "0"} /-</Text>
                </View>
                <View style={styles.maintenanceTextRow}>
                    <Text style={styles.maintenanceText}>Bank:</Text>
                    <Text style={styles.manAmount}>Rs. {expenses.length != 0 ? ((incomes[1]+incomes[2]) - (expenses[1]+expenses[2])) : "0"} /-</Text>
                </View>
                <View style={styles.miniDividerStyle} />
                <View style={styles.totalDueRow}>
                    <Text style={styles.totalDue}>Total Balance:</Text>
                    <Text style={{...styles.totalAmount, marginLeft: SCREEN_WIDTH * 0.315}}>Rs. {expenses.length != 0 ? ((incomes[0] - expenses[0]) + ((incomes[1]+incomes[2]) - (expenses[1]+expenses[2]))) : "0"} /-</Text>
                </View>
            </View>
            </View>
            </View>
            :
            <View>
                <ProgressBar 
                style={{
                    marginTop: SCREEN_HEIGHT * 0.4,
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
                >Getting details...</Text>
            </View>
            }
            </ScrollView>
        </View>
        {/* Month Picker Section */}
        {show && (
                <MonthPicker
                    onChange={onValueChange}
                    value={date}
                    minimumDate={new Date(2020, 8)}
                    maximumDate={new Date()}
                    enableAutoDarkMode={true}
                />
            )}
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
  accounts: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.055,
    textAlign: "center",
    fontWeight: 'bold',
    textDecorationLine: "underline",
    marginTop: SCREEN_HEIGHT * 0.025,
  },
  topSection1: {
    marginTop: SCREEN_HEIGHT * 0.015,
    alignItems: 'center',
    alignSelf: 'center',
  },
  mainStats1: {
    backgroundColor: COLORS.blackTxt,
    borderWidth: SCREEN_WIDTH * 0.003,
    height: SCREEN_HEIGHT * 0.29,
    width: SCREEN_WIDTH * 0.9,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.04
  },
  currentMonth1: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.055,
    textDecorationLine: "underline",
  },
  currentMonth1Row: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.01,
    alignSelf: 'center',
  },
  maintenanceTextRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  maintenanceText: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.05,
    textDecorationLine: "underline",
  },
  manAmount: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.45,
  },
  penalty: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.05,
    textDecorationLine: "underline",
  },
  penAmount: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.407,
  },
  penaltyRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  penalty1: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.05,
    textDecorationLine: "underline",
  },
  pen1Amount: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.353,
  },
  penalty1Row: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  totalDue: {
    color: COLORS.whiteTxt,
    fontWeight: 'bold',
    fontSize: SCREEN_WIDTH * 0.04,
    marginLeft: SCREEN_WIDTH * 0.05,
    textDecorationLine: "underline",
  },
  totalAmount: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.32,
  },
  totalDueRow: {
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  miniDividerStyle: {
    borderBottomColor: COLORS.whiteTxt,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: 'center',
    borderBottomWidth: SCREEN_HEIGHT * 0.0025,
    marginTop: SCREEN_HEIGHT * 0.015,
    borderRadius: SCREEN_WIDTH,
  },
});

export default Accounts;
