import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";


export default function ListBox({otherStyles, ...otherProps}) {
    return (
        <LinearGradient colors={[ Colors.primary, Colors.lightPrime, Colors.primary ]} style={[ styles.list, otherStyles ]} {...otherProps} />
    )
}

const styles = StyleSheet.create({
    list: {
        height: '45%',
        width: '85%',
        borderRadius: 20,
        marginTop: 45,
        flexDirection: 'column',
        alignItems: 'center'
    },
})