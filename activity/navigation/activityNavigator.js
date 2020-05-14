import React from "react";

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';

import { SafeAreaView, Button, View } from 'react-native'; 
import { useDispatch } from 'react-redux';

import ActivityOverviewScreen from '../screens/activity/activityOverviewScreen';
import ActivityDetailScreen from '../screens/activity/activityDetailScreen';
import AuthScreen from '../screens/user/AuthScreen';
import participatedActivityScreen from '../screens/user/participatedActivityScreen';
import EditActivityScreen from '../screens/user/editUserActivityScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/user';

const defaultNavOption = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTintColor: 'white',
};

const AllActivityNavigator = createStackNavigator(
  {
    ActivityOverview: ActivityOverviewScreen,
    ActivityDetail: ActivityDetailScreen
  },
  {
    navigationOptions: {
      title: 'All Activities'
    },
    defaultNavigationOptions: defaultNavOption
  }
);
 
const AdminyNavigator = createStackNavigator(
  {
    Activities: participatedActivityScreen,
    EditActity: EditActivityScreen
  },
  { 
    navigationOptions: {
      title: 'Your Activities'
    },
    defaultNavigationOptions: defaultNavOption
  }
)

const ActivityNavigator = createDrawerNavigator(
  {
    AllActivities: AllActivityNavigator,
    ParticipatedActivities: AdminyNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch()
      return (
        <View style={{flex:1, paddingTop: 20}}>
          <SafeAreaView forceInset={{top: "always", horizontal: "never"}}>
            <DrawerNavigatorItems {...props} />
            <Button 
              title="Logout" 
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logOut());
                props.navigation.navigate('Auth');
              }}
            />
          </SafeAreaView>
        </View>
      )
    }
  }
);

const AuthNavigator = createStackNavigator({
  Auth: AuthScreen
});

const MainNavigator = createSwitchNavigator({
  Auth: AuthNavigator,
  Activity: ActivityNavigator
});

export default createAppContainer(MainNavigator);