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

function Members(props) {
    var [memberDesign, setMemberDesign] = React.useState([]);
    const [loader, setLoader] = React.useState(true);
    const [flatNo, setFlatNo] = React.useState('');

    useEffect(() => {
        setMemberDesign([
            <ListItem style={{marginTop: SCREEN_HEIGHT * 0.03}}>
            <Body>
                <Text  style={{fontWeight:'bold',alignSelf:'center'}}>Search members by flat no!</Text>
            </Body>
            </ListItem>
        ]);
    }, []);

    async function getMemberDetails(searchNo){
        if(searchNo==""){
            alert("Please enter valid flat number");
        }else{
            setLoader(false);
            await firestore().collection('members').get().then(async (docSnap)=>{
                setMemberDesign([]);
                var flag = false;
                docSnap.forEach(async (memberDoc)=>{
                    var memData = memberDoc.data();
                    var userName = memData.fName + " " + memData.lName;
                    var mobileNo = memData.mobileNo;
                    var flatNo = memData.flatNo;
                    var type = memData.memberType;
                    var vNo = memData.vehicleTotal;
                    if(flatNo.includes(searchNo)){
                        if(flag==false){
                            setMemberDesign([]);
                        }
                        flag = true;
                        setMemberDesign(listDesign => [...listDesign,
                            <ListItem thumbnail>
                            <Left>
                                <Text style={styles.thumbnailFlat}>{flatNo}</Text>
                            </Left>
                            <Body style={styles.itemBody}>
                                <Text  style={styles.vehicleName}>Owner Name:       {userName}</Text>
                                <Text style={styles.vehicleType}>Member Type:     {type}</Text>
                                <Text style={styles.vehicleNo}>Total Vehicles:     {vNo}</Text>
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
                          setMemberDesign([
                            <ListItem style={{marginTop: SCREEN_HEIGHT * 0.03}}>
                            <Body>
                                <Text  style={{fontWeight:'bold',alignSelf:'center'}}>No flat found!</Text>
                            </Body>
                            </ListItem>
                          ]);
                        }
                    }  
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
            placeholder="Flat No (Ex. 101)"
            textBreakStrategy="highQuality"
            placeholderTextColor="rgba(230, 230, 230,1)"
            returnKeyType="next"
            maxLength={3}
            returnKeyLabel="Next"
            clearTextOnFocus={true}
            enablesReturnKeyAutomatically={false}
            keyboardType="numeric"
            style={styles.vehicleTxt}
            onChangeText={text => setFlatNo(text)}
            value={flatNo}
          ></TextInput>
          <View style={styles.searchBtn}>
            <TouchableOpacity
              onPress={() => getMemberDetails(flatNo)}
              style={styles.searchButton}
            >
              <View style={styles.searchIconRow}>
                <Image
                  source={require("../assets/images/search.png")}
                  resizeMode="contain"
                  style={styles.searchIcon}
                ></Image>
                <Text style={styles.searchVehicle}>Search Details</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.dividerStyle} />
          {/* Native Base List Started */}
          { loader ? 
            <List style={{marginTop: SCREEN_HEIGHT * 0.02, marginBottom: SCREEN_HEIGHT * 0.03}}>
              {memberDesign}
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
                >Getting member details...</Text>
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

export default Members;
