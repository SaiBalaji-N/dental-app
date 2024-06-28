import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import debounce from 'lodash.debounce';

const PatientSearch = () => {
  const [searchType, setSearchType] = useState('id');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = debounce(async (value) => {
    if (!value) {
      setResults([]);
      return;
    }
  
    setLoading(true);
  
    try {
      const searchTypeParam = searchType === 'name' ? 'name' : 'id';
      const response = await fetch(`http://192.168.140.19/php/patientsearch.php?searchType=${searchTypeParam}&searchValue=${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(errorText);
      }
  
      const jsonData = await response.json();
  
      if (jsonData.success) {
        setResults(jsonData.results);
      } else {
        setResults([]);
        Alert.alert('No results', jsonData.message);
      }
    } catch (error) {
      console.error('Fetch error: ', error);
      Alert.alert('Error', 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    handleSearch(searchValue);
  }, [searchValue, searchType]);

  const renderResult = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.resultText}>Doctor ID: {item.doctorid}</Text>
      <Text style={styles.resultText}>Name: {item.name}</Text>
      <Text style={styles.resultText}>Email: {item.email}</Text>
      <Text style={styles.resultText}>Gender: {item.gender}</Text>
      <Text style={styles.resultText}>Contact Number: {item.contactno}</Text>
      <Text style={styles.resultText}>Specialization: {item.specialization}</Text>
      <Text style={styles.resultText}>Experience: {item.experience}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Search Doctors</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.searchHeader}>
          <Text style={styles.searchHeaderText}>Search By:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, searchType === 'id' && styles.selectedButton]}
              onPress={() => setSearchType('id')}
            >
              <Text style={[styles.buttonText, searchType === 'id' && styles.selectedButtonText]}>ID</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, searchType === 'name' && styles.selectedButton]}
              onPress={() => setSearchType('name')}
            >
              <Text style={[styles.buttonText, searchType === 'name' && styles.selectedButtonText]}>Name</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder={`Enter Doctor ${searchType === 'id' ? 'ID' : 'Name'}`}
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#075eec" />
      ) : (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(item) => item.doctorid.toString()}
          contentContainerStyle={styles.resultsContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#075eec',
    paddingTop: 30,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconContainer: {
    position: 'absolute',
    left: 10,
    top: 30,
    padding: 10,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  searchHeader: {
    marginBottom: 20,
  },
  searchHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#075eec',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#075eec',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#075eec',
  },
  buttonText: {
    color: '#075eec',
  },
  selectedButtonText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#075eec',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  resultsContainer: {
    padding: 20,
  },
  resultItem: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  resultText: {
    fontSize: 16,
    color: '#000',
  },
});

export default PatientSearch;
