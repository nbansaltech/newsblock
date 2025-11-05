import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import CustomAnalyzeScreen from '../screens/CustomAnalyzeScreen';
import ReportedSitesScreen from '../screens/ReportedSitesScreen';
import WhatsappFactCheckerScreen from '../screens/WhatsappFactCheckerScreen';
import NewsApp from '../screens/NewsApp';

const Stack = createStackNavigator();

const lightColors = {
  primary: '#1976D2',
  accent: '#FF4081',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  disabled: '#9E9E9E',
  placeholder: '#BDBDBD',
  backdrop: 'rgba(0, 0, 0, 0.5)',
  elevation: {
    level0: '#ffffff',
    level1: '#f5f5f5',
    level2: '#eeeeee',
    level3: '#e0e0e0',
    level4: '#bdbdbd',
    level5: '#9e9e9e'
  },
};

const darkColors = {
  primary: '#90CAF9',
  accent: '#FF80AB',
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  disabled: '#757575',
  placeholder: '#616161',
  backdrop: 'rgba(255, 255, 255, 0.1)',
  elevation: {
    level0: '#ffffff',
    level1: '#f5f5f5',
    level2: '#eeeeee',
    level3: '#e0e0e0',
    level4: '#bdbdbd',
    level5: '#9e9e9e'
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(colorScheme === 'dark');

  const CustomDefaultTheme = {
    ...PaperDefaultTheme,
    colors: lightColors,
  };
  
  const CustomDarkTheme = {
    ...PaperDarkTheme,
    colors: darkColors,
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isDarkTheme,
    }),
    [isDarkTheme]
  );

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer independent={true} theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerTintColor: theme.colors.text,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'TrustLens' }}
            initialParams={{ preferences }}
          />
          <Stack.Screen
            name="CustomAnalyze"
            component={CustomAnalyzeScreen}
            options={{ title: 'Custom Analysis' }}
          />
          <Stack.Screen
            name="ReportedSites"
            component={ReportedSitesScreen}
            options={{ title: 'Reported Sites' }}
          />
          <Stack.Screen
            name="WhatsappFactChecker"
            component={WhatsappFactCheckerScreen}
            options={{ title: 'Whatsapp Fact Checker' }}
          />
          <Stack.Screen
            name="NewsApp"
            component={NewsApp}
            options={{ title: 'TrustLens - News App' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}