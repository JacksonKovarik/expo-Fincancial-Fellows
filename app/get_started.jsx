import Bottom_Circle from "@/components/BottomCircles";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Top_Circle from "@/components/TopCircles";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";

export default function Get_Started() {    
    // Handles the 'Get Started' button press
    const onPressFunction = () => {
        // navigation.navigate('Sign Up');
        router.push('/sign_up')
        console.log("Passed")
    }
    
    return(
        <ThemedView style = {{flex: 1}}>
            <View style = {styles.body}>
                <Image
                    style = {styles.image}  
                    source={require('@/assets/images/GetStarted.png')}
                />
                <ThemedText type="title">Financial</ThemedText>
                <ThemedText type="title">Fellows</ThemedText>
                <Pressable
                    onPress={onPressFunction}
                    style = {( {pressed} ) => [ {backgroundColor: pressed ? Colors.secondary : Colors.primary}, styles.button ]}
                    android_ripple={{color: Colors.primary}}
                >
                    <ThemedText type="primaryButton">Get Started</ThemedText>
                </Pressable>
            </View>
            <View style = {{position: 'absolute'}}><Top_Circle/></View>
            <View><Bottom_Circle/></View>
          </ThemedView>
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
