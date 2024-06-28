import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

const PatientSignup = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    contactNo: '',
    age: '',
    gender: '',
  });

  const handleSignup = () => {
    axios.post('http://192.168.140.19/php/patientsignup.php', form)
      .then(response => {
        console.log(response.data);
        if (response.data.message === 'Patient registered successfully') {
          Alert.alert('Success', response.data.message, [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PatientLogin') // Navigate to PatientLogin screen
            }
          ]);
        } else {
          Alert.alert('Error', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to register patient');
      });
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Patient Signup</Text>
      <View style={styles.form}>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.inputControl}
            placeholder="sai balaji"
            autoCapitalize="words"
            onChangeText={(name) => setForm({ ...form, name })}
            value={form.name}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={styles.inputControl}
            placeholder="saibalaji@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(email) => setForm({ ...form, email })}
            value={form.email}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.inputControl}
            placeholder="********"
            secureTextEntry
            autoCapitalize="none"
            onChangeText={(password) => setForm({ ...form, password })}
            value={form.password}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Contact Number</Text>
          <TextInput
            style={styles.inputControl}
            placeholder="1234567890"
            keyboardType="phone-pad"
            onChangeText={(contactNo) => setForm({ ...form, contactNo })}
            value={form.contactNo}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.inputControl}
            placeholder="30"
            keyboardType="numeric"
            onChangeText={(age) => setForm({ ...form, age })}
            value={form.age}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Gender</Text>
          <TextInput
            style={styles.inputControl}
            placeholder="Male/Female"
            autoCapitalize="words"
            onChangeText={(gender) => setForm({ ...form, gender })}
            value={form.gender}
          />
        </View>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign up</Text>
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
  signupButton: {
    backgroundColor: '#075eec',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PatientSignup;
