import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph, Appbar, Chip, useTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NewsApp = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    categoriesContainer: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: theme.colors.surface,
    },
    categoryChip: {
      marginRight: 8,
    },
    articleCard: {
      marginHorizontal: 16,
      marginVertical: 8,
    },
    cardImage: {
      height: 200,
    },
    cardContent: {
      padding: 16,
    },
    metaInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    icon: {
      marginRight: 4,
    },
  });

  const categories = ['All', 'Politics', 'Technology', 'Sports', 'Entertainment'];

  const articles = [
    {
      id: 1,
      title: 'Breaking: Major Political Reform Announced',
      summary: 'The government has unveiled a comprehensive political reform package aimed at...',
      image: 'https://example.com/politics.jpg',
      category: 'Politics',
      author: 'Jane Doe',
      date: '2024-10-19',
      readTime: '5 min',
    },
    {
      id: 2,
      title: 'New AI Breakthrough in Healthcare',
      summary: 'Researchers have developed a revolutionary AI model that can predict...',
      image: 'https://example.com/tech.jpg',
      category: 'Technology',
      author: 'John Smith',
      date: '2024-10-18',
      readTime: '4 min',
    },
    // Add more hardcoded articles here
  ];

  const renderCategories = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
      {categories.map((category) => (
        <Chip
          key={category}
          selected={activeCategory === category}
          onPress={() => setActiveCategory(category)}
          style={styles.categoryChip}
        >
          {category}
        </Chip>
      ))}
    </ScrollView>
  );

  const renderArticle = (article) => (
    <Card key={article.id} style={styles.articleCard}>
      <Card.Cover source={{ uri: article.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Title>{article.title}</Title>
        <Paragraph>{article.summary}</Paragraph>
        <View style={styles.metaInfo}>
          <Text>
            <Icon name="account" size={16} style={styles.icon} />
            {article.author}
          </Text>
          <Text>
            <Icon name="calendar" size={16} style={styles.icon} />
            {article.date}
          </Text>
          <Text>
            <Icon name="clock-outline" size={16} style={styles.icon} />
            {article.readTime}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="News Feed" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>
      {renderCategories()}
      <ScrollView>
        {articles
          .filter((article) => activeCategory === 'All' || article.category === activeCategory)
          .map(renderArticle)}
      </ScrollView>
    </View>
  );
};

export default NewsApp;