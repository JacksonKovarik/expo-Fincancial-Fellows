import { Colors } from '@/constants/Colors';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
  } from 'react-native';

const Bottom_Circle = () => {
    return (
        <SafeAreaView style = {{flex: 1,}}>
            <View style = {styles.container}>
                
                <View style = {[styles.circle3, {opacity:.3}]}/>
                <View style = {[styles.circle2, {opacity:.3}]} /> 
                <View style = {[styles.circle1, {opacity:.3}]}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle1: {
        width: 180,
        height: 180,
        borderRadius: 180/2,
        backgroundColor: Colors.primary,
        position: 'absolute',
        right: 40,
        bottom: -90,
    },
    circle2: {
        width: 190,
        height: 190,
        borderRadius: 190/2,
        backgroundColor: Colors.secondary,
        position: 'absolute',
        right: -95,
        bottom: -20,
    },
    circle3: {
        width: 160,
        height: 160,
        borderRadius: 160/2,
        backgroundColor: Colors.primary,
        position: 'absolute',
        right: 20,
        bottom: 20,
    },
    
    
    
})

export default Bottom_Circle;