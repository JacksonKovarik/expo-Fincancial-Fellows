import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";


export default function InfoBox({otherStyles, ...otherProps}) {

    return(
        <LinearGradient colors={[ Colors.primary,Colors.lightPrime ]} style = {[ styles.visual, otherStyles ]} {...otherProps} />
    )
}

const styles = StyleSheet.create({
    visual: {
        flexDirection: 'row',
        height: '25%',
        width: '85%',
        backgroundColor: Colors.lightPrime,
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20,
    },
})