import React, { useState } from "react";
import { StyleSheet, Text, View, } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.screenText}>Home Screen</Text>
  </View>
);

const AzanCalendarScreen = () => (
  <View style={styles.container}>
    <Text style={styles.screenText}>Azan Calendar Screen</Text>
  </View>
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
  },
  bottomTabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'gray',
    paddingBottom: 5,
  },
  tabLabel: {
    fontSize: 16,
  },
});

export default App;
