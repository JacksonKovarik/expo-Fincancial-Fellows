import { auth } from "@/config/firebase";
import { setUser } from "@/context/slices/user_information";
import { Redirect, Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";



export default function authLayout() {

  const {user} = useSelector(state => state.user)

  const dispatch = useDispatch()

  
  onAuthStateChanged(auth,u => {
    dispatch(setUser(u));
  })

  if (user) {
    return (
      <Redirect href={'/(drawer)/monthly'} />
    )
    
  }else {
      return (
        <Stack screenOptions={{headerShown: false}} >
          <Stack.Screen name="sign_in" />
          <Stack.Screen name="sign_up" />
        </Stack>
      )
    
  }
}