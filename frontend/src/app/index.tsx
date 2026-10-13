import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import DailyPhase from '@/components/Daily-phase';

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<string | null>(null);

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