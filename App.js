import React, { useState, useEffect, useCallback } from "react";
import {ImageBackground, StyleSheet, Text, View, ScrollView, SafeAreaView} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Table, Row, Rows } from 'react-native-table-component';

// TODO: Get gps position from user to replace variable putted into api

const getUserLocationByIP = async () => {
  try {
    const response = await fetch('http://ip-api.com/json');
    const data = await response.json();

    if (data.status === 'success') {
      const { city, country, lat, lon } = data;
      console.log('City:', city);
      console.log('Country:', country);
      console.log('Latitude:', lat);
      console.log('Longitude:', lon);

      return { city, country, latitude: lat, longitude: lon };
    } else {
      console.log('Location data not available');
      return { city: 'Antalya', country: 'Turkey', latitude: '36.884804', longitude: '30.704044' };
    }
  } catch (error) {
    console.error('Error:', error);
    return { city: '', country: '', latitude: '', longitude: '' };
  }
};


const HomeScreen = () => {
  const [nextPrayer, setNextPrayer] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const validPrayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const fetchPrayerTimes = useCallback(async () => {
    try {
      const today = new Date();
      const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      const locationData = await getUserLocationByIP();
      const { latitude, longitude } = locationData;

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


    if (timeDiff > 0) {
      setCountdown(timeDiff);

      const countdownInterval = setInterval(() => {
        setCountdown(prevCountdown => (prevCountdown > 0 ? prevCountdown - 1000 : 0));
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        fetchPrayerTimes();
      }, timeDiff);

      return () => clearInterval(countdownInterval);
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
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

const AzanCalendarScreen = () => {
  const [prayerTimesData, setPrayerTimesData] = useState([]);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthName = monthNames[month - 1]

  useEffect(() => {
  const fetchPrayerTimes = async () => {
    try {
      const locationData = await getUserLocationByIP();
      const { city, country } = locationData;
      const response = await fetch(
        `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${city}&country=${country}&method=2`
      );
      const data = await response.json();
      const prayerData = data.data;

      setPrayerTimesData(prayerData);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  fetchPrayerTimes();
}, [year, month]);

  const formatPrayerData = () => {
    const formattedData = prayerTimesData.map(day => {
      const formattedDay = [];
      const dateArray = day.date.readable.split(' ');
      const dateNumber = dateArray[0];

      formattedDay.push(dateNumber);

      const removeTimezone = time => {
        const timeWithoutTimezone = time.split(" ")[0];
        return timeWithoutTimezone;
      };

      formattedDay.push(removeTimezone(day.timings.Fajr));
      formattedDay.push(removeTimezone(day.timings.Dhuhr));
      formattedDay.push(removeTimezone(day.timings.Asr));
      formattedDay.push(removeTimezone(day.timings.Maghrib));
      formattedDay.push(removeTimezone(day.timings.Isha));
      return formattedDay;
    });
    return formattedData;
};

  const tableHead = ["Date", "Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
      <SafeAreaView style={styles.tableContainer}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.screenText}>{currentMonthName} {year}</Text>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.head} />
            <Rows data={formatPrayerData()} textStyle={styles.text} />
          </Table>
        </ScrollView>
      </SafeAreaView>
  );
};

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
        <Tab.Screen name="Counter" component={HomeScreen} />
        <Tab.Screen name="Calendar" component={AzanCalendarScreen} />
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
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  tableContainer: { flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff'
  },
  head: {
    height: 20,
    paddingTop: 1,
    backgroundColor: '#dedede',
    fontWeight: 600,
    textAlign: 'center'
  },
  text: {
    margin: 2,
    textAlign: 'center',
  },
  screenText: {
    fontSize: 24,
    fontWeight: '400',
    color: 'black',
    textAlign: 'center',
    marginBottom: 15,
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
