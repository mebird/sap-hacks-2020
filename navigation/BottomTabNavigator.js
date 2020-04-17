import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Login from '../screens/Login';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import AddItemScreen from '../screens/AddItemScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={{ showLabel: false }}>
      <BottomTab.Screen
        name="Place Order"
        component={AddItemScreen}
        options={{
          title: 'Place Order',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="user" />,
        }}
      />
      <BottomTab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="appstore-o" />,
        }}
      />
      <BottomTab.Screen
        name="Leaderboard"
        component={LinksScreen}
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="profile" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  return route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
}
