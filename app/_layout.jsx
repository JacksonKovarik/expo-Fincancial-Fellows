import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from '@/context/store'
import Loading from "@/components/Loading";

export default function RootLayout() {

  useFonts({
    'jbold': require('@/assets/fonts/Judson/Judson-Bold.ttf'),
    'jreg': require('@/assets/fonts/Judson/Judson-Regular.ttf'),
    'jit': require('@/assets/fonts/Judson/Judson-Italic.ttf')
  });


  

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading/>} persistor={persistor}>
      
        <Stack screenOptions={{headerShown: false}} >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
