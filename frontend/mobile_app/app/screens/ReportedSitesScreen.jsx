import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { List, Chip, Searchbar, Menu, Button, Modal, Portal, Text, Card, Title, Paragraph } from 'react-native-paper';

export default function ReportedSitesScreen() {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f9',
    },
    categoriesContainer: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: '#ffffff',
    },
    categoryChip: {
      marginRight: 8,
      backgroundColor: 'whitesmoke',
    },
    button:{
      color:'blue'
    },
    searchbarContainer: {
      padding: 10,
    },
    searchbar: {
      marginBottom: 10,
      marginTop: 10,
    },
    articleCard: {
      marginHorizontal: 16,
      marginVertical: 8,
      backgroundColor: '#ffffff',
    },
    cardContent: {
      padding: 16,
    },
    listItem: {
      backgroundColor: '#ffffff',
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#dddddd',
    },
    metaInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    modalContent: {
      backgroundColor: '#ffffff',
      padding: 20,
      margin: 20,
      borderRadius: 5,
      maxHeight: '80%', // Limit the height of the modal
    },
    modalScrollView: {
      flexGrow: 1,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalSection: {
      marginBottom: 15,
    },
    predictionItem: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
    },
  });

  const categories = ['All', 'Attention Required', 'Normal'];

  useEffect(() => {
    const fetchSites = async () => {
      const response = await fetch('http://localhost:8000/reported-sites');
      const data = await response.json();
      setSites(data);
      setFilteredSites(data);
    };
    fetchSites();
  }, []);

  useEffect(() => {
    let result = sites;
    if (filter !== 'All') {
      result = result.filter((site) =>
        filter === 'Attention Required' ? site.attention_required : !site.attention_required
      );
    }
    if (search) {
      result = result.filter((site) => site.url.toLowerCase().includes(search.toLowerCase()));
    }
    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.last_report) - new Date(a.last_report);
      if (sortBy === 'url') return a.url.localeCompare(b.url);
      return 0;
    });
    setFilteredSites(result);
  }, [sites, filter, search, sortBy]);

  const fetchSiteDetails = async (id) => {
    const response = await fetch(`http://localhost:8000/reported-sites/${id}`);
    const data = await response.json();
    setSelectedSite(data);
    setModalVisible(true);
  };

  const renderCategories = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
      {categories.map((category) => (
        <Chip
          key={category}
          selected={filter === category}
          onPress={() => setFilter(category)}
          style={styles.categoryChip}
        >
          {category}
        </Chip>
      ))}
      <Button onPress={() => setMenuVisible(true)} mode="outlined" style={styles.button}>
        Sort & Filter
      </Button>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={<Button onPress={() => setMenuVisible(true)}>Options</Button>}
      >
        <Menu.Item onPress={() => setFilter('all')} title="All" />
        <Menu.Item onPress={() => setFilter('true')} title="Attention Required" />
        <Menu.Item onPress={() => setFilter('false')} title="Normal" />
        <Menu.Item onPress={() => setSortBy('date')} title="Sort by Date" />
        <Menu.Item onPress={() => setSortBy('url')} title="Sort by URL" />
      </Menu>
    </ScrollView>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => fetchSiteDetails(item.id)}>
      <Card style={styles.articleCard}>
        <View style={styles.cardContent}>
          <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
            <Title>News: {item.url}</Title>
          </TouchableOpacity>
          <Paragraph>Last reported: {new Date(item.last_report).toLocaleDateString()}</Paragraph>
          <View style={styles.metaInfo}>
            <Text>Upvotes: {item.upvotes}</Text>
            <Text>Downvotes: {item.downvotes}</Text>
            <Text>{item.attention_required ? 'Attention Required' : 'Normal'}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View>
        <Searchbar
          placeholder="Search sites"
          onChangeText={setSearch}
          value={search}
          style={styles.searchbar}
        />
        {renderCategories()}
      </View>

      <FlatList
        data={filteredSites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalScrollView}>
              {selectedSite && (
                <>
                  <Text style={styles.modalTitle}>Site Details</Text>
                  <View style={styles.modalSection}>
                    <Text>URL: {selectedSite.url}</Text>
                    <Text>Upvotes: {selectedSite.upvotes}</Text>
                    <Text>Downvotes: {selectedSite.downvotes}</Text>
                    <Text>Attention Required: {selectedSite.attention_required ? 'Yes' : 'No'}</Text>
                    <Text>Last Report: {new Date(selectedSite.last_report).toLocaleString()}</Text>
                  </View>
                  {selectedSite.predictions && selectedSite.predictions.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalTitle}>Predictions</Text>
                      {selectedSite.predictions.map((prediction, index) => (
                        <View key={index} style={styles.predictionItem}>
                          <Text>Model Type: {prediction.model_type}</Text>
                          <Text>Prediction: {prediction.prediction}</Text>
                          <Text>Probability: {prediction.probability}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}