import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";


export default function Banner({ title, onRefresh }) {

    const navigation = useNavigation();

    const onToggle = () => {
        navigation.dispatch(DrawerActions.toggleDrawer())
    }


    return (
        <View 
            style={styles.banner}
        > 
            <Pressable style={{flex: .3, alignItems: 'center', marginLeft: -10, marginTop: 20}} onPress={onToggle}>
                    <Ionicons name={'menu'} size={35} color={'#000'} />
            </Pressable>
            <View style={{alignItems: 'center', justifyContent: 'center',flex: 1,}}>
                <Text style = {{color: Colors.white, fontSize: 30, fontFamily: 'Judson-Bold'}}>
                    {title}
                </Text>
            </View>
            <Pressable style= {({pressed}) => [{flex: .3, alignItems: 'center', marginLeft: -10,  marginTop: 20}]} onPress={onRefresh}>
                    <Ionicons name='refresh' size={35} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        height: '16%',
        width: '100%',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    }, 
})