import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon from react-native-vector-icons/MaterialIcons
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

// Default profile image URL
const defaultProfileImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROfX2VHlWdQAY-aFbelHP0Tr7gHqYnobGVuarrNZo1pXfW2XvW3pbpzzyK6d2YBuU7D7c&usqp=CAU';

const DoctorProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const email = await AsyncStorage.getItem('@logged_in_doctor_email');
        if (email) {
          const response = await axios.post('http://172.25.33.46/php/doctorprofile.php', { email });
          if (response.data.success) {
            setDoctorData(response.data.doctor);
          } else {
            Alert.alert('Error', response.data.message || 'Failed to fetch doctor profile');
          }
        } else {
          console.log('Email not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        Alert.alert('Error', 'An error occurred while fetching doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, []);

  useEffect(() => {
    if (route.params?.updatedDoctorData) {
      setDoctorData(route.params.updatedDoctorData);
    }
  }, [route.params?.updatedDoctorData]);

  const goBack = () => {
    navigation.goBack();
  };

  const editProfile = () => {
    navigation.navigate('EditDoctorProfile', { doctor: doctorData }); // Navigate to EditDoctorProfile with doctorData
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@logged_in_doctor_email');
      await AsyncStorage.removeItem('@logged_in_doctor_name');
      navigation.navigate('DoctorLogin');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  const screenHeight = Dimensions.get('window').height;
  const containerHeight = screenHeight * 0.8;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#075eec" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} style={styles.iconContainer}>
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity onPress={editProfile} style={styles.iconContainer}>
          <Icon name="edit" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.profileContainer, { height: containerHeight }]}>
          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: defaultProfileImage }} style={styles.profileImage} />
          </View>
          <View style={styles.profileContent}>
            <View style={styles.row}>
              <Text style={styles.heading}>Doctor ID:</Text>
              <Text style={styles.doctorInfo}>{doctorData.doctorid}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.heading}>Name:</Text>
              <Text style={styles.doctorInfo}>{doctorData.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.heading}>Email:</Text>
              <Text style={styles.doctorInfo}>{doctorData.email}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.heading}>Gender:</Text>
              <Text style={styles.doctorInfo}>{doctorData.gender}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.heading}>Contact Number:</Text>
              <Text style={styles.doctorInfo}>{doctorData.contactno}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.heading}>Specialization:</Text>
              <Text style={styles.doctorInfo}>{doctorData.specialization}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.heading}>Experience:</Text>
              <Text style={styles.doctorInfo}>{doctorData.experience}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8ecf4',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#075eec',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconContainer: {
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  profileContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#075eec',
  },
  profileContent: {
    marginTop: 200,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  doctorInfo: {
    fontSize: 18,
    marginBottom: 9,
    color: '#444',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default DoctorProfile;
