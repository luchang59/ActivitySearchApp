import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Button, Text, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as authActions from "../../store/actions/user";

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



const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
    }, 
    inputValidities: {
      email: false,
      firstName: false,
      lastName: false,
      password: false
    }, 
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.username,
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.password
      );
    } else {
      action = authActions.logIn(
        formState.inputValues.username,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate('Activity');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }; 

  // const logInHandler = () => {
  //   dispatch(authActions.logIn(
  //     formState.inputValues.username,
  //     formState.inputValues.password
  //     )
  //   );
  // }; 

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValues, inputValidities) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValues,
        isValid: inputValidities,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      sytle={styles.screen}
    >
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.username}>Username</Text>
          <TextInput 
            style={styles.input}
            initialValue={""}
            value={formState.inputValues.username}
            onChangeText={inputChangeHandler.bind(this, 'username')}
            returnKeyType='next'
          />
        </View>
        {isSignup ? (
          <View style={styles.formControl}>
            <Text style={styles.label}>First Name</Text>
              <TextInput 
                style={styles.input}
                initialValue={""}
                value={formState.inputValues.firstName}
                returnKeyType='next'
                onChangeText={inputChangeHandler.bind(this, 'firstName')}
              />
          </View>
        ) : (
          <View/>
        )}
        {isSignup ? (
          <View style={styles.formControl}>
            <Text style={styles.label}>Last Name</Text>
              <TextInput 
                style={styles.input}
                initialValue={""}
                value={formState.inputValues.lastName}
                returnKeyType='next'
                onChangeText={inputChangeHandler.bind(this, 'lastName')}
              />
          </View>
        ) : (
          <View/>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input}
            initialValue={""}
            value={formState.inputValues.password}
            secureTextEntry
            // minLength={8}
            onChangeText={inputChangeHandler.bind(this, 'password')}
          />
        </View>
      </View>
        {isLoading ? (
          <ActivityIndicator 
            size="small"
            color={Colors.primary}
          />
        ) : (
          <Button 
          title={isSignup ? 'Sign Up' : 'Login'}
          color={Colors.primary} 
          onPress={authHandler}
          />
        )}
        <Button 
          title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
          color={Colors.accent} 
          onPress={() => {
            setIsSignup(prevState => !prevState);
          }}
        />
    </KeyboardAvoidingView> 
  )
};

AuthScreen.navigationOptions = {
  headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
  form: {
    margin: 20

  },
  formControl: {
    width: '100%'
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
});

export default AuthScreen;