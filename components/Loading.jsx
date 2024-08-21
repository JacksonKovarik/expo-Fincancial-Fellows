import { ActivityIndicator, View } from "react-native";
import { Colors } from "@/constants/Colors";


export default function Loading({color=Colors.primary}) {
    return (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="large" color={color} />
        </View>
    )
}