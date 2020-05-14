import React, { useState, useEffect,useCallback } from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch } from 'react-redux';

import Color from '../../constants/Colors';
import * as activityAction from '../../store/actions/activity';

const Actions = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userId = props.userId;
  const ownerId = props.ownerId;
  const activityId = props.aid;

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay!' }])
    }
  }, [error]);

  const deleteHandler = useCallback(async (aid) => {
    setError(null);
    setIsLoading(true);
    
    try {
      Alert.alert('Are you sure?', 'Do you really want to delete this activity?', [
        {text: 'No', style: 'default'},
        {
          text: 'Yes', 
          style: 'destructive', 
          onPress: () => {
            dispatch(activityAction.deleteActivity(aid));
          }
        },
      ]);
    } catch(err) {
        setError(err.message);
    }
    
    setIsLoading(false);
  }, [dispatch]);

  if (isLoading) {
    return <View style={styles.centered}>
      <ActivityIndicator size='large' color={Color.primary} />
      </View>
  }
  
  const EditActityHandler = (aid) => {
    props.navigation.navigate('EditActity', {aid: aid});
  };

  if (userId === ownerId) {
    return (
      <View>
        <Button 
          color={Colors.primary}
          title="Edit Activity"
          onPress={() => {
            EditActityHandler(activityId)
          }}
        />
        
        <Button 
          color={Colors.primary}
          title="Cancel Activity"
          onPress={() => {
            deleteHandler(activityId);
          }}
        />
        
      </View> 
    );
  }
    return <Button 
    color={Colors.primary}
    title="Quit Activity"
    onPress={() => {
      dispatch(activityAction.quitActivity(activityId));
    }}
  />;
}

const UserActivitiesOverview = props => {
  
  return (
    <View style={styles.activity}>
      <View style={styles.details}>
        <Text style={styles.title}>Title: {props.title}</Text>
        <Text style={styles.time}>Time: {props.time}</Text>
        <Text style={styles.location}>location: {props.location}</Text>
        <Text style={styles.organizer}>Organizer: {props.organizer}</Text>
        <Text style={styles.participants}>Participants: {props.participants}</Text>
        <Text style={styles.description}>Description: {props.description}</Text>
      </View>
        <Actions 
          aid={props.aid}
          userId={props.userId}
          ownerId={props.ownerId}
          navigation={props.navigation}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  activity: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    // height: 150,
    flex: 1,
    margin: 20,
    overflow: 'hidden',
  },
  details:{
    alignItems: 'center',
    // height: '70%',
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginVertical: 4
  },
  time: {
    fontSize: 14,
    color: '#888',
  },
  location: {
    fontSize: 14,
    color: '#888',
  },
  organizer:{
    fontSize: 14,
    color: '#888',
  },
  participants:{
    fontSize: 14,
    color: '#888',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default UserActivitiesOverview;
