import * as React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Text style={styles.touchabletext}>Azan Calendar</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
        <NavigationContainer>
          <View>
            <TouchableOpacity>
              <Button title={'Home'}/>
              <Button title={'Home'}/>
              <Button title={'Home'}/>
              <Button title={'Home'}/>
            </TouchableOpacity>
          </View>
        </NavigationContainer>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchabletext: {
    fontWeight: 600,
    fontSize: 24,
    width: "auto",
    height: "auto",
    textAlign: "auto",
    color: 'black',
  }
});
