import React, {useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function Explore() {
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Calendar</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#50cebb', selectedTextColor: 'white' }

        }}
        theme={{
          todayTextColor: '#50cebb',
          backgroundColor: '#f0f0f0',
          calendarBackground: '#f0f0f0',
          textSectionTitleColor: '#50cebb',
          selectedDayBackgroundColor: '#50cebb',
          selectedDayTextColor: 'white',
          dayTextColor: '#000000',
          arrowColor: '#50cebb',
        }}
      />
      {selectedDate ? (<Text style={styles.dateText}> Selected Date:{selectedDate}</Text>) : null}
      <Text>Selected Date: {selectedDate}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    marginTop: 20,
  },
});