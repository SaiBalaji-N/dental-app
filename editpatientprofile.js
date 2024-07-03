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
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={patientData.Name || ''}
          onChangeText={(text) => handleChange('Name', text)}
          placeholder="Enter Name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={patientData.email || ''}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Enter Email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          value={patientData.gender || ''}
          onChangeText={(text) => handleChange('gender', text)}
          placeholder="Enter Gender"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          value={patientData.contactno || ''}
          onChangeText={(text) => handleChange('contactno', text)}
          placeholder="Enter Contact Number"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={patientData.age?.toString() || ''}
          onChangeText={(text) => handleChange('age', text)}
          placeholder="Enter Age"
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
  },
  saveButton: {
    backgroundColor: '#075eec',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 75,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditPatientProfile;
