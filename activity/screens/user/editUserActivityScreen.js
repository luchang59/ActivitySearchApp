import React, { useState, useEffect, useCallback, useReducer }from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import Color from '../../constants/Colors';
import HeaderButton from '../../components/UI/HeaderButton';
import * as ActivityActions from '../../store/actions/activity';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    
    return {
      inputValidities: updatedValidities,
      inputValues: updatedValues,
      formIsValid: updatedFormIsValid
    };
  }
  return state;
};

const EditActivityScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activityId = props.navigation.getParam('aid');
  // window.alert(activityId)

  const editedActivity = useSelector(state => 
    state.activities.userActivities.find(activity => activity.aid === activityId)
  );



  // window.alert(editedActivity)



  const dispatch = useDispatch();
  
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedActivity ? editedActivity.title : '',
      time: editedActivity ? editedActivity.time : '',
      location: editedActivity ? editedActivity.location : '',
      description: editedActivity ? editedActivity.description : ''
    }, 
    inputValidities: {
      title: editedActivity ? true : false,
      time: editedActivity ? true : false,
      location: editedActivity ? true : false,
      description: editedActivity ? true : false,
    }, 
    formIsValid: editedActivity ? true : false, 
  });
  
  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay!' }])
    }
  }, [error]);


  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay'}
      ]);
      return ;
    }
    setError(null);
    setIsLoading(true);

    // console.log('submitting');
    // window.alert('sfsfa')
    try {
      if (editedActivity) {
        await dispatch(
          ActivityActions.updateActivity(
            activityId, 
            formState.inputValues.title, 
            formState.inputValues.time, 
            formState.inputValues.location, 
            formState.inputValues.description
          )
        );
      } else {
        await dispatch(
          ActivityActions.createActivity(
            formState.inputValues.title, 
            formState.inputValues.time, 
            formState.inputValues.location, 
            formState.inputValues.description
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    
    setIsLoading(false);
  }, [dispatch, activityId, formState]);

  useEffect(() => {
    props.navigation.setParams({ 'submit': submitHandler})
  }, [submitHandler]);

  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = true;
    if (text.trim().length > 0) {
      isValid = true;
    } 
    dispatchFormState({
      type: FORM_INPUT_UPDATE, 
      value: text,
      isValid: isValid,
      input: inputIdentifier
    });
  };

  if (isLoading) {
    return <View style={styles.centered}>
      <ActivityIndicator size='large' color={Color.primary} />
      </View>
  }

  return (
    <ScrollView>
      {/* <Text>{activityId}</Text> */}
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput 
            style={styles.input}
            value={formState.inputValues.title}
            onChangeText={textChangeHandler.bind(this, 'title')}
            autoCapitalize='sentences'
            returnKeyType='next'
          />
          {!formState.inputValidities.title && <Text>Please enter a valid title!</Text>}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Time</Text>
          <TextInput 
            style={styles.input} 
            value={formState.inputValues.time}
            onChangeText={textChangeHandler.bind(this, 'time')}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Location</Text>
          <TextInput 
            style={styles.input} 
            value={formState.inputValues.location}
            onChangeText={textChangeHandler.bind(this, 'location')}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={styles.input}
            value={formState.inputValues.description}
            onChangeText={textChangeHandler.bind(this, 'description')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

EditActivityScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('aid')
      ? 'Edit Activity'
      : 'Add Activity',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item 
          title='Save'
          iconName='ios-checkmark'
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditActivityScreen;