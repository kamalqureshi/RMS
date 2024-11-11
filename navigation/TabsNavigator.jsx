import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RentalView from "../screens/Rental";
import { TabBarIcon } from "../components/TabBarIcon";
import AssetView from "../screens/Assets";
import TenantView from "../screens/Tenants";
import TenantForm from "../components/TenantForm";
import AssetForm from "../components/AssetForm";
import ProfileView from "../screens/Profile";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Rentals"
        component={RentalView}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cash" : "cash-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetView}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "business" : "business-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tenants"
        component={TenantView}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "people" : "people-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AssetForm"
        component={AssetForm}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "document-text" : "document-text-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="TenantForm"
        component={TenantForm}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "document-text" : "document-text-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileView}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
