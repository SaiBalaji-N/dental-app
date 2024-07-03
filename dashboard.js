import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Dashboard() {
  const navigation = useNavigation();

  const openMenu = () => {
    console.log('Menu opened');
  };

  const openProfile = () => {
    console.log('Profile opened');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={openMenu}>
          <Icon name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={openProfile}>
          <Icon name="person" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to the Dashboard</Text>
        {/* Add your dashboard content here */}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.bottomBarButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={30} color="#075eec" />
          <Text style={styles.bottomBarText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomBarButton} 
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search" size={30} color="#075eec" />
          <Text style={styles.bottomBarText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomBarButton} 
          onPress={() => navigation.navigate('Notifications')}
        >
          <Icon name="notifications" size={30} color="#075eec" />
          <Text style={styles.bottomBarText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomBarButton} 
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings" size={30} color="#075eec" />
          <Text style={styles.bottomBarText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#075eec',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D2A32',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#C9D3DB',
  },
  bottomBarButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#075eec',
    marginTop: 5,
  },
});