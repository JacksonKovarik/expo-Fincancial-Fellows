import { Colors } from '@/constants/Colors';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
} from 'react-native';


const Top_Circle = () => {
    return (
        <SafeAreaView style = {{flex: 1}}>
            <View style = {styles.container}>
                
                <View style = {[styles.circle3, {opacity:.3}]}/>
                <View style = {[styles.circle2, {opacity:.3}]} /> 
                <View style = {[styles.circle1, {opacity:.3}]}/>
                <View style = {[styles.circle4, {opacity:.3}]}/>
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
        width: 190,
        height: 190,
        borderRadius: 190/2,
        backgroundColor: Colors.primary,
        position: 'absolute',
        left: 0,
        top: -110,
    },
    circle2: {
        width: 190,
        height: 190,
        borderRadius: 190/2,
        backgroundColor: Colors.secondary,
        position: 'absolute',
        left: -115,
        top: -15,
    },
    circle3: {
        width: 165,
        height: 165,
        borderRadius: 165/2,
        backgroundColor: Colors.primary,
        position: 'absolute',
        left: 0,
        top: 0,
    },
    
    circle4: {
        width: 110,
        height: 110,
        borderRadius: 110/2,
        backgroundColor: Colors.secondary,
        position: 'absolute',
        left: 110,
        top: 0,
    },
    
})

export default Top_Circle;