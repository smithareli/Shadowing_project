import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import AppTabs from '@/components/app-tabs';
import { ThemedText } from '@/components/themed-text';
import { authClient } from '@/lib/neon-auth';

export default function TabsLayout() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    authClient.getSession()
      .then(({ data, error: sessionError }) => {
        if (!isCurrent) return;
        if (sessionError) {
          setError(sessionError.message ?? 'Unable to verify your session.');
          return;
        }
        if (!data?.user) {
          router.replace('/');
          return;
        }
        setIsAuthenticated(true);
      })
      .catch((cause: unknown) => {
        if (isCurrent) {
          setError(cause instanceof Error ? cause.message : 'Unable to verify your session.');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [router]);

  if (error) {
    return (
      <View style={styles.message}>
        <ThemedText accessibilityRole="alert">{error}</ThemedText>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator accessibilityLabel="Checking your session" />
      </View>
    );
  }

  return <AppTabs />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});
