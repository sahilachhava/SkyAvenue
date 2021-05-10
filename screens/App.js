import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {COLORS} from './screens/Colors';
import Splash from './screens/Splash';
import Login from './screens/Login';
import OTPScreen from './screens/OtpScreen';
import SelectFlat from './screens/SelectFlat';
import MemberDetails from './screens/MemberDetails';
import VehicleDetails from './screens/VehicleDetails';
import Dashboard from './screens/Dashboard';
import Maintenance from './screens/Maintenance';
import Notices from './screens/Notices';
import Incomes from './screens/Incomes';
import Expenses from './screens/Expenses';
import SkyFamily from './screens/SkyFamily';
import Vehicles from './screens/Vehicles';
import Members from './screens/Members';
import MyProfile from './screens/MyProfile';
import MyDetails from './screens/MyDetails';
import MyVehicles from './screens/MyVehicles';
import AboutSky from './screens/AboutSky';
import Accounts from './screens/Accounts';
import Feedback from './screens/Feedback';
console.disableYellowBox=true;

const Stack = createStackNavigator();

class App extends Component{
  static navigationOptions = {
      header: null,
  }
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen 
              name="Splash" 
              component={Splash} 
              options={{ 
                gestureEnabled: false,
                headerShown: false,
              }} 
          />
          <Stack.Screen 
              name="Login" 
              component={Login} 
              options={{ 
                gestureEnabled: false,
                headerShown: false,
              }} 
          />
          <Stack.Screen 
              name="OTPScreen" 
              component={OTPScreen} 
              options={{ 
                gestureEnabled: false,
                headerShown: false,
              }} 
          />
          <Stack.Screen 
              name="SelectFlat" 
              component={SelectFlat} 
              options={{ 
                gestureEnabled: false,
                headerShown: false,
              }} 
          />
          <Stack.Screen 
              name="MemberDetails" 
              component={MemberDetails} 
              options={{ 
                gestureEnabled: false,
                headerShown: false,
              }} 
          />
          <Stack.Screen 
              name="VehicleDetails" 
              component={VehicleDetails} 
              options={{ 
                gestureEnabled: false,
                headerShown: false,
              }} 
          />
          <Stack.Screen 
              name="Dashboard" 
              component={Dashboard} 
              options={{ 
                gestureEnabled: false,
                headerShown: false,
              }} 
          />
          <Stack.Screen 
              name="Maintenance" 
              component={Maintenance} 
              options={{ 
                gestureEnabled: false,
                title: 'Maintenanace',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="Notices" 
              component={Notices} 
              options={{ 
                gestureEnabled: false,
                title: 'Notices',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="Incomes" 
              component={Incomes} 
              options={{ 
                gestureEnabled: false,
                title: 'Incomes',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="Expenses" 
              component={Expenses} 
              options={{ 
                gestureEnabled: false,
                title: 'Expenses',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="SkyFamily" 
              component={SkyFamily} 
              options={{ 
                gestureEnabled: false,
                title: 'Sky Family',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="Vehicles" 
              component={Vehicles} 
              options={{ 
                gestureEnabled: false,
                title: 'Vehicles',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="Members" 
              component={Members} 
              options={{ 
                gestureEnabled: false,
                title: 'Members',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="MyProfile" 
              component={MyProfile} 
              options={{ 
                gestureEnabled: false,
                title: 'My Profile',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="MyDetails" 
              component={MyDetails} 
              options={{ 
                gestureEnabled: false,
                title: 'My Details',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="MyVehicles" 
              component={MyVehicles} 
              options={{ 
                gestureEnabled: false,
                title: 'My Vehicles',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="AboutSky" 
              component={AboutSky} 
              options={{ 
                gestureEnabled: false,
                title: 'About Sky',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="Accounts" 
              component={Accounts} 
              options={{ 
                gestureEnabled: false,
                title: 'Accounts',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
          <Stack.Screen 
              name="Feedback" 
              component={Feedback} 
              options={{ 
                gestureEnabled: false,
                title: 'Feedback',
                headerStyle: {
                    backgroundColor: COLORS.navBar,
                },
                headerTintColor: '#ecf0f1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
              }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
      )
  }
}

export default App;

/*
rm -rf node_modules (if any error occur while building the app)

Emulators:
react-native run-ios --simulator="iPhone 11 Pro"
react-native run-ios --simulator="iPhone SE"
react-native run-ios --simulator="iPad Pro"

Functional Features:
Razorpay Live API 

Non-Functional Features:
Notifications
BG Color

App Build for Android Commands:

sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
cd android 
./gradlew clean
./gradlew assembleRelease
*/