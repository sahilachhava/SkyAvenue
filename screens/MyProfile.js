import React from "react";
import { Dimensions } from 'react-native';
import MyDetails from "./MyDetails";
import MyVehicles from "./MyVehicles";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {COLORS} from './Colors';

const SCREEN_WIDTH = Dimensions.get("window").width;

const Tab = createMaterialTopTabNavigator();

export default function MyProfile() {
    return (
        <Tab.Navigator 
            tabBarOptions={{
            labelStyle: { fontSize: SCREEN_WIDTH * 0.035, fontWeight: 'bold', color: 'white' },
            tabStyle: { width: SCREEN_WIDTH * 0.5 },
            style: { backgroundColor: COLORS.tabBar },
            indicatorStyle: {backgroundColor: COLORS.blackTxt}
            }}
        >
        <Tab.Screen name="My Details" component={MyDetails} />
        <Tab.Screen name="Vehicle Details" component={MyVehicles} />
        </Tab.Navigator>
    );
}