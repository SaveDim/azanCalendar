import React from "react";
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const HomeScreen = () => (
  <ImageBackground
    source={require('./assets/testphotos/background.jpg')}
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <Text style={styles.screenText}>Home Screen</Text>
    </View>
  </ImageBackground>
);

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
  },
  screenText: {
    fontSize: 24,
    color: 'white',
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
