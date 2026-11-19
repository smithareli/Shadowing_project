import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {useAuth} from '@/lib/auth-context';

type AuthUser = {
    email: string;
    name: string;
};

type AuthSession = NonNullable<Awaited<ReturnType<typeof authClient.getSession>>['data']>['session'];


export default function InsightsScreen() {
    const {refresh}= useAuth();
    const [session, setSession] = useState<AuthSession | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignOut = async () => {
            await authClient.signOut();
            setSession(null);
            setUser(null);
            await refresh();
        };
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.title_container}>
                <ThemedText type="title" style={styles.title}>
                    Profile
                </ThemedText>
                <ThemedText type="code" style={styles.code}>
                    Here are your insights.
                </ThemedText>
                <Pressable
                    accessibilityRole="button"
                    disabled={isSubmitting}
                    onPress={handleSignOut}
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}>
                    <ThemedText style={styles.buttonText}>
                        {isSubmitting ? 'Signing out...' : 'Sign out'}
                    </ThemedText>
                </Pressable>
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
    button: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#208aeF',
    },
    buttonDisabled: {
        opacity: 0.55,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '700',
    },
});