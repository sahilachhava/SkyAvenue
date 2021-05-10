import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  TextInput
} from "react-native";
import firestore from '@react-native-firebase/firestore';
import ProgressBar from 'react-native-progress/Bar';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import DropDownPicker from 'react-native-dropdown-picker';
import { List, ListItem, Text, Left, Body, Right, Button } from 'native-base';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;
global.vehicleList = [
    {label: 'Four-Wheeler', value: 'Four Wheeler'},
    {label: 'Three Wheeler', value: 'Three Wheeler'},
    {label: 'Two Wheeler', value: 'Two Wheeler'},
    {label: 'Other', value: 'Other'}
];

function MyVehicles(props) {
    var [vehicleDesign, setVehicleDesign] = React.useState([]);
    const [loader, setLoader] = React.useState(false);
    const [vehicleForm, setVehicleForm] = React.useState([]);

    useEffect(() => {
        async function fetchUserVehicles(){
            var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
            await firestore().collection('members').doc(userInfo.flatNo).get().then(async (memberDoc)=>{
                var listDesign = [];
                var memData = memberDoc.data();
                var userName = memData.fName + " " + memData.lName;
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
                                <Button rounded style={styles.callBtn}  onPress={() =>  confirm(flatNo,doc.id,props)}>
                                    <Icon iconStyle={styles.callIcon} name='delete' color='#fff' />
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

    async function saveVehicle(vehType, vehName, vehNo, props){
        if(vehType==null || vehType==""){
            alert("Please select type of vehicle");
        }else if(vehName=="" || vehName==null){
            alert("Please enter vehicle name");
        }else if(vehNo=="" || vehNo==null){
            alert("Please enter valid vehicle number");
        }else{
            var userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
            await firestore().collection('members').doc(userInfo.flatNo)
            .collection('vehicles').doc(vehNo).set({
                'vehicleName': vehName,
                'vehicleType': vehType,
                'vehicleNo': vehNo
            }).then(()=>{
                alert("New vehicle added");
                setVehicleForm([]);
                props.navigation.navigate("Vehicles");
            })
        }
    }

    function addNewVehicle(){
        var vehType = null;
        var vehName = null;
        var vehNo= null;
        if(vehicleForm.length>0){
            alert("Add new vehicle, The form is already initiated");
        }else{
            setVehicleForm([
                <View style={styles.topSection}>
                <Text style={styles.subTitle}>Add New Vehicle</Text>
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
                            vehType = item.value;
                        }
                    }}
                />
                <TextInput
                    placeholder="Vehicle Name & Model"
                    textBreakStrategy="highQuality"
                    placeholderTextColor="rgba(230, 230, 230,1)"
                    returnKeyType="next"
                    maxLength={50}
                    returnKeyLabel="Next"
                    clearTextOnFocus={true}
                    enablesReturnKeyAutomatically={false}
                    style={styles.firstName}
                    onChangeText={text => vehName = text}
                    value={vehName}
                />
                <TextInput
                    placeholder="Vehicle No (Ex. GJ01XX0000)"
                    textBreakStrategy="highQuality"
                    placeholderTextColor="rgba(230, 230, 230,1)"
                    returnKeyType="next"
                    maxLength={50}
                    returnKeyLabel="Next"
                    clearTextOnFocus={true}
                    enablesReturnKeyAutomatically={false}
                    style={styles.firstName1}
                    onChangeText={text => vehNo =  text}
                    value={vehNo}
                />
                <TouchableOpacity
                    onPress={() => saveVehicle(vehType, vehName, vehNo, props)}
                    style={styles.button1}
                    >
                    <View style={styles.image2Row}>
                        <Image
                        source={require("../assets/images/save.png")}
                        resizeMode="contain"
                        style={styles.image2}
                        ></Image>
                        <Text style={styles.saveNext}>Save New Vehicle</Text>
                    </View>
                </TouchableOpacity>
            </View>
            ]);
        }
    }

    async function deleteVehicle(flatNo,vDocID,props){
        await firestore().collection("members").doc(flatNo).collection("vehicles").doc(vDocID).delete().then(()=>{
            alert("Vehicle Deleted Successfully");
            props.navigation.navigate("Vehicles");
        });
    }

    function confirm(flatNo,vDocID,props){
        Alert.alert("Confirm?", "Are you sure you want to delete?", [
            {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
            },
            { text: "YES", onPress: () => deleteVehicle(flatNo,vDocID,props) }
        ]);
    }

  return (
    <View style={styles.container}>
      <View style={styles.scrollArea1}>
        <ScrollView
          horizontal={false}
          contentContainerStyle={styles.scrollArea1_contentContainerStyle}
        >
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
          {vehicleForm}
        </ScrollView>
      </View>
        <ActionButton buttonColor="rgba(231,76,60,1)">
            <ActionButton.Item buttonColor='#f1c40f' title="Add New Vehicle" onPress={() => addNewVehicle()}>
                <Icon name="plus-circle" type='feather'/>
            </ActionButton.Item>
        </ActionButton>
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
    backgroundColor: COLORS.redColor,
  },
  callIcon:{
    marginLeft: SCREEN_WIDTH * 0.03,
  },
  topSection: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.50,
    marginTop: SCREEN_HEIGHT * 0.02
  },
  subTitle: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.035,
    width: SCREEN_WIDTH,
    fontWeight: 'bold',
    textAlign: "center",
    textDecorationLine: "underline",
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
    marginTop: SCREEN_HEIGHT * 0.035,
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
    marginTop: SCREEN_HEIGHT * 0.001
  }
});

export default MyVehicles;
