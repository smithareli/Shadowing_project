import "../lib/crypto-polyfill"
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from 'react';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { authClient } from '@/lib/neon-auth';

WebBrowser.maybeCompleteAuthSession();

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const router = useRouter();
  const url= Linking.useURL();
  const colorScheme = useColorScheme();
  useEffect(()=>{
    const handleDeepLink = async(incomingUrl: string)=>{
      const parsed= Linking.parse(incomingUrl);
      if (parsed.path==="home" || parsed.path === "--/home"){
        await authClient.getSession();
        router.replace("/home");
      }
    };
    if (url){
      handleDeepLink(url);
    }
  }, [url]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="(tabs)"/>
      </Stack>
    </ThemeProvider>
  );
}
