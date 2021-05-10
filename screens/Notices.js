import React, { Component, useState, useEffect, useCallback } from "react";
import { 
    Dimensions,
    StyleSheet, 
    View, 
    ScrollView,
    Text,
    Image,
    TouchableOpacity
} from "react-native";
import Timeline from 'react-native-timeline-flatlist';
import firestore from '@react-native-firebase/firestore';
import ProgressBar from 'react-native-progress/Bar';
import MonthPicker from 'react-native-month-year-picker';
import {COLORS} from './Colors';

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

function Notices(props) {
  var [notices, setNotices] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [date, setDate] = useState(firestore.Timestamp.now().toDate().getMonth()+1 + "-" + firestore.Timestamp.now().toDate().getFullYear());
  const [show, setShow] = useState(false);
  const currentMonth = firestore.Timestamp.now().toDate().getMonth()+1 + "-" + firestore.Timestamp.now().toDate().getFullYear();

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

    async function fetchNotices(){
      await firestore().collection('notices').orderBy('timeStamp','desc').get().then((docSnap)=>{
        var noticeData = [];
        var redFlag = false;
        var greenFlag = false;
        var blueFlag = false;
        docSnap.forEach((doc)=>{
          var data = doc.data();
          var noticeMonth = data.timeStamp.toDate().getMonth()+1 + "-" + data.timeStamp.toDate().getFullYear();
          if(currentMonth==noticeMonth){
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
            if(redFlag==false){
              var singleNotice = {
                time: data.timeStamp.toDate().getDate() + "/"+ parseInt(data.timeStamp.toDate().getMonth()+1),
                title: data.title,
                description: data.notice + "\n\n\nPublished on: " + timeStamp + " "+time,
                lineColor: 'red', 
              };
              redFlag=true;
              greenFlag=false;
              noticeData.push(singleNotice);
            }else if(greenFlag==false){
              var singleNotice = {
                time: data.timeStamp.toDate().getDate() + "/"+ parseInt(data.timeStamp.toDate().getMonth()+1),
                title: data.title,
                description: data.notice + "\n\n\nPublished on: " + timeStamp + " "+time,
                lineColor: 'green', 
              };
              greenFlag=true;
              blueFlag=false;
              noticeData.push(singleNotice);
            }else if(blueFlag==false){
              var singleNotice = {
                time: data.timeStamp.toDate().getDate() + "/"+ parseInt(data.timeStamp.toDate().getMonth()+1),
                title: data.title,
                description: data.notice + "\n\n\nPublished on: " + timeStamp + " "+time,
                lineColor: '#0652DD', 
              };
              blueFlag=true;
              redFlag=false;
              noticeData.push(singleNotice);
            }
          }
        })
        return noticeData;
      }).then((noticeData)=>{
        if(noticeData.length!=0){
          setNotices(noticeData);
        }
        setLoader(true);
      })
    }
    fetchNotices();
  }, []);

  async function fetchCustomNotices(selectedDate){
    var month = selectedDate.split('-')[0];
    var customMonth = "";
    var index = month.charAt(0);
    if (index == "0") {
      customMonth = month.charAt(1) + "-" + selectedDate.split('-')[1];
    }
    await firestore().collection('notices').orderBy('timeStamp','desc').get().then((docSnap)=>{
      var noticeData = [];
      var redFlag = false;
      var greenFlag = false;
      var blueFlag = false;
      docSnap.forEach((doc)=>{
        var data = doc.data();
        var noticeMonth = data.timeStamp.toDate().getMonth()+1 + "-" + data.timeStamp.toDate().getFullYear();
        if(customMonth==noticeMonth){
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
          if(redFlag==false){
            var singleNotice = {
              time: data.timeStamp.toDate().getDate() + "/"+ parseInt(data.timeStamp.toDate().getMonth()+1),
              title: data.title,
              description: data.notice + "\n\n\nPublished on: " + timeStamp + " "+time,
              lineColor: 'red', 
            };
            redFlag=true;
            greenFlag=false;
            noticeData.push(singleNotice);
          }else if(greenFlag==false){
            var singleNotice = {
              time: data.timeStamp.toDate().getDate() + "/"+ parseInt(data.timeStamp.toDate().getMonth()+1),
              title: data.title,
              description: data.notice + "\n\n\nPublished on: " + timeStamp + " "+time,
              lineColor: 'green', 
            };
            greenFlag=true;
            blueFlag=false;
            noticeData.push(singleNotice);
          }else if(blueFlag==false){
            var singleNotice = {
              time: data.timeStamp.toDate().getDate() + "/"+ parseInt(data.timeStamp.toDate().getMonth()+1),
              title: data.title,
              description: data.notice + "\n\n\nPublished on: " + timeStamp + " "+time,
              lineColor: '#0652DD', 
            };
            blueFlag=true;
            redFlag=false;
            noticeData.push(singleNotice);
          }
        }
      })
      return noticeData;
    }).then((noticeData)=>{
      if(noticeData.length!=0){
        setNotices(noticeData);
      }
      setLoader(true);
    })
  }

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      setShow(false);
      setDate(selectedDate);
      if(selectedDate!=currentMonth){
        fetchCustomNotices(selectedDate);
      }
    },
    [date, setShow],
  );

  return (
    <View style={styles.container}>
      <View style={styles.scrollArea1}>
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollArea1_contentContainerStyle}
        >
        <Text style={styles.notices}>Month: {date}</Text>
        { loader ? 
          notices.length==0 ? 
            <Text 
              style={{fontWeight:'bold',
              alignSelf:'center', 
              fontSize: SCREEN_WIDTH * 0.05, 
              marginTop: SCREEN_HEIGHT * 0.35,
              textDecorationLine: 'underline',
            }}>
              No notices found!
            </Text>
          :
            <Timeline
                data={notices}
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
                position: 'relative',
                width: SCREEN_WIDTH,
                textAlign: 'center',
              }}
            >Getting notices...</Text>
          </View>
        }
        </ScrollView>
      </View>
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
    flex: 1,
    justifyContent: "center",
  },
  scrollArea1: {
    backgroundColor: COLORS.bgColor,
    alignSelf: "center",
  },
  scrollArea1_contentContainerStyle: {
    width: SCREEN_WIDTH
  },
  notices: {
    color: COLORS.blackTxt,
    fontSize: SCREEN_WIDTH * 0.055,
    textAlign: "center",
    fontWeight: 'bold',
    textDecorationLine: "underline",
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  timeline: {
    width: SCREEN_WIDTH * 0.95,
    alignSelf:'center',
  },  
  timelineOptions: {
    width: SCREEN_WIDTH * 0.95,
    marginTop: SCREEN_HEIGHT * 0.02,
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
    color: COLORS.whiteTxt, 
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

export default Notices;
