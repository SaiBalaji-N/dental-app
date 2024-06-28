import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const EditPatientProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [patientData, setPatientData] = useState(route.params.patient);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.patient) {
      setPatientData(route.params.patient);
    }
  }, [route.params?.patient]);

  const handleUpdate = async () => {
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
        Alert.alert('Success', 'Profile updated successfully');
        navigation.navigate('PatientProfile', { refresh: true });
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075eec" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Edit Profile</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={patientData.Name}
          onChangeText={(text) => setPatientData({ ...patientData, Name: text })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={patientData.email}
          onChangeText={(text) => setPatientData({ ...patientData, email: text })}
        />

        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          value={patientData.gender}
          onChangeText={(text) => setPatientData({ ...patientData, gender: text })}
        />

        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          value={patientData.contactno}
          onChangeText={(text) => setPatientData({ ...patientData, contactno: text })}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={patientData.age.toString()}
          onChangeText={(text) => setPatientData({ ...patientData, age: parseInt(text, 10) || 0 })}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e8ecf4',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C9D3DB',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#075eec',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8ecf4',
  },
});

export default EditPatientProfile;
