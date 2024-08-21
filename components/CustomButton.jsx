import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
  } from 'react-native';
  import {Colors} from "@/constants/Colors";


  export default function CustomButton ({onPress, type, value}) {

    return (
        <Pressable
          onPress={onPress}
          style = {( {pressed} ) => [ {opacity: pressed ? .3 : 1}, styles.button, styles[`${type}Button`] ]}          
        >
          <Text style = {[styles.text, styles[`${type}Text`]]}>{value}</Text>
        </Pressable>
    )
  }

  const styles = StyleSheet.create ({
    button: {
        width: '80%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    PRIMARYButton: {
        backgroundColor: Colors.primary,
    },
    SECONDARYButton: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    TERTIARYButton: {

    },

    text: {
        fontSize: 25,
        fontFamily: 'Judson-Bold',
        alignItems: 'center',
    },
    PRIMARYText: {
        color: '#fff',
    },
    SECONDARYText: {
        color: Colors.primary,
    },
    TERTIARYText:  {
        color: Colors.primary,
        fontSize: 20
    },
  })