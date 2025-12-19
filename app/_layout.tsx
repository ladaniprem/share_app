import 'react-native-gesture-handler';
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Text, TextInput } from "react-native";
import { SocketProvider } from '../services/TCPProvider';

// Disable font scaling globally to match previous index.js behavior
const TextAny = Text as any;
TextAny.defaultProps = TextAny.defaultProps || {};
TextAny.defaultProps.allowFontScaling = false;

const TextInputAny = TextInput as any;
TextInputAny.defaultProps = TextInputAny.defaultProps || {};
TextInputAny.defaultProps.allowFontScaling = false;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'okra-regular': require('../assets/fonts/Okra-Regular.ttf'),
    'okra-medium': require('../assets/fonts/Okra-Medium.ttf'),
    'okra-bold': require('../assets/fonts/Okra-Bold.ttf'),
    'okra-Black': require('../assets/fonts/Okra-ExtraBold.ttf'),
    'okra-Light': require('../assets/fonts/Okra-MediumLight.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SocketProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SocketProvider>
  );
}
