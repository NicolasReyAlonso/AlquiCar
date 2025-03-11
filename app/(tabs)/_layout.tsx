import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarInactiveTintColor: 'black',

        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundColor: '#4472C4',
	          top: 100
          },
          default: {
		position: 'absolute',
		top: 100,
		backgroundColor: '#4472C4'
	  },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="alquilaCoche"
        options={{
          title: 'Alquila un vehiculo',
          tabBarIcon: ({ color }) => <FontAwesome5 name="car" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
