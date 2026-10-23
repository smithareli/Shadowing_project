import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import DailyPhase from '@/components/Daily-phase';
import TaskUI from '@/components/task_ui';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<string | null>(null);
  const tasks = [
    { taskId: '1', title: 'Task 1', description: 'Description 1', startTime: '09:00 AM', endTime: '10:00 AM' },
    { taskId: '2', title: 'Task 2', description: 'Description 2', startTime: '10:30 AM', endTime: '11:30 AM' },
    { taskId: '3', title: 'Task 3', description: 'Description 3', startTime: '01:00 PM', endTime: '02:00 PM' },
  ];
  useEffect(() => {
    const backendUrl = 'https://shadowing-project.onrender.com';

    fetch(backendUrl)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Backend request failed with HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json: { phase?: unknown }) => {
        if (typeof json.phase !== 'string' || json.phase.trim().length === 0) {
          throw new Error('Backend response must contain a non-empty phase string.');
        }
        setPhase(json.phase);
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
    },
    code: {
        textTransform: 'uppercase',
        color: '#000',
    },
});