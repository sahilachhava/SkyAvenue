import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking
} from "react-native";
import firestore from '@react-native-firebase/firestore';
import ProgressBar from 'react-native-progress/Bar';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';
import { List, ListItem, Text, Left, Body, Right, Button } from 'native-base';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

function Vehicles(props) {
    var [vehicleDesign, setVehicleDesign] = React.useState([]);
    const [loader, setLoader] = React.useState(false);
    const [vehicleNo, setVehicleNo] = React.useState('');

    useEffect(() => {
        async function fetchUserVehicles(){
            var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
            await firestore().collection('members').doc(userInfo.flatNo).get().then(async (memberDoc)=>{
                var listDesign = [];
                var memData = memberDoc.data();
                var userName = memData.fName + " " + memData.lName;
                var mobileNo = memData.mobileNo;
                var flatNo = memData.flatNo;
                await memberDoc.ref.collection('vehicles').get().then((docSnap)=>{
                    docSnap.forEach((doc)=>{
                        var data = doc.data();
                        var vName = data.vehicleName;
                        var vNo = data.vehicleNo;
                        listDesign.push(
                            <ListItem thumbnail>
                            <Left>
                                <Text style={styles.thumbnailFlat}>{flatNo}</Text>
                            </Left>
                            <Body style={styles.itemBody}>
                                <Text  style={styles.vehicleName}>Owner Name:       {userName}</Text>
                                <Text style={styles.vehicleType}>Vehicle Model:    {vName}</Text>
                                <Text style={styles.vehicleNo}>Vehicle No:           {vNo}</Text>
                            </Body>
                            <Right>
                                <Button rounded style={styles.callBtn}  onPress={() =>  Linking.openURL(`tel:${mobileNo}`)}>
                                    <Icon iconStyle={styles.callIcon} name='call' color='#fff' />
                                </Button>
                            </Right>
                            </ListItem>
                        );
                    });
                    return listDesign;
                }).then((listDesign)=>{
                  if(listDesign.length==0){
                    listDesign.push(
                      <ListItem style={{marginTop: SCREEN_HEIGHT * 0.03}}>
                      <Body>
                          <Text  style={{fontWeight:'bold',alignSelf:'center'}}>You don't have any vehicles :(</Text>
                      </Body>
                      </ListItem>
                    );
                    setVehicleDesign(listDesign);
                    setLoader(true);
                  }else{
                    setVehicleDesign(listDesign);
                    setLoader(true);
                  }
                })
            })
        }
        fetchUserVehicles();
    }, []);

    async function getVehicleDetails(searchNo){
        if(searchNo==""){
            alert("Please enter valid vehicle number");
        }else{
            setLoader(false);
            await firestore().collection('members').get().then(async (docSnap)=>{
                setVehicleDesign([]);
                var flag = false;
                docSnap.forEach(async (memberDoc)=>{
                    var memData = memberDoc.data();
                    var userName = memData.fName + " " + memData.lName;
                    var mobileNo = memData.mobileNo;
                    var flatNo = memData.flatNo;
                    await memberDoc.ref.collection('vehicles').get().then((vSnap)=>{
                        vSnap.forEach((doc)=>{
                            var data = doc.data();
                            var vName = data.vehicleName;
                            var vNo = data.vehicleNo;
                            if(vNo.includes(searchNo)){
                                if(flag==false){
                                  setVehicleDesign([]);
                                }
                                flag = true;
                                setVehicleDesign(listDesign => [...listDesign,
                                    <ListItem thumbnail>
                                    <Left>
                                        <Text style={styles.thumbnailFlat}>{flatNo}</Text>
                                    </Left>
                                    <Body style={styles.itemBody}>
                                        <Text  style={styles.vehicleName}>Owner Name:       {userName}</Text>
                                        <Text style={styles.vehicleType}>Vehicle Model:    {vName}</Text>
                                        <Text style={styles.vehicleNo}>Vehicle No:           {vNo}</Text>
                                    </Body>
                                    <Right>
                                        <Button rounded style={styles.callBtn}  onPress={() =>  Linking.openURL(`tel:${mobileNo}`)}>
                                            <Icon iconStyle={styles.callIcon} name='call' color='#fff' />
                                        </Button>
                                    </Right>
                                    </ListItem>
                                ]);
                            }else{
                              if(flag==false){
                                setVehicleDesign([
                                  <ListItem style={{marginTop: SCREEN_HEIGHT * 0.03}}>
                                  <Body>
                                      <Text  style={{fontWeight:'bold',alignSelf:'center'}}>No vehicles found!</Text>
                                  </Body>
                                  </ListItem>
                                ]);
                              }
                            }
                        })
                    })
                })
            }).then(()=>{
                setLoader(true);
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
          <TextInput
            placeholder="Vehicle No (Ex. 1111)"
            textBreakStrategy="highQuality"
            placeholderTextColor="rgba(230, 230, 230,1)"
            returnKeyType="next"
            maxLength={4}
            returnKeyLabel="Next"
            clearTextOnFocus={true}
            enablesReturnKeyAutomatically={false}
            keyboardType="numeric"
            style={styles.vehicleTxt}
            onChangeText={text => setVehicleNo(text)}
            value={vehicleNo}
          ></TextInput>
          <View style={styles.searchBtn}>
            <TouchableOpacity
              onPress={() => getVehicleDetails(vehicleNo)}
              style={styles.searchButton}
            >
              <View style={styles.searchIconRow}>
                <Image
                  source={require("../assets/images/search.png")}
                  resizeMode="contain"
                  style={styles.searchIcon}
                ></Image>
                <Text style={styles.searchVehicle}>Search Vehicle</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.dividerStyle} />
          {/* Native Base List Started */}
          { loader ? 
            <List style={{marginTop: SCREEN_HEIGHT * 0.02, marginBottom: SCREEN_HEIGHT * 0.03}}>
              {vehicleDesign}
            </List>
          :
            <View>
                <ProgressBar 
                    style={{
                        marginTop: SCREEN_HEIGHT * 0.25,
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
                >Getting vehicle details...</Text>
            </View>
          }
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
  dividerStyle: {
    borderBottomColor: COLORS.blackTxt,
    width: SCREEN_WIDTH * 0.95,
    alignSelf: 'center',
    borderBottomWidth: SCREEN_HEIGHT * 0.007,
    marginTop: SCREEN_HEIGHT * 0.03,
    borderRadius: SCREEN_WIDTH,
  },
  vehicleTxt: {
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
  searchBtn: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.06,
    marginTop: SCREEN_HEIGHT * 0.04
  },
  searchButton: {
    height: SCREEN_HEIGHT * 0.064,
    backgroundColor: COLORS.blackTxt,
    borderWidth: 0,
    borderColor: COLORS.borderColor,
    borderRadius: SCREEN_WIDTH * 0.06,
    width: SCREEN_WIDTH * 0.8,
    alignSelf: "center"
  },
  searchIcon: {
    width: SCREEN_WIDTH * 0.08,
    height: SCREEN_HEIGHT * 0.06
  },
  searchVehicle: {
    color: COLORS.whiteTxt,
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginLeft: SCREEN_WIDTH * 0.1,
    marginTop: SCREEN_HEIGHT * 0.0125
  },
  searchIconRow: {
    height: SCREEN_HEIGHT * 0.5,
    flexDirection: "row",
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.01,
    marginLeft: SCREEN_WIDTH * 0.08,
    marginTop: SCREEN_HEIGHT * 0.002
  },
  listItem: {
    width: SCREEN_WIDTH * 0.95, 
  },
  itemBody: {
    height: SCREEN_HEIGHT * 0.125,
  },    
  thumbnailFlat: {
    fontWeight:'bold',
  },    
  vehicleName: {
    fontWeight:'bold',
    fontSize: SCREEN_WIDTH * 0.035,
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  vehicleType: {
    fontWeight:'bold',
    fontSize: SCREEN_WIDTH * 0.035,
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  vehicleNo: {
    fontWeight:'bold',
    fontSize: SCREEN_WIDTH * 0.035,
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  callBtn: {
    width: SCREEN_WIDTH * 0.125, 
    height: SCREEN_HEIGHT * 0.055,
  },
  callIcon:{
    marginLeft: SCREEN_WIDTH * 0.03,
  },
});

export default Vehicles;
