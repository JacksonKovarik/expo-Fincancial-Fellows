import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';

// Imported Utilities
import Top_Circle from "@/components/TopCircles";
import Bottom_Circle from "@/components/BottomCircles"

import Loading from '@/components/Loading';
import { Colors } from '@/constants/Colors';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';

// // React-Hook-Form
import {useForm} from 'react-hook-form'
import { router } from 'expo-router';

// // Firebase
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/config/firebase';

// // Redux
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading, setUser } from '@/context/slices/user_information';



// Variable for valid email check
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


export default function Sign_Up(){
  
  // React-Hook-Form
  const {control, handleSubmit, watch} = useForm();
  const pwd = watch('password');

  // Redux states
  const {userLoading, user} = useSelector(state => state.user)
  const dispatch = useDispatch();


  // Handles the 'Sign-Up' buttoon press
  const onSignUpPressed = async (data) => {
    dispatch(setUserLoading(true));
    try{
      console.log("Made it\n" + data.email + "\n" + data.password)
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      setUser(data)
      console.log(user)
    }catch (err) {
      if(err.code === 'auth/email-already-in-use'){
        Alert.alert("Error:", "Account already exists")
      }else {
        Alert.alert("Error:", "Something went wrong, please try again")
      }
      console.log(err)
    }
    
    dispatch(setUserLoading(false));
  }


  // Navigates to Sign-In page if 'Sign-In' button is pressed
    const onSignInPressed = () => {
      router.push('/sign_in')
      console.log("Passed")
    }

  return (  
    <SafeAreaView style = {{flex:1,}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style = {styles.body} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <Text style = {styles.title}>Welcome</Text>
        <CustomInput 
          name = "name"
          placeholder='Enter First and Last Name'
          control={control}
          
          rules={{
            required: 'Name is required', 
            minLength: {value: 2, message: 'Name should be minimum 2 characters long'},
            maxLength: {value: 24, message: 'Name can be maximum 24 characters long'}
          }}
        />
        <CustomInput 
          name = "email"
          placeholder='Enter Email Address'
          control={control}
          rules={{
            required: 'Email Address is required', 
            pattern: {value: EMAIL_REGEX, message: 'Email is invalid'},
            maxLength: {value: 24, message: 'Email can be maximum 24 characters long'}
          }}
        />
        <CustomInput 
          name = "password"
          placeholder='Enter Password'
          control={control}
          rules={{
            required: 'Password is required', 
            minLength: {value: 8, message: 'Password should be minimum 8 characters long'},
            maxLength: {value: 24, message: 'Password can be maximum 24 characters long'}
          }}
          secureTextEntry
        />
        <CustomInput 
          name = "confirm password"
          placeholder='Confirm-Password'
          control={control}
          rules={{
            required: 'Confirm Password is required', 
            minLength: {value: 8, message: 'Password should be minimum 8 characters long'},
            maxLength: {value: 24, message: 'Password can be maximum 24 characters long'},
            validate: value => 
              value == pwd || 'Passwords do not match', 
          }}
          secureTextEntry
        />

        {
          userLoading ? (
            <Loading />
          ) : (
            <CustomButton
              value = 'Welcome'
              onPress = {handleSubmit(onSignUpPressed)}
              type='PRIMARY'
            /> 
          )
        }

        {/* <CustomButton
          value = 'Welcome'
          onPress = {onSignInPressed}
          type='PRIMARY'
        />  */}

        <View style = {styles.horizontal}>
          <Text style = {styles.text}>
            Already have an acoount?
          </Text>
          <TouchableOpacity
            onPress={onSignInPressed}
            style = {{paddingLeft: 110}}
          >
            <Text style = {{fontSize: 13, color: '#00f'}}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <View style = {{position: 'absolute'}}><Top_Circle/></View>
      <View><Bottom_Circle/></View>
    </SafeAreaView>
  );
}


// All styles for the Sign-Up page
const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 35,
    fontFamily: 'Judson-Bold',
    color: '#000',
    marginTop: -25,
    marginBottom: 15,
  },
  text: {
    fontSize: 13,
    color: '#000',
  },

  horizontal: {
    flexDirection: 'row',
  
},
});
