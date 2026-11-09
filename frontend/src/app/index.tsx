import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import DailyPhase from '@/components/Daily-phase';
import TaskUI from '@/components/task_ui';
type Task = {
  taskId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
};

type CalendarEvent = {
  id: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [phase, setPhase] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadGoogleCalendarEvents = async () => {
    setCalendarLoading(true);
    try {
      const response = await fetch('https://shadowing-project.onrender.com/google-calendar-events');
      if (!response.ok) {
        throw new Error(`Backend request failed with HTTP ${response.status}`);
      }

      const json: { events?: CalendarEvent[] } = await response.json();
      if (!Array.isArray(json.events)) {
        throw new Error('Backend response must contain an events array.');
      }
      /*
      setTasks(json.events.map((event) => ({
        taskId: event.id,
        title: event.summary ?? '(Untitled event)',
        description: event.description ?? '',
        startTime: event.start?.dateTime ?? event.start?.date ?? '',
        endTime: event.end?.dateTime ?? event.end?.date ?? '',
      })));
      */
    } catch (error: unknown) {
      console.error('Error fetching Google Calendar events:', error);
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    const backendUrl = 'https://shadowing-project.onrender.com';

    fetch(backendUrl)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Backend request failed with HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json: { phase?: unknown , tasks?: Task[] }) => {
        if (typeof json.phase !== 'string' || json.phase.trim().length === 0) {
          throw new Error('Backend response must contain a non-empty phase string.');
        }
        setPhase(json.phase);
        if (Array.isArray(json.tasks)) {
          setTasks(
            json.tasks.map((task: any) => ({
              taskId: String(task.id),
              title: task.name,
              description: task.description ?? '',
              startTime: task.start_time ?? '',
              endTime: task.end_time ?? '',
            }))
          );
        }
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
    <ThemedView style={styles.container}>
          <ThemedView style={styles.title_container}>
            <ThemedText type="title" style={styles.title}>
              Hello Areli Smith!
            </ThemedText>
            <ThemedText type="code" style={styles.code}>
              Here's today's schedule.
            </ThemedText>
          </ThemedView>
          {phase && <DailyPhase phase={phase} />}
          <ThemedView style={styles.tasks_container}>
            <ThemedView  style={styles.task_header}>
              <ThemedText type="title" style={styles.title}>
                Tasks
              </ThemedText>
              <ThemedView style={styles.button_container}>
              <Button
                title={calendarLoading ? 'Loading Calendar...' : 'Google Calendar'}
                color="#FDF4F2"     
                disabled={calendarLoading}
                onPress={loadGoogleCalendarEvents}
              />
              </ThemedView>
            </ThemedView>
          {tasks.map((task) => (
            <TaskUI
              key={task.taskId}
              taskId={task.taskId}
              title={task.title}
              description={task.description}
              startTime={task.startTime}
              endTime={task.endTime}
            />
          ))}
      </ThemedView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    screen: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: 12,
      paddingTop: 100,
    },
    title_container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 100,
    verticalAlign: 'top',
    flex: 1,
    backgroundColor: '#f0f0f0',
    },
    title: {
        textAlign: 'center',
        color: '#000',
        fontSize: 24,
    },
    code: {
        textTransform: 'uppercase',
        color: '#000',
        fontSize: 16,
    },
    tasks_container: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        width: '90%',
    },
    task_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor:"#FDF4F2",
    },
    button_container: {
        backgroundColor: '#1F092A',
        borderRadius: 5,
        padding: 5,
    },
});