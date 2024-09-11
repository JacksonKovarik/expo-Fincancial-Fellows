import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from '@/context/store'
import { setUser } from "@/context/slices/user_information";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {

  useFonts({
    'jbold': require('@/assets/fonts/Judson/Judson-Bold.ttf'),
    'jreg': require('@/assets/fonts/Judson/Judson-Regular.ttf'),
    'jit': require('@/assets/fonts/Judson/Judson-Italic.ttf')
  });


  

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Stack screenOptions={{headerShown: false}} >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </PersistGate>
    </Provider>
  );
}
