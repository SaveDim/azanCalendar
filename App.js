import React, { useState, useEffect } from "react";
import { TouchableOpacity, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// TODO: api url https://collectapi.com/api/pray/pray-times-api

const HomeScreen = () => {
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
      <ImageBackground
          source={require('./assets/testphotos/background.jpg')}
          style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.countdownText}>{formatTime(countdown)} left to pray</Text>
        </View>
      </ImageBackground>
  );
};

const AzanCalendarScreen = () => (
  <ImageBackground
    source={require('./assets/testphotos/background.jpg')}
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <Text style={styles.screenText}>Azan Calendar Screen</Text>
    </View>
  </ImageBackground>

);

const SettingsScreen = () => (
  <ImageBackground
    source={require('./assets/testphotos/background.jpg')}
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <Text style={styles.screenText}>Settings Screen</Text>
    </View>
  </ImageBackground>
);

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          style: styles.bottomTabBar,
          labelStyle: styles.tabLabel,
          activeTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Azan Calendar" component={AzanCalendarScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: '100%',
  },
  screenText: {
    fontSize: 24,
    color: 'white',
  },
  countdownText: {
    fontSize: 32,
    color: 'white',
    marginTop: 10,
  },
  bottomTabBar: {
    backgroundColor: 'white',
    borderTopWidth: 0,
  },
  tabLabel: {
    fontSize: 16,
    color: 'black',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default App;
