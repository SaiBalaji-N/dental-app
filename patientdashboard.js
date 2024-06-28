import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const windowWidth = Dimensions.get('window').width;
const ads = [
  {
    id: 1,
    url: 'https://i.pinimg.com/originals/8c/33/bc/8c33bcb99a8eadd5f2b6913cf9aba9f7.jpg',
  },
  {
    id: 2,
    url: 'https://www.teamais.net/wp-content/uploads/2020/04/dental-assistant-min.jpg',
  },
  {
    id: 3,
    url: 'https://dentalreach.today/egraliph/2021/06/Dental-Equipment-Market-scaled_6ab8b8a077483865de6a784acd1cab26_2000.jpg',
  },
  {
    id: 4,
    url: 'https://www.carolinasdentist.com/wp-content/uploads/GettyImages-889312670-e1645585407635.jpg.webp',
  },
];

const PatientDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(windowWidth);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const updateContainerWidth = () => {
      setContainerWidth(Dimensions.get('window').width);
    };

    const dimensionHandler = Dimensions.addEventListener('change', updateContainerWidth);

    return () => {
      dimensionHandler.remove();
    };
  }, []);

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const openProfile = () => {
    navigation.navigate('PatientProfile'); // Navigate to Profile screen
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            navigation.navigate('PatientLogin');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewSize = containerWidth;
    const newIndex = Math.floor((contentOffsetX + viewSize / 2) / viewSize);
    setCurrentIndex(newIndex);
  };

  const renderAds = () => {
    return ads.map((ad) => (
      <View key={ad.id} style={styles.adContainer}>
        <Image source={{ uri: ad.url }} style={styles.adImage} resizeMode="cover" />
      </View>
    ));
  };

  const renderIndicators = () => {
    return ads.map((_, index) => (
      <View
        key={index}
        style={[styles.indicator, index === currentIndex ? styles.activeIndicator : null]}
      />
    ));
  };

  const navigateToPatientDashboard = () => {
    navigation.navigate('PatientDashboard'); // Navigate to PatientDashboard screen
  };

  const navigateToSearch = () => {
    navigation.navigate('PatientSearch'); // Navigate to PatientSearch screen
  };

  // Extracting name from route params or setting a default value
  const { name } = route.params || { name: 'Guest' }; // Replace 'Guest' with your default value

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={openDrawer} style={styles.iconContainer}>
          <Icon name="menu" size={36} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Welcome, {name}!</Text>
        <TouchableOpacity onPress={openProfile} style={styles.iconContainer}>
          <Icon name="person" size={36} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scrollable Ads Section */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.adsScrollContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {renderAds()}
      </ScrollView>
      <View style={styles.indicatorsContainer}>
        {renderIndicators()}
      </View>

      {/* Upper Container */}
      <View style={styles.upperContainer}>
        <Text>Upper Container Content</Text>
      </View>

      {/* Lower Container */}
      <View style={styles.lowerContainer}>
        <Text>Lower Container Content</Text>
      </View>

      <View style={styles.content}>
        {/* Content specific to patients */}
      </View>

      {drawerVisible && (
        <View style={styles.drawer}>
          <TouchableOpacity onPress={closeDrawer} style={styles.drawerClose}>
            <Icon name="close" size={30} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToPatientDashboard} style={styles.drawerItem}>
            <Icon name="home" size={24} color="#333" />
            <Text style={styles.drawerText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToSearch} style={styles.drawerItem}>
            <Icon name="search" size={24} color="#333" />
            <Text style={styles.drawerText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('BookAppointment')} style={styles.drawerItem}>
            <Icon name="event" size={24} color="#333" />
            <Text style={styles.drawerText}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AppointmentHistory')} style={styles.drawerItem}>
            <Icon name="history" size={24} color="#333" />
            <Text style={styles.drawerText}>Appointment History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.drawerItem}>
            <Icon name="logout" size={24} color="#ff6347" />
            <Text style={[styles.drawerText, { color: '#ff6347' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {!drawerVisible && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPress={navigateToPatientDashboard}
          >
            <Icon name="home" size={30} color="#075eec" />
            <Text style={styles.bottomBarText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomBarButton}
            onPress={navigateToSearch}
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
            onPress={handleLogout}
          >
            <Icon name="logout" size={30} color="#075eec" />
            <Text style={styles.bottomBarText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

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
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconContainer: {
    padding: 10,
  },
  adsScrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  adContainer: {
    width: windowWidth * 0.8,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: windowWidth * 0.1,
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#075eec',
  },
  upperContainer: {
    width: windowWidth * 0.8,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  lowerContainer: {
    width: windowWidth * 0.8,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  drawerText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  drawerClose: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
});

export default PatientDashboard;
