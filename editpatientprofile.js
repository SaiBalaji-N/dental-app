import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const EditPatientProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [patientData, setPatientData] = useState(route.params?.patient || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.patient) {
      setPatientData(route.params.patient);
    }
  }, [route.params?.patient]);

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('patientid', patientData.patientid);
    formData.append('Name', patientData.Name);
    formData.append('email', patientData.email);
    formData.append('gender', patientData.gender);
    formData.append('contactno', patientData.contactno);
    formData.append('age', patientData.age);

    try {
      const response = await axios.post('http://192.168.140.19/php/editpatientprofile.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        // Update patientData in parent screen
        navigation.navigate('PatientProfile', { updatedPatientData: patientData });
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', response.data.message || 'An error occurred while updating the profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating the profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setPatientData({ ...patientData, [key]: value });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075eec" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        value={patientData.Name || ''}
        onChangeText={(text) => handleChange('Name', text)}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={patientData.email || ''}
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={patientData.gender || ''}
        onChangeText={(text) => handleChange('gender', text)}
        placeholder="Gender"
      />
      <TextInput
        style={styles.input}
        value={patientData.contactno || ''}
        onChangeText={(text) => handleChange('contactno', text)}
        placeholder="Contact Number"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={patientData.age?.toString() || ''}
        onChangeText={(text) => handleChange('age', text)}
        placeholder="Age"
        keyboardType="numeric"
      />
      {/* Add more fields as needed */}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#e8ecf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8ecf4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#075eec',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditPatientProfile;
