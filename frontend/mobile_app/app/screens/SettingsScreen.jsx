import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Switch } from 'react-native-paper';

export default function SettingsScreen({ toggleTheme, isDarkTheme }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Settings</Text>
      
      <View style={styles.themeSwitch}>
        <Text>Dark Theme</Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  themeSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});
