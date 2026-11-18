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

type AuthUser = {
    email: string;
    name: string;
};

type AuthSession = NonNullable<Awaited<ReturnType<typeof authClient.getSession>>['data']>['session'];

export default function ProfileScreen() {
    const router = useRouter();
    const [session, setSession] = useState<AuthSession | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        authClient.getSession().then((result) => {
        if (result.data?.session && result.data?.user) {
            setSession(result.data.session);
            setUser(result.data.user);
            router.replace('/home');
        }
        setIsLoading(false);
        });
    }, []);

    const handleSubmit = async () => {
        const appDeepLink= Linking.createURL("/home");
        const renderCallbackUrl='http://onrender.com{encodeURIComponent(appDeepLink)}';
        const result = isSignUp
        ? await authClient.signUp.email({ name: email.split('@')[0] || 'User', email, password, callbackURL: renderCallbackUrl})
        : await authClient.signIn.email({ email, password, callbackURL: renderCallbackUrl});
        if (result.error) {
        alert(result.error.message);
        return;
        }
        const sessionResult = await authClient.getSession();
        if (sessionResult.data?.session && sessionResult.data?.user) {
        setSession(sessionResult.data.session);
        setUser(sessionResult.data.user);
        }
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        setSession(null);
        setUser(null);
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.card}>
                <ThemedText type="title" style={styles.title}>
                    Profile
                </ThemedText>

                {isLoading ? (
                    <ActivityIndicator accessibilityLabel="Loading profile" />
                ) : user ? (
                    <View style={styles.content}>
                        <ThemedText type="subtitle" style={styles.heading}>
                            You're signed in
                        </ThemedText>
                        <ThemedText style={styles.userName}>{user.name}</ThemedText>
                        <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                        <Pressable
                            accessibilityRole="button"
                            disabled={isSubmitting}
                            onPress={handleSignOut}
                            style={[styles.button, isSubmitting && styles.buttonDisabled]}>
                            <ThemedText style={styles.buttonText}>
                                {isSubmitting ? 'Signing out...' : 'Sign out'}
                            </ThemedText>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.content}>
                        <ThemedText type="subtitle" style={styles.heading}>
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </ThemedText>
                        <ThemedText style={styles.description}>
                            {isSignUp ? 'Sign up with your email and a password.' : 'Sign in with your email and password.'}
                        </ThemedText>
                        <TextInput
                            accessibilityLabel="Email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            onChangeText={setEmail}
                            placeholder="Email"
                            style={styles.input}
                            value={email}
                        />
                        <TextInput
                            accessibilityLabel="Password"
                            autoCapitalize="none"
                            autoComplete={isSignUp ? 'new-password' : 'current-password'}
                            onChangeText={setPassword}
                            placeholder="Password"
                            secureTextEntry
                            style={styles.input}
                            value={password}
                        />
                        {error ? (
                            <ThemedText accessibilityRole="alert" style={styles.error}>
                                {error}
                            </ThemedText>
                        ) : null}
                        <Pressable
                            accessibilityRole="button"
                            disabled={isSubmitting || !email.trim() || !password}
                            onPress={handleSubmit}
                            style={[
                                styles.button,
                                (isSubmitting || !email.trim() || !password) && styles.buttonDisabled,
                            ]}>
                            <ThemedText style={styles.buttonText}>
                                {isSubmitting ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
                            </ThemedText>
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            disabled={isSubmitting}
                            onPress={() => {
                                setError(null);
                                setIsSignUp(!isSignUp);
                            }}
                            style={styles.toggleButton}>
                            <ThemedText style={styles.toggleText}>
                                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                            </ThemedText>
                        </Pressable>
                    </View>
                )}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#f0f0f0',
    },
    card: {
        alignSelf: 'center',
        width: '100%',
        maxWidth: 440,
        padding: 28,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        gap: 20,
    },
    title: {
        fontSize: 36,
        lineHeight: 42,
        color: '#000000',
    },
    content: {
        gap: 16,
    },
    heading: {
        fontSize: 24,
        lineHeight: 30,
        color: '#000000',
    },
    description: {
        color: '#444444',
    },
    input: {
        minHeight: 48,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#c7c7c7',
        borderRadius: 10,
        color: '#000000',
        backgroundColor: '#ffffff',
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
    toggleButton: {
        alignItems: 'center',
        paddingVertical: 6,
    },
    toggleText: {
        color: '#176ac3',
    },
    error: {
        color: '#b42318',
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    userEmail: {
        color: '#444444',
    },
});
