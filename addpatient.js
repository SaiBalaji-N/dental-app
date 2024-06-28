import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { getLoggedInDoctorEmail } from './doctorlogin'; // Import AsyncStorage getter function

const AddPatient = () => {
  const navigation = useNavigation();
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientProblem, setPatientProblem] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [patientMobileNumber, setPatientMobileNumber] = useState('');
  const [patientAddress, setPatientAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || appointmentDate;
    setShowDatePicker(false);
    setAppointmentDate(currentDate);
  };

  const handleAddPatient = async () => {
    try {
      const formattedDate = appointmentDate.toISOString().split('T')[0];
      const email = await getLoggedInDoctorEmail(); // Fetch logged-in doctor's email
      if (email) {
        const response = await axios.post('http://192.168.140.19/php/addpatient.php', new URLSearchParams({
          doctor_email: email, // Send doctor's email to identify doctorid on server side
          patient_name: patientName,
          patient_age: patientAge,
          patient_gender: patientGender,
          patient_problem: patientProblem,
          appointment_date: formattedDate,
          patient_mobile_number: patientMobileNumber,
          patient_address: patientAddress,
        }));

        if (response.data.includes("successfully")) {
          Alert.alert('Success', 'Patient added successfully', [
            { text: 'OK', onPress: () => navigation.navigate('DoctorDashboard') }
          ]);
        } else {
          Alert.alert('Error', response.data || 'An error occurred');
        }
      } else {
        Alert.alert('Error', 'Doctor email not found.');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      Alert.alert('Error', 'An error occurred while adding the patient');
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Add Patient</Text>
      <View style={styles.form}>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Patient Name</Text>
          <TextInput
            style={styles.inputControl}
            value={patientName}
            onChangeText={setPatientName}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Patient Age</Text>
          <TextInput
            style={styles.inputControl}
            value={patientAge}
            onChangeText={setPatientAge}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Patient Gender</Text>
          <TextInput
            style={styles.inputControl}
            value={patientGender}
            onChangeText={setPatientGender}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Patient Problem</Text>
          <TextInput
            style={styles.inputControl}
            value={patientProblem}
            onChangeText={setPatientProblem}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Appointment Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text>{appointmentDate.toLocaleDateString('en-GB')}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={appointmentDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Patient Mobile Number</Text>
          <TextInput
            style={styles.inputControl}
            value={patientMobileNumber}
            onChangeText={setPatientMobileNumber}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Patient Address</Text>
          <TextInput
            style={styles.inputControl}
            value={patientAddress}
            onChangeText={setPatientAddress}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPatient}>
          <Text style={styles.addButtonText}>Add Patient</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8ecf4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  inputControl: {
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
  datePicker: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    borderWidth: 1,
    borderColor: '#C9D3DB',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#075eec',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddPatient;
