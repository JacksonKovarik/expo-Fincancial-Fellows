import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

// Utilities from 'components' or 'constants' folder
import Top_Circle from "@/components/TopCircles";
import Bottom_Circle from "@/components/BottomCircles";
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import Loading from '@/components/Loading';
import { Colors } from '@/constants/Colors';

// React-Hook-Form
import {useForm} from 'react-hook-form'

// Friebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading } from '@/context/slices/user_information';

import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';



export default function Sign_In(){

  // Redux
  const {userLoading} = useSelector(state => state.user)
  const dispatch = useDispatch();

  // React-Hook-Form
  const {control, handleSubmit} = useForm();

  // Handles the 'Sign-In' button press
  const onSignInPress = async (data) => {
    
    dispatch(setUserLoading(true));
    try{
      await signInWithEmailAndPassword(auth, data.email, data.password);
    }catch(err) {
      console.log(err.code)
      if(err.code === 'auth/invalid-credential'){
        Alert.alert("Error:", "Invalid email or password")
      }else {
        console.log(err)
      }
    }
    dispatch(setUserLoading(false));  
  }

  // App Navigation
  const onBackPress = () => {
    router.back;
  }
 
  const onForgotPasswordPress = () => {
    console.log("FPP")
  }


  return (  
    <SafeAreaView style = {{flex:1,}}>
      <View style = {styles.body}>

        <Text style = {styles.title}>Financial</Text>
        <Text style = {styles.title}>Fellows</Text>
       
        <Text style = {{color: Colors.black, fontSize: 30, fontFamily: 'Judson-Bold'}}>
            Sign In:
        </Text>


        <CustomInput 
          name="email"
          placeholder='Enter Email Address'
          control={control}
          rules={{
            required: 'Email is required', 
            minLength: {value: 3, message: 'Email should be minimum 3 characters long'}
          }}
        />
        <CustomInput
          name="password"
          placeholder='Enter Password'
          control={control}
          rules={{
            required: 'Password is required', 
            minLength: {value: 3, message: 'Password should be minimum 3 characters long'}
          }}
          secureTextEntry={true}
        />
        


        <TouchableOpacity
            onPress={onForgotPasswordPress}
          >
            <Text style = {{fontSize: 13, color: '#00f', fontFamily: 'Judson-Regular', marginTop: 15}}>
              Forgot Password?
            </Text>
        </TouchableOpacity>

        {
          userLoading ? (
            <Loading />
          ) : (
            <CustomButton
              onPress={handleSubmit(onSignInPress)}
              value = 'Sign In'
              type='PRIMARY'
            />
          )
        }
      </View>


      <View style = {{position: 'absolute'}}><Top_Circle/></View>
      <View><Bottom_Circle/></View>

      <View style = {styles.back}>
        
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name={'arrow-back'} size={30}/>
        </TouchableOpacity> 

      </View>
    </SafeAreaView>
  );
}


// All styles for the Sign-In page
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
    color: Colors.primary,
    marginTop: -25,
    marginBottom: 15,
  },
  back: {
      position: 'absolute', 
      height: 5, 
      width: 30, 
      top: 80,
      left: 50,
  },
  
});
