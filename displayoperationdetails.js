import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DisplayOperationDetails = () => {
  const [upcomingOperations, setUpcomingOperations] = useState([]);
  const [completedOperations, setCompletedOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchOperations = async () => {
      try {
        const doctorId = await AsyncStorage.getItem('loggedInDoctorId');
        if (!doctorId) {
          console.error('Doctor ID not found in AsyncStorage');
          setLoading(false);
          return;
        }

        const response = await axios.post(
          'http://172.25.33.137/php/fetchoperationdetails.php',
          { doctorid: doctorId }
        );

        const operations = response.data.operations || [];
        const today = new Date().toISOString().split('T')[0];

        const upcomingOps = operations.filter(op => new Date(op.operation_date) >= new Date(today));
        const completedOps = operations.filter(op => new Date(op.operation_date) < new Date(today));

        setUpcomingOperations(upcomingOps);
        setCompletedOperations(completedOps);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching operations:', error);
        setLoading(false);
      }
    };

    fetchOperations();
  }, []);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderOperations = (operations) => {
    if (!operations || operations.length === 0) {
      return <Text style={styles.noOperationsText}>No operations found</Text>;
    }

    return operations.map((operation, index) => (
      <View key={index} style={styles.operationContainer}>
        <Text style={styles.operationText}>Patient Name: {operation.patient_name}</Text>
        <Text style={styles.operationText}>Teeth Measurements: {operation.teeth_measurements}</Text>
        <Text style={styles.operationText}>Material: {operation.teeth_material}</Text>
        <Text style={styles.operationText}>Operation Date: {operation.operation_date}</Text>
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#075eec" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => handleTabPress('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => handleTabPress('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {activeTab === 'upcoming' ? renderOperations(upcomingOperations) : renderOperations(completedOperations)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e8ecf4',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#075eec',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#075eec',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  operationContainer: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  operationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D2A32',
    marginBottom: 5,
  },
  noOperationsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default DisplayOperationDetails;
