import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {

  useFonts({
    'jbold': require('@/assets/fonts/Judson/Judson-Bold.ttf'),
    'jreg': require('@/assets/fonts/Judson/Judson-Regular.ttf'),
    'jit': require('@/assets/fonts/Judson/Judson-Italic.ttf')
  });

  

  return (
    <Stack screenOptions={{headerShown: false}} >
      <Stack.Screen name="index" />
    </Stack>
  );
}
