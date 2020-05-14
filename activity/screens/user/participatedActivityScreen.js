import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import UserActivitiesOverview from '../../components/UI/UserActivitiesOverview';

const participatedActivityScreen = props => {
  // const activities = useSelector(state => state.)
  // return (
  //   <Text>participated</Text>
  // );
  const activities = useSelector(state => state.activities.userActivities);
  const userId = useSelector(state => state.user.userId);

  if (activities.length === 0) {
    return  (
      <View style={styles.centered}>
        <Text>No activities found. Maybe start adding some.</Text>
      </View>
      );
  }

  return (
    <FlatList 
      data={activities} 
      keyExtractor={item => item.aid} 
      renderItem={itemData => (
        <UserActivitiesOverview 
          aid={itemData.item.aid}
          title={itemData.item.title}
          time={itemData.item.time}
          location={itemData.item.location}
          userId={userId}
          ownerId={itemData.item.ownerId}
          organizer={itemData.item.organizer}
          participants={itemData.item.participants}
          description={itemData.item.description}
          navigation={props.navigation}
          // onViewDetail={() => {
          //   props.navigation.navigate('ActivityDetail', { 
          //     ActivityId: itemData.item.id,
          //     ActivityTitle: itemData.item.title,
          //   })
          // }}
          // onParticipateActivty={() => {}}
        />
      )}
    />
  );
};

participatedActivityScreen.navigationOptions = navData =>{
  return {
    headerTitle: 'Your Activities',
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
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title='Add'
          iconName='ios-create'
          onPress={() => {
            navData.navigation.navigate('EditActity');
          }}
        />
      </HeaderButtons>
    ),
  }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default participatedActivityScreen;

// headerLeft: (
//   <HeaderButtons HeaderButtonComponent={HeaderButton}>
//     <Item 
//       title='Memu'
//       iconName='ios-menu'
//       onPress={() => {
//         navData.navigation.toggleDrawer();
//       }}
//     />
//   </HeaderButtons>