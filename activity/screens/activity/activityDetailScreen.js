import React, { useState, useCallback } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Button, 
  StyleSheet,
  Alert
} from 'react-native';
import Colors from '../../constants/Colors'
import { useSelector, useDispatch } from 'react-redux';

import * as activityActions from '../../store/actions/activity';

const ActivityDetailScreen = props => {

  const [error, setError] = useState();
  const dispatch = useDispatch();
  
  const activityId = props.navigation.getParam('aid');
  const selectedActivity = useSelector(state => 
    state.activities.availableActivities.find(activity => activity.aid === activityId)
    );
  return (
    <ScrollView>
      <Text style={styles.title}>Title: {selectedActivity.title}</Text>
      <Text style={styles.time}>Time: {selectedActivity.time}</Text>
      <Text style={styles.location}>Location: {selectedActivity.location}</Text>
      <Text style={styles.organizer}>Organizer: {selectedActivity.organizer}</Text>
      <Text style={styles.participants}>Participants: {selectedActivity.participants.join()}</Text>
      <Text style={styles.description}>Description: {selectedActivity.description}</Text>
      <View style={styles.action}>
        <Button color={Colors.primary} title="Jion!" onPress={() => {
          dispatch(
            activityActions.joinActivity(
              selectedActivity.aid
            )
          );
          Alert.alert('Joined!');
          }
        }/>
      </View>
    </ScrollView>
  );
};

ActivityDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('ActivityTitle')
  };
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  time: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  location: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  organizer:{
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  participants:{
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  action: {
    marginVertical: 10,
    alignItems: 'center'
  }
});

export default ActivityDetailScreen;