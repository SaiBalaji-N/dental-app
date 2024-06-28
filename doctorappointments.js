import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DoctorAppointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // State to track active tab

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch doctor's ID from AsyncStorage
        const doctorId = await AsyncStorage.getItem('@logged_in_doctor_id');

        if (!doctorId) {
          console.error('Doctor ID not found in AsyncStorage');
          setLoading(false);
          return;
        }

        // Fetch upcoming appointments
        const upcomingResponse = await axios.post(
          'http://192.168.140.19/php/fetchappointments.php',
          { doctorid: doctorId, appointment_type: 'upcoming' }
        );
        setUpcomingAppointments(upcomingResponse.data.appointments || []);

        // Fetch completed appointments
        const completedResponse = await axios.post(
          'http://192.168.140.19/php/fetchappointments.php',
          { doctorid: doctorId, appointment_type: 'completed' }
        );
        setCompletedAppointments(completedResponse.data.appointments || []);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleTabPress = (tab) => {
    setActiveTab(tab); // Update active tab state
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#075eec" />
      </View>
    );
  }

  const renderAppointments = (appointments) => {
    if (!appointments || appointments.length === 0) {
      return (
        <Text style={styles.noAppointmentsText}>No appointments found</Text>
      );
    }

    return appointments.map((appointment, index) => (
      <TouchableOpacity key={index} style={styles.appointmentContainer}>
        <Text style={styles.appointmentText}>Patient Name: {appointment.patient_name}</Text>
        <Text style={styles.appointmentText}>Gender: {appointment.patient_gender}</Text>
        <Text style={styles.appointmentText}>Problem: {appointment.patient_problem}</Text>
        <Text style={styles.appointmentText}>Appointment Date: {appointment.appointment_date}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => handleTabPress('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => handleTabPress('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {activeTab === 'upcoming' ? renderAppointments(upcomingAppointments) : renderAppointments(completedAppointments)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#075eec',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#075eec',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  appointmentContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  appointmentText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  noAppointmentsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default DoctorAppointments;
