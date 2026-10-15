import React, {useEffect, useState} from 'react';
import { StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {toMarkedDates, toDraftMarkedDates} from "../components/ranged-dates";
import { useCycleEdit, Cycle } from '../components/edit_cycle';
import EditCycleUI from '../components/edit_cycle_ui';
const BACKEND_URL = 'https://shadowing-project.onrender.com';
export default function Explore() {
  const [selectedDate, setSelectedDate] = useState('');
  const[loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const {editMode, draft, isSaving, startEditing, toggleDay, cancel, save} = useCycleEdit(cycles, BACKEND_URL, setCycles);
  useEffect(() => {
    const fetchJson = (url: string) => (globalThis as any).fetch(url);

    fetchJson(BACKEND_URL)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Backend request failed with HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json: { cycles?: { start_date: string; end_date: string }[] }) => {
        if (!Array.isArray(json.cycles)) {
          throw new Error('Backend response must contain a cycles array.');
        }
        setCycles(json.cycles);
      })
      .catch((error: unknown) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      })
      .finally(() => {
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
  const markedDates = editMode 
  ? toDraftMarkedDates(draft)
  :{
    ...toMarkedDates(cycles),
    ...(selectedDate ? { [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#50cebb', selectedTextColor: 'white' } } : {}),

  };

   return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.header}>Calendar</Text>
        <Calendar
          firstDay={1}
          onDayPress={(day) =>
            editMode ? toggleDay(day.dateString) : setSelectedDate(day.dateString)
          }
          markedDates={markedDates}
          theme={{
            todayTextColor: '#50cebb',
            backgroundColor: '#f0f0f0',
            calendarBackground: '#f0f0f0',
            textSectionTitleColor: '#000000',
            dayTextColor: '#000000',
            arrowColor: '#000000',
          }}
        />
        {!editMode && selectedDate ? (
          <Text style={styles.dateText}>Selected Date: {selectedDate}</Text>
        ) : null}
      </View>

      <EditCycleUI
        editMode={editMode}
        saving={isSaving}
        onEdit={startEditing}
        onSave={save}
        onCancel={cancel}
      />
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