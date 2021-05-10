import React from "react";
import { Dimensions } from 'react-native';
import Vehicles from "./Vehicles";
import Members from "./Members";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {COLORS} from './Colors';

const SCREEN_WIDTH = Dimensions.get("window").width;

const Tab = createMaterialTopTabNavigator();

export default function SkyFamily() {
    return (
        <Tab.Navigator 
            tabBarOptions={{
            labelStyle: { fontSize: SCREEN_WIDTH * 0.035, fontWeight: 'bold', color: 'white' },
            tabStyle: { width: SCREEN_WIDTH * 0.5 },
            style: { backgroundColor: COLORS.tabBar},
            indicatorStyle: {backgroundColor: COLORS.blackTxt}
            }}
        >
        <Tab.Screen name="Vehicles" component={Vehicles} />
        <Tab.Screen name="Members" component={Members} />
        </Tab.Navigator>
    );
}