import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CustomAnalyzeScreen() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date());
  const [result, setResult] = useState(null);
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    input: {
      marginBottom: 10,
    },
    button: {
      marginVertical: 10,
    },
    resultText: {
      marginTop: 20,
      color: theme.colors.text,
    },
  });

  const analyzeNews = async () => {
    try {
      const response = await fetch('http://localhost:8000/predict/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, subject, date: date.toISOString().split('T')[0] }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ error: 'An error occurred' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Text"
        value={text}
        onChangeText={setText}
        mode="outlined"
        multilinese
        style={styles.input}
      />
      <TextInput
        label="Subject"
        value={subject}
        onChangeText={setSubject}
        mode="outlined"
        style={styles.input}
      />
      <Button onPress={() => setDate(new Date())} mode="outlined" style={styles.button}>
        Select Date
      </Button>
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => setDate(selectedDate || date)}
        textColor={theme.colors.text}
      />
      <Button mode="contained" onPress={analyzeNews} style={styles.button}>
        Analyze
      </Button>
      {result && (
        <Text style={styles.resultText}>
          Prediction: {result.prediction}, Probability: {result.probability?.toFixed(2)}
        </Text>
      )}
    </ScrollView>
  );
}