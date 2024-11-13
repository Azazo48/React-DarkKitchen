import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

//screens
import MenuScreen from "./Paginas/MenuScreen";
import Cocina from "./Paginas/Cocina";
import Pago from "./Paginas/Pago"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
            tabBarActiveTintColor : 'blue',
        }}
        >
            <Tab.Screen 
                name="Menu" 
                component={MenuScreen}
                options={{
                    tabBarLabel: 'Pedidos',
                    tabBarIcon: ({ color, size}) => (
                        <MaterialCommunityIcons name="food-steak" size={24} color="black" />
                    ),
                    headerShown: false
                }}
                />
                <Tab.Screen 
                name="Pago" 
                component={Pago}
                options={{
                    tabBarLabel: 'Pago',
                    tabBarIcon: ({ color, size}) => (
                        <MaterialIcons name="payment" size={24} color="black" />
                    ),
                    headerShown: false
                }}
                />
                <Tab.Screen 
                name="Cocina" 
                component={Cocina}
                options={{
                    tabBarLabel: 'Cocina',
                    tabBarIcon: ({ color, size}) => (
                        <FontAwesome6 name="kitchen-set" size={24} color="black" />
                    ),
                    headerShown: false
                }}
                />

        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs/>
        </NavigationContainer>
    )
}

