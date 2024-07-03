import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GetStarted from './getstarted';
import RoleSelection from './role';
import DoctorLogin from './doctorlogin';
import PatientLogin from './patientlogin';
import DoctorSignup from './doctorsignup';
import PatientSignup from './patientsignup';
import DoctorDashboard from './doctordashboard';
import PatientDashboard from './patientdashboard';
import PatientProfile from './patientprofile';
import DoctorProfile from './doctorprofile';
import DoctorSearch from './doctorsearch';
import PatientSearch from './patientsearch';
import EditDoctorProfile from './editdoctorprofile';
import EditPatientProfile from './editpatientprofile';
import AddPatient from './addpatient';
import DoctorAppointments from './doctorappointments';
import DeepLearning from './deeplearning';
import OperationDetails from './operation';
import DisplayOperationDetails from './displayoperationdetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetStarted">
        <Stack.Screen name="GetStarted" component={GetStarted} options={{ headerShown: false }}/>
        <Stack.Screen name="RoleSelection" component={RoleSelection} options={{ title: 'Select Your Role', headerShown: false }}/>
        <Stack.Screen name="DoctorLogin" component={DoctorLogin} options={{ title: 'Doctor Login', headerShown: false }}/>
        <Stack.Screen name="PatientLogin" component={PatientLogin} options={{ title: 'Patient Login', headerShown: false }}/>
        <Stack.Screen name="DoctorSignup" component={DoctorSignup} options={{ title: 'Doctor Signup', headerShown: false }}/>
        <Stack.Screen name="PatientSignup" component={PatientSignup} options={{ title: 'Patient Signup', headerShown: false }}/>
        <Stack.Screen name="DoctorDashboard" component={DoctorDashboard} options={{ title: 'DoctorDashboard', headerShown: false }}/>
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} options={{ title: 'PatientDashboard', headerShown: false }}/>
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{ title: 'DoctorProfile', headerShown: false }}/>
        <Stack.Screen name="EditDoctorProfile" component={EditDoctorProfile} options={{ title: 'EditDoctorProfile', headerShown: false }}/>
        <Stack.Screen name="PatientProfile" component={PatientProfile} options={{ title: 'PatientProfile', headerShown: false }}/>
        <Stack.Screen name="EditPatientProfile" component={EditPatientProfile} options={{ title: 'EditPatientProfile', headerShown: false }}/>
        <Stack.Screen name="DoctorSearch" component={DoctorSearch} options={{ title: 'DoctorSearch', headerShown: false }}/>
        <Stack.Screen name="PatientSearch" component={PatientSearch} options={{ title: 'PatientSearch', headerShown: false }}/>
        <Stack.Screen name="AddPatient" component={AddPatient} options={{ title: 'AddPatient', headerShown: false }}/>
        <Stack.Screen name="DoctorAppointments" component={DoctorAppointments} options={{ title: 'DoctorAppointments', headerShown: false }}/>
        <Stack.Screen name="DeepLearning" component={DeepLearning} options={{ title: 'DeepLearning', headerShown: false }}/>
        <Stack.Screen name="OperationDetails" component={OperationDetails} options={{ title: 'OperationDetails', headerShown: false }}/>
        <Stack.Screen name="DisplayOperationDetails" component={DisplayOperationDetails} options={{ title: 'DisplayOperationDetails', headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
