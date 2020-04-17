import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { decode, encode } from 'base-64';

import useLinking from './navigation/useLinking';
import { StoreProvider, createStore, action } from 'easy-peasy';

import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Loading from './screens/Loading';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import ViewOrderScreen from './screens/ViewOrderScreen';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import ViewHistoryScreen from './screens/ViewHistoryScreen';
import PickupOrder from './screens/PickupOrder';
import YourJobs from './screens/YourJobs';
import PlaceOrder from './screens/PlaceOrder';

console.disableYellowBox = true;
const Stack = createStackNavigator();

function App(props) {
  // DO NOT REMOVE
  if (!global.btoa) { global.btoa = encode }
  if (!global.atob) { global.atob = decode }
  // OR ELSE LOGIN BREAKS

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  const dummyDiv = () => {
    return (
      <Text>TODO</Text>
    )
  }
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="User Profile" component={ProfileScreen} />
            <Stack.Screen name="Leaderboard" component={dummyDiv} />
            <Stack.Screen name="View History" component={ViewHistoryScreen} />
            <Stack.Screen name="View Current Orders" component={ViewOrderScreen} />
            <Stack.Screen name="Place Order" component={PlaceOrder} />
            <Stack.Screen name="Pickup an Order" component={PickupOrder} />
            <Stack.Screen name="Your Jobs" component={YourJobs} />
            <Stack.Screen name="Loading" component={Loading} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const staticUser = {
  auth_image: "https://randomuser.me/api/portraits/thumb/men/24.jpg",
  email: "andrew.hanson@example.com",
  name: "Andrew Hanson",
  karma: 100
}

const store = createStore({
  user: staticUser,
  uri: '',
  karma: 0,
  myOrder: {
    items: [],
    addItem: action((s, p) => { s.items.push(p) }),
    clearItem: action((s, p) => { s.items = s.items.filter(i => i.uuid != p.uuid) }),
  },
  changeUser: action((s, p) => { s.user = p }),
  setImageUri: action((s, p) => { s.uri = p }),
  changeKarma: action((s, p) => { s.karma = p })
});

export default function AppWrapper(props) {
  return (
    <StoreProvider store={store}>
      {App(props)}
    </StoreProvider>
  );
}
