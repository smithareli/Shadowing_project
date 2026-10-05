import React, {use,useEffect, useState} from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import getMarkedRange from "../components/ranged-dates";

export default function Explore() {
  const [selectedDate, setSelectedDate] = useState('');
  const[loading, setLoading] = useState(true);
  const [specialDates, setSpecialDates] = useState({});
  useEffect(() => {
    const backendUrl = 'https://shadowing-project.onrender.com';
    const fetchJson = (url: string) => (globalThis as any).fetch(url);

    fetchJson(backendUrl)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Backend request failed with HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json: { dates?: { start_date: string; end_date: string }[] }) => {
        if (!Array.isArray(json.dates)) {
          throw new Error('Backend response must contain a dates array.');
        }
        const markedRanges = json.dates.reduce(
          (marked: Record<string, unknown>, range: { start_date: string; end_date: string }) => ({
            ...marked,
            ...getMarkedRange(range.start_date, range.end_date, '#D662B7'),
          }),
          {},
        );
        setSpecialDates(markedRanges);
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.header}>Calendar</Text>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            ...specialDates,
            [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#50cebb', selectedTextColor: 'white' }
          }}
          theme={{
            todayTextColor: '#50cebb',
            backgroundColor: '#f0f0f0',
            calendarBackground: '#f0f0f0',
            textSectionTitleColor: '#000000',
            selectedDayBackgroundColor: '#50cebb',
            selectedDayTextColor: 'white',
            dayTextColor: '#000000',
            arrowColor: '#000000',
          }}
        />
        {selectedDate ? (<Text style={styles.dateText}> Selected Date:{selectedDate}</Text>) : null}
        <Text>Selected Date: {selectedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 100,
  },
  container: {
    width: '90%',
    maxWidth: 420,
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingVertical: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderRadius: 8,
  },
  header: {
    width: '100%',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'normal',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 18,
    marginTop: 20,
  },
});