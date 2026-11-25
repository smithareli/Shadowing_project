import React from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet } from 'react-native';
export default function InsightsScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.title_container}>
                <ThemedText type="title" style={styles.title}>
                    Insights
                </ThemedText>
                <ThemedText type="code" style={styles.code}>
                    Here are your insights.
                </ThemedText>
            </ThemedView>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
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