import React from 'react';
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const ActivityOverview = props => {
  return (
    <View style={sytles.activity}>
      <TouchableOpacity onPress={props.onViewDetail}>
        <View style={sytles.details}>
          <Text style={sytles.title}>Title: {props.title}</Text>
          <Text style={sytles.time}>Time: {props.time}</Text>
          <Text style={sytles.location}>Location: {props.location}</Text>
        </View>
        <View style={sytles.action}>
          <Button 
            color={Colors.primary} 
            title="Activity Detail" 
            onPress={props.onViewDetail}
          />
          <Button 
            color={Colors.primary} 
            title="Participate" 
            onPress={props.onParticipateActivty}
          />
        </View>
     </TouchableOpacity>
    </View>
  );
};

const sytles = StyleSheet.create({
  activity: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height:2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    height: 200,
    margin: 20,
    overflow: 'hidden',
  },
  details:{
    alignItems: 'flex-start',
    height: '70%',
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
  organizer: {
    fontSize: 14,
    color: '#888',
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '25%',
    paddingHorizontal: 20,
  },
});

export default ActivityOverview;
