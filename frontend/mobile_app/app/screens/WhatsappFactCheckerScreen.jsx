import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, useTheme, Card } from 'react-native-paper';

export default function WhatsappFactCheckerScreen() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      marginBottom: 20,
    },
    button: {
      marginTop: 10,
    },
    resultCard: {
      marginTop: 20,
      padding: 16,
    },
    resultText: {
      fontSize: 18,
      marginBottom: 8,
      color: theme.colors.text,
    },
    probabilityText: {
      fontSize: 16,
      color: theme.colors.text,
    },
  });

  const analyzeNews = async () => {
    if (!text.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict/simple/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ error: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>WhatsApp News Fact Checker</Text>
      <TextInput
        label="Paste news text here"
        value={text}
        onChangeText={setText}
        mode="outlined"
        multiline
        numberOfLines={6}
        style={styles.input}
      />
      <Button 
        mode="contained" 
        onPress={analyzeNews} 
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        Analyze
      </Button>
      {result && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text style={styles.resultText}>
              Prediction: {result.prediction}
            </Text>
            <Text style={styles.probabilityText}>
              Confidence: {(result.probability * 100).toFixed(2)}%
            </Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}