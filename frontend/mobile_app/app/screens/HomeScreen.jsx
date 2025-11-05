import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Switch, Text, useTheme } from 'react-native-paper';

export default function HomeScreen({ navigation, route }) {
  const { preferences } = route.params;
  const { toggleTheme, isDarkTheme } = preferences;
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },
    button: {
      marginVertical: 10,
      width: '80%',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
    },
    switchText: {
      marginRight: 10,
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('WhatsappFactChecker')}
        style={styles.button}
      >
        Whatsapp Fact Checker
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('CustomAnalyze')}
        style={styles.button}
      >
        Custom News Analysis
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('ReportedSites')}
        style={styles.button}
      >
        View Reported Sites
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('NewsApp')}
        style={styles.button}
      >
        News App
      </Button>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Dark Theme</Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}