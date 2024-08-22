import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from 'expo-router/drawer'
import { Colors } from "@/constants/Colors";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { DrawerItemList } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function DrawerLayout() {

    // const onLogOutPressed = async () => {
    //     await signOut(auth);
    // }

    const onLogOutPressed = () => {
        router.push('/get_started')
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Drawer 
                screenOptions={{
                    headerShown: false,
                    swipeEdgeWidth: 150,

                    // drawerStyle: {
                    //     backgroundColor: Colors.lightPrime,
                    //     width: 250,
                    // },
                }}
            
                // drawerContent={
                // (props) => {
                //     return (
                //     <SafeAreaView style={{flex: 1, flexDirection: 'column', }}>
                //         <View style={{marginBottom: 35, marginTop: 20, alignItems: 'center'}}>
                //         <Text style={{color: 'black', fontSize: 30, fontFamily: 'Judson-Bold'}}>Financial Fellows</Text>
                //         </View>
                //         <DrawerItemList {...props}/>
                //         <View 
                //         style={{
                //             height: 40,
                //             width: '100%',
                //             justifyContent: 'center',
                //             alignItems: 'center',
                //             flexDirection: 'row',
                //             marginTop: 300
                //         }}
                //         >
                //         <TouchableOpacity
                //             onPress={onLogOutPressed}
                //             style={{
                //             backgroundColor: '#fff',
                //             width: 150,
                //             height: 40,
                //             alignItems: 'center',
                //             justifyContent: 'center',
                //             borderRadius: 15,
                //             elevation: 2, // Android
                //             marginTop: 80
                //             }}
                //         >
                //             <Text style = {{fontSize: 20, color: '#00f'}}>
                //             Log out
                //             </Text>
                //         </TouchableOpacity>
                //         </View>
                        
                //     </SafeAreaView>
                //     )
                // }
                // }
                >
                <Drawer.Screen
                    name="monthly"
                    options={{
                        drawerLabel: 'Monthly',
                        title: 'Home',
                        
                    }}
                />
                <Drawer.Screen
                    name="weekly"
                    options={{
                        drawerLabel: 'Weekly',
                        title: 'Weekly',
                        
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    )
}