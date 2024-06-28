import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GetStarted = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>“A healthy smile is a beautiful smile.”</Text>
      <Image source={require("C:/Users/bsai3/dental/assets/images/dentistgetstarted.jpg")} style={styles.logo} />
      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.getStartedButtonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 50,
  },
  quote: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    top: -90,
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 100,
  },
  getStartedButton: {
    backgroundColor: '#075eec',
    paddingVertical: 20,
    paddingHorizontal: 75,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    width: '100%', // Ensure button spans the full width
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default GetStarted;
