import React from 'react';
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import { Controller } from 'react-hook-form';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Ionicons from '@expo/vector-icons/Ionicons';

  const CustomInput = ({ control, name, rules = {}, placeholder, secureTextEntry, extraStyle, multiline, icon, color='#000', type='default'}) => {
    return (
        
        <Controller 
          control={control}
          name={name}
          rules={rules}
          render={({field: {value, onChange, onBlur}, fieldState: {error}}) => 
            <>
              <View style = {styles.container}>
                
                <View style={{flexDirection: 'row'}}>
                  {icon ? (
                    
                    <View style={[styles.icon, error ? ({borderWidth: 1, borderColor: 'red'}):({borderWidth: 0})]}>
                      {/* <FontAwesomeIcon icon={icon} size={20} color={color}/>  */}
                      <Ionicons name = {icon} size={20} color={color} />  
                    </View>
                  ) : (
                    <View></View>
                  )}
                  
                  <TextInput 
                    value={value}
                    onChangeText={onChange} 
                    onBlur={onBlur} 
                    placeholder={placeholder}
                    placeholderTextColor={'#999'}
                    style = {[extraStyle ? (extraStyle):(styles.regularInput), error? ({borderColor: 'red', marginBottom: 5}):({borderColor: '#eee'})]}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    keyboardType={type}
                  />
                </View>
              </View>
              {error && (
                <Text style = {{color: 'red', alignSelf: 'stretch', marginLeft: 10, marginBottom: 10}}>{error.message || 'Error'}</Text>
              )}
            </>
          }
        />
    )
  }

  const styles = StyleSheet.create ({
    container: {
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 10,
      
    },
    regularInput: {
      width: '85%',
      height: 45,
      backgroundColor: '#eee',

      margin: 10,
      paddingLeft: 10,
      
      borderWidth: 1,
    },
    icon: {
      width: 40, 
      height: 40, 
      backgroundColor: 'white', 
      
      borderBottomLeftRadius: 10, 
      borderTopLeftRadius: 10, 
      borderRightWidth: 1,
      
      alignItems: 'center', 
      justifyContent: 'center', 
    },
  })

  export default CustomInput;