import { Tabs } from 'expo-router';
import { Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.light.footerBackgroundSelected,
        tabBarInactiveTintColor: Colors.light.GooglecalendarButtonDefault,
        tabBarStyle: {
          backgroundColor: Colors.light.footerBackgroundDefault,
          borderRadius: 100,
          borderTopWidth: 0,
          bottom: 16,
          left: 16,
          right: 16,
          justifyContent: 'center',
          height: 64,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          top: 13,
        },
      }}>
      <Tabs.Screen name="index" options={{tabBarIcon: ({ color, size = 33 }) => (
      <Image
        source={require('@/assets/images/tabIcons/Home-page.png')}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
      />
    ),}} />
      <Tabs.Screen name="insights" options={{tabBarIcon: ({ color, size = 33 }) => (
      <Image
        source={require('@/assets/images/tabIcons/Insights-page.png')}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
      />
    ),}} />
      <Tabs.Screen name="explore" options={{tabBarIcon: ({ color, size = 33 }) => (
      <Image
        source={require('@/assets/images/tabIcons/Calendar-page.png')}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
      />
    ),}} />
      <Tabs.Screen name="profile" options={{tabBarIcon: ({ color, size = 33 }) => (
      <Image
        source={require('@/assets/images/tabIcons/Profile-page.png')}
        style={{ width: size, height: size, tintColor: color }}
        resizeMode="contain"
      />
    ),}} />
    </Tabs>
  );
}
