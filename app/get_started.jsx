import Bottom_Circle from "@/components/BottomCircles";
import Top_Circle from "@/components/TopCircles";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Get_Started() {    
    // Handles the 'Get Started' button press
    const onPressFunction = () => {
        // navigation.navigate('Sign Up');
        router.push('/sign_up')
        console.log("Passed")
    }
    
    return(
        <View style = {{flex: 1, backgroundColor: '#fff'}}>
            <View style = {styles.body}>
                <Image
                    style = {styles.image}  
                    source={require('@/assets/images/GetStarted.png')}
                />
                <Text style={styles.text}>Financial</Text>
                <Text style={styles.text}>Fellows</Text>
                <Pressable
                    onPress={onPressFunction}
                    style = {( {pressed} ) => [ {backgroundColor: pressed ? Colors.secondary : Colors.primary}, styles.button ]}
                    android_ripple={{color: Colors.primary}}
                >
                    <Text style={[styles.text, {color:'#fff', fontSize: 20}]}>Get Started</Text>
                </Pressable>
            </View>
            <View style = {{position: 'absolute'}}><Top_Circle/></View>
            <View><Bottom_Circle/></View>
          </View>
  );
}

const styles = StyleSheet.create ({
  body: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
  },
  image: {
      width: '80%',
      height: '21%',
      marginTop: -30,
      marginBottom: 20,
      alignItems: 'center',
  },
  text: {
      fontSize: 35,
      color: Colors.primary,
      fontFamily: 'Judson-Bold',
      alignItems: 'center',
  },
  button: {
      width: '80%',
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
  }
})
