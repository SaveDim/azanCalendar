import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const AzanCalendarScreen = () => {
  const [prayerTimesData, setPrayerTimesData] = useState([]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(
          'http://api.aladhan.com/v1/calendarByCity/2023/11?city=Alanya&country=Turkey&method=2'
        );
        const data = await response.json();
        const prayerData = data.data;

        // Устанавливаем данные о времени молитв в состояние
        setPrayerTimesData(prayerData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchPrayerTimes();
  }, []);

  return (
    <ImageBackground
      source={require('./assets/testphotos/background.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Отображаем данные о времени молитв */}
        {prayerTimesData.map((day, index) => (
          <View key={index} style={styles.prayerDay}>
            <Text>Date: {day.date.readable}</Text>
            <Text>Fajr: {day.timings.Fajr}</Text>
            <Text>Dhuhr: {day.timings.Dhuhr}</Text>
            <Text>Asr: {day.timings.Asr}</Text>
            <Text>Maghrib: {day.timings.Maghrib}</Text>
            <Text>Isha: {day.timings.Isha}</Text>
          </View>
        ))}
      </View>
    </ImageBackground>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Azan Calendar" component={AzanCalendarScreen} />
    </Tab.Navigator>
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  prayerDay: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});

export default App;
