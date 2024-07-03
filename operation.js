import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { getLoggedInDoctorId } from './doctorlogin';
import { getPatientDetails } from './deeplearning';

const OperationDetails = ({ route }) => {
  const { appointment } = route.params;
  const [teethMeasurements, setTeethMeasurements] = useState('');
  const [teethMaterial, setTeethMaterial] = useState('');
  const [operationDescription, setOperationDescription] = useState('');
  const [operationDate, setOperationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [doctorid, setDoctorid] = useState(null); // Initially set to null
  const [prediction, setPrediction] = useState(Math.round(Math.random()));

  // Function to fetch logged-in doctor's ID
  const fetchDoctorId = async () => {
    try {
      const id = await getLoggedInDoctorId();
      setDoctorid(id);
      console.log('Fetched Doctor ID:', id);
    } catch (error) {
      console.error('Error fetching doctor id:', error);
      // Handle error fetching doctor ID
      Alert.alert('Error', 'Failed to fetch doctor ID.');
    }
  };

  // Fetch doctor ID on component mount
  useEffect(() => {
    fetchDoctorId();
  }, []);

  const formattedDate = operationDate.toISOString().split('T')[0];
  const patientDetails = getPatientDetails(appointment);

  const handleSaveDetails = async () => {
    console.log('Data to save:', {
      doctorid,
      ...patientDetails,
      teeth_measurements: teethMeasurements,
      teeth_material: teethMaterial,
      operation_description: operationDescription,
      operation_date: formattedDate,
      prediction,
    });

    try {
      const response = await axios.post('http://172.25.33.137/php/operation.php', {
        doctorid,
        ...patientDetails,
        teeth_measurements: teethMeasurements,
        teeth_material: teethMaterial,
        operation_description: operationDescription,
        operation_date: formattedDate,
        prediction,
      });

      console.log('Server response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Operation details saved successfully.');
        // Optionally navigate to another screen or reset form
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save operation details.');
      }
    } catch (error) {
      console.error('Error saving operation details:', error);
      Alert.alert('Error', 'Failed to save operation details.');
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Operation Details</Text>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Teeth Measurements</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTeethMeasurements}
            value={teethMeasurements}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Teeth Material</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTeethMaterial}
            value={teethMaterial}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Operation Description</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={4}
            onChangeText={setOperationDescription}
            value={operationDescription}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Operation Date (YYYY-MM-DD)</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.datePickerText}>{formattedDate}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={operationDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || operationDate;
                setOperationDate(currentDate);
                setShowDatePicker(false);
              }}
              minimumDate={new Date()}
            />
          )}
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveDetails}>
          <Text style={styles.saveButtonText}>Save Details</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D2A32',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#C9D3DB',
    width: '100%',
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    width: '100%',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePicker: {
    height: 50,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    width: '100%',
  },
  datePickerText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  saveButton: {
    backgroundColor: '#075EEC',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OperationDetails;
