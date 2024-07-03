import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { getLoggedInDoctorId } from './doctorlogin';

const DeepLearning = ({ route }) => {
  const navigation = useNavigation();
  const { appointment } = route.params;
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [predictionImage, setPredictionImage] = useState(null);

  useEffect(() => {
    fetchDoctorId();
  }, []);

  const fetchDoctorId = async () => {
    try {
      const id = await getLoggedInDoctorId();
      setDoctorId(id);
    } catch (error) {
      console.error('Error fetching doctor ID:', error);
      Alert.alert('Error', 'An error occurred while fetching doctor ID');
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedImage) {
        try {
          const response = await saveImageAddressToDB(doctorId, selectedImage.assets[0].uri);
          if (response.success) {
            setPredictionImage(selectedImage.assets[0].uri); // Store image URI for prediction display
            setCurrentStep(3); // Move to the prediction display step
          } else {
            throw new Error(response.message || 'Failed to save image address');
          }
        } catch (error) {
          console.error('Error saving image address:', error);
          Alert.alert('Error', 'Failed to save image address to the database.');
        }
      } else {
        Alert.alert('No Image Selected', 'Please select an image to upload.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setSelectedImage(null); // Clear selected image on going back
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    } else {
      navigation.goBack();
    }
  };

  const handleImageSelect = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result); // Update selected image
    }
  };

  const saveImageAddressToDB = async (doctorId, imagePath) => {
    try {
      const response = await axios.post('http://172.25.33.137/php/uploadimageaddress.php', {
        doctorid: doctorId,
        image_address: imagePath,
      });
      return response.data;
    } catch (error) {
      console.error('Error saving image address:', error);
      throw error;
    }
  };

  const navigateToOperationDetails = () => {
    navigation.navigate('OperationDetails', {
      appointment: {
        ...appointment,
        image_address: predictionImage, // Pass prediction image address to operation details
      },
      doctorId: doctorId, // Pass doctor ID to operation details
    });
  };

  const getPatientDetails = () => {
    return {
      patient_name: appointment.patient_name,
      patient_age: appointment.patient_age,
      patient_gender: appointment.patient_gender,
      patient_mobile_number: appointment.patient_mobile_number,
      patient_address: appointment.patient_address,
      prediction: 'The skin is thick', // Replace with actual prediction logic
    };
  };

  return (
    <View style={styles.container}>
      {/* Patient Details Heading */}
      <Text style={styles.patientDetailsHeading}>Patient Details</Text>

      <View style={styles.whiteContainer}>
        {currentStep === 1 && (
          <View style={styles.content}>
            <View style={styles.detailsContainer}>
              <Text style={styles.appointmentText}>Patient Name: {appointment.patient_name}</Text>
              <Text style={styles.appointmentText}>Gender: {appointment.patient_gender}</Text>
              <Text style={styles.appointmentText}>Problem: {appointment.patient_problem}</Text>
              <Text style={styles.appointmentText}>Appointment Date: {appointment.appointment_date}</Text>
              <Text style={styles.appointmentText}>Age: {appointment.patient_age}</Text>
              <Text style={styles.appointmentText}>Mobile Number: {appointment.patient_mobile_number}</Text>
              <Text style={styles.appointmentText}>Address: {appointment.patient_address}</Text>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.content}>
            <View style={styles.imageUploadContainer}>
              <Text style={styles.title}>Upload Tooth Image</Text>
              <TouchableOpacity onPress={handleImageSelect} style={styles.uploadIconContainer}>
                <View style={styles.uploadIcon}>
                  <Text style={styles.uploadText}>Upload Image</Text>
                </View>
              </TouchableOpacity>
              {selectedImage && (
                <Image source={{ uri: selectedImage.assets[0].uri }} style={styles.selectedImage} />
              )}
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.content}>
            <View style={styles.predictionContainer}>
              <Text style={styles.title}>Prediction Results</Text>
              <Image source={{ uri: predictionImage }} style={styles.predictionImage} />
              <Text style={styles.predictionText}>Prediction: The skin is thick</Text>
              {/* Replace 'The skin is thick' with actual prediction logic */}
            </View>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        {currentStep === 3 && (
          <TouchableOpacity style={styles.button} onPress={navigateToOperationDetails}>
            <Text style={styles.buttonText}>To Operation</Text>
          </TouchableOpacity>
        )}
        {(currentStep === 1 || currentStep === 2) && (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center', // Center vertically
  },
  patientDetailsHeading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D2A32',
    marginBottom: 20,
    textAlign: 'center',
  },
  whiteContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2, // For Android elevation effect
    shadowColor: '#000', // For iOS shadow effect
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center', // Center align content within each step
  },
  detailsContainer: {
    width: '100%', // Full width within the white container
    alignItems: 'center',
    marginBottom: 20,
  },
  appointmentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D2A32',
    marginBottom: 10,
    textAlign: 'center',
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D2A32',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadIconContainer: {
    alignItems: 'center',
  },
  uploadIcon: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D2A32',
    textAlign: 'center',
  },
  selectedImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  predictionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  predictionImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1D2A32',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Center horizontally and space around
    marginTop: 20,
  },
  button: {
    backgroundColor: '#075eec',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export const getPatientDetails = (appointment) => {
  return {
    patient_name: appointment.patient_name,
    patient_age: appointment.patient_age,
    patient_gender: appointment.patient_gender,
    patient_mobile_number: appointment.patient_mobile_number,
    patient_address: appointment.patient_address,
    prediction: 'The skin is thick', // Replace with actual prediction logic
  };
};

export default DeepLearning;
