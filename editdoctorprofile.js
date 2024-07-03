import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditDoctorProfile = () => {
  const navigation = useNavigation();
  const [doctorData, setDoctorData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      const storedDoctor = await AsyncStorage.getItem('@logged_in_doctor');
      if (storedDoctor) {
        setDoctorData(JSON.parse(storedDoctor));
      }
    };

    fetchDoctorData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('doctorid', doctorData.doctorid);
    formData.append('name', doctorData.name);
    formData.append('specialization', doctorData.specialization);
    formData.append('email', doctorData.email);
    formData.append('contactno', doctorData.contactno);
    formData.append('experience', doctorData.experience);

    try {
      const response = await axios.post('http://172.25.33.46/php/editdoctorprofile.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        // Update doctorData in AsyncStorage
        await AsyncStorage.setItem('@logged_in_doctor', JSON.stringify(doctorData));
        navigation.navigate('DoctorProfile', { updatedDoctorData: doctorData });
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
    setDoctorData({ ...doctorData, [key]: value });
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
          value={doctorData.name || ''}
          onChangeText={(text) => handleChange('name', text)}
          placeholder="Enter Name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={doctorData.email || ''}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Enter Email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Specialization</Text>
        <TextInput
          style={styles.input}
          value={doctorData.specialization || ''}
          onChangeText={(text) => handleChange('specialization', text)}
          placeholder="Enter Specialization"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          value={doctorData.contactno || ''}
          onChangeText={(text) => handleChange('contactno', text)}
          placeholder="Enter Contact Number"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Experience</Text>
        <TextInput
          style={styles.input}
          value={doctorData.experience?.toString() || ''}
          onChangeText={(text) => handleChange('experience', text)}
          placeholder="Enter Experience"
          keyboardType="number-pad"
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

export default EditDoctorProfile;
