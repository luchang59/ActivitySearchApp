import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, ActivityIndicator, StyleSheet, Text, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ActivityOverview from '../../components/overView/ActivityOverview';
import HeaderButton from '../../components/UI/HeaderButton';
import Color from '../../constants/Colors';
import * as activityActions from '../../store/actions/activity';

const ActivityOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const activities = useSelector(state => state.activities.availableActivities);
  const dispatch = useDispatch();

  const loadActivities = useCallback(async() => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(activityActions.fetchActivities());
    } catch(err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadActivities
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadActivities]);

  useEffect(() => {
    setIsLoading(true);
    loadActivities().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadActivities]);

  if (isLoading) {
    return <View style={styles.centered}>
      <ActivityIndicator size='large' color={Color.primary} />
    </View>
  }

  if (error) {
    return (
    <View style={styles.centered}>
      <Text>An error occurred!</Text>
      <Button 
        title="Try again" 
        onPress={loadActivities}
      color={Color.primary} 
      />
    </View>
    );
  }

  if (!isLoading && activities.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No activities found. Maybe start adding some.</Text>
      </View>
      );
  }

  // const participateHandler = useCallback(async () => {


  // });

  return (
    <FlatList 
      onRefresh={loadActivities}
      refreshing={isRefreshing}
      data={activities} 
      keyExtractor={item => item.aid} 
      renderItem={itemData => (
        <ActivityOverview 
          title={itemData.item.title}
          time={itemData.item.time}
          location={itemData.item.location}
          organizer={itemData.item.ownerId}
          onViewDetail={() => {
            props.navigation.navigate('ActivityDetail', { 
              aid: itemData.item.aid,
              ActivityTitle: itemData.item.title,
            })
          }}
          onParticipateActivty={async () => {
            try {
              await dispatch(
                activityActions.joinActivity(
                  itemData.item.aid
                )
              );
              Alert.alert('Joined!');
            } catch(err) {
              setError(err.message);
            }
          }}
        />
      )}
    />
  );
};

ActivityOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Activities',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title='Memu'
          iconName='ios-menu'
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ActivityOverviewScreen;