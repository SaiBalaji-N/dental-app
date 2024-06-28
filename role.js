import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import your images (adjust paths as needed)
import doctorImage from "C:/Users/bsai3/dental/assets/images/roledoctorimg.jpg";
import patientImage from "C:/Users/bsai3/dental/assets/images/rolepatientimg.jpg";

export default function RoleSelection() {
  const navigation = useNavigation();

  const handleRoleSelection = (role) => {
    if (role === 'doctor') {
      navigation.navigate('DoctorLogin');
    } else if (role === 'patient') {
      navigation.navigate('PatientLogin');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Your Role</Text>

        {/* Doctor Role */}
        <View style={styles.roleContainer}>
          <Image source={doctorImage} style={styles.roleImage} />
          <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelection('doctor')}>
            <Text style={styles.roleText}>Doctor</Text>
          </TouchableOpacity>
        </View>

        {/* Gap */}
        <View style={styles.gap} />

        {/* Patient Role */}
        <View style={styles.roleContainer}>
          <Image source={patientImage} style={styles.roleImage} />
          <TouchableOpacity style={styles.roleButton} onPress={() => handleRoleSelection('patient')}>
            <Text style={styles.roleText}>Patient</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  roleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  roleImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
  },
  roleButton: {
    backgroundColor: '#075eec',
    paddingVertical: 10,
    paddingHorizontal: 75,
    borderRadius: 30,
    marginBottom: 10,
  },
  roleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gap: {
    height: 20,
  },
});
