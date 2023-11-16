import React, { useState, useEffect, useCallback } from "react";
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


// TODO: изменить код так, чтобы запрос счетчика не делался, если отсчет идет.


const HomeScreen = () => {
  const [nextPrayer, setNextPrayer] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetchPrayerTimes(); // Запускаем запрос при загрузке компонента
  }, []);

  const validPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  // Функция для запроса времен молитв
  const fetchPrayerTimes = useCallback(async () => {
    try {
      const today = new Date();
      const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const latitude = 36.5451; // Замените на вашу широту
      const longitude = 31.9974; // Замените на вашу долготу

      const response = await fetch(`https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${latitude}&longitude=${longitude}&method=2`);
      const data = await response.json();
      const prayerTimes = data.data.timings;

      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nextPrayer = validPrayers.find(prayer => prayerTimes[prayer] > currentTime);

      if (nextPrayer) {
        const nextPrayerTime = prayerTimes[nextPrayer];
        setNextPrayer(nextPrayer);
        startCountdown(nextPrayerTime);
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  }, []);

  const startCountdown = (prayerTime) => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':');
    const prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const timeDiff = prayerDate - now;
    setCountdown(timeDiff > 0 ? Math.floor(timeDiff / 1000) : 0);

    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0));
    }, 1000);

    // Остановка интервала и новый запрос после завершения обратного отсчета
    setTimeout(() => {
      clearInterval(countdownInterval);
      fetchPrayerTimes(); // Запускаем новый запрос
    }, timeDiff);

    return () => clearInterval(countdownInterval);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  return (
    <ImageBackground
      source={require('./assets/testphotos/background.jpg')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.countdownText}>{formatTime(countdown)} before {nextPrayer}</Text>
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
