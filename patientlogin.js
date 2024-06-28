import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const PatientLogin = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.140.19/php/patientlogin.php', {
        email: form.email,
        password: form.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Store email in AsyncStorage upon successful login
        await AsyncStorage.setItem('@logged_in_patient_email', form.email);

        navigation.navigate('PatientDashboard', { patient: response.data.patient });
      } else {
        Alert.alert('Login Failed', response.data.message || 'Email or password is incorrect.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred while logging in.');
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  const handleSignup = () => {
    navigation.navigate('PatientSignup');
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Image source={{ uri: 'https://assets.withfra.me/SignIn.2.png' }} style={styles.logo} />
      <View style={styles.form}>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={styles.inputControl}
            placeholder="saibalaji@example.com"
            placeholderTextColor="#6b7280"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(email) => setForm({ ...form, email })}
            value={form.email}
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.inputControl}
            placeholder="********"
            placeholderTextColor="#6b7280"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(password) => setForm({ ...form, password })}
            value={form.password}
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotPasswordLink} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupLink} onPress={handleSignup}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <Text style={[styles.signupText, { color: '#075eec', fontWeight: 'bold' }]}> Sign up</Text>
      </TouchableOpacity>
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
  logo: {
    width: 80,
    height: 80,
    marginBottom: 36,
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
  loginButton: {
    backgroundColor: '#075eec',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 75,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordLink: {
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
  },
  signupLink: {
    marginTop: 70,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
});

export const getLoggedInPatientEmail = async () => {
  try {
    const email = await AsyncStorage.getItem('@logged_in_patient_email');
    return email;
  } catch (error) {
    console.error('Error retrieving logged-in patient email:', error);
    return null;
  }
};

export default PatientLogin;
