import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    TextInput,
    View,
    Text,
} from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {useAuth} from '@/lib/auth-context';
import { Colors } from '@/constants/theme';
import { MaterialCommunityIcons} from '@expo/vector-icons';


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
            </ThemedView>
            <ThemedView style ={styles.header_container}>
                <ThemedText type="title" style={styles.header}>
                    Areli Smith 
                </ThemedText>
                <Text style={styles.code}>
                    areli.m.s.365@gmail.com
                </Text>
            </ThemedView>
            <ThemedView style = {styles.editing_container}>
                <Pressable
                    //onPress={}
                    style={[styles.item_container]}>
                    <ThemedView style={styles.leftaligned}>
                        <MaterialCommunityIcons
                            name="account-edit"
                            size={20}
                            color={Colors.light.addtaskbuttoniconDefault}
                        />
                        <Text style= {styles.item_text}>
                            Edit Profile Name
                        </Text>
                    </ThemedView>
                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={20}
                        color={Colors.light.headerText}
                    />
                </Pressable>
                <ThemedView style={styles.divider} />
                <Pressable
                    //onPress={}
                    style={[styles.item_container]}>
                    <ThemedView style={styles.leftaligned}>

                    <MaterialCommunityIcons
                        name= "table-edit"
                        size={20}
                        color={Colors.light.addtaskbuttoniconDefault}
                    />
                    <Text style= {styles.item_text}>
                        Edit Focus Goals
                    </Text>
                    </ThemedView>
                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={20}
                        color={Colors.light.headerText}
                    />
                </Pressable>
                <ThemedView style={styles.divider} />
                <Pressable
                    //onPress={}
                    style={[styles.item_container]}>
                    <ThemedView style={styles.leftaligned}>

                    <MaterialCommunityIcons
                        name="lock"
                        size={20}
                        color={Colors.light.addtaskbuttoniconDefault}
                    />
                    <Text style= {styles.item_text}>
                        Change Password
                    </Text>
                    </ThemedView>
                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={20}
                        color={Colors.light.headerText}
                    />
                </Pressable>
                <ThemedView style={styles.divider} />
                <Pressable
                    //onPress={}
                    style={[styles.item_container]}>
                    <ThemedView style={styles.leftaligned}>
                    <MaterialCommunityIcons
                        name="email"
                        size={20}
                        color={Colors.light.addtaskbuttoniconDefault}
                    />
                    <Text style= {styles.item_text}>
                        Change Email Address
                    </Text>
                    </ThemedView>
                    <MaterialCommunityIcons
                        name="arrow-right"
                        size={20}
                        color={Colors.light.headerText}
                    />
                </Pressable>
                <ThemedView style={styles.divider} />

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
        justifyContent: 'flex-start',
        //flexDirection: 'row',
        alignItems: 'center',
        //paddingVertical: 20,
        gap:20,
        backgroundColor: Colors.light.background,
    },
    title_container: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 60,
        verticalAlign: 'top',
        //flex: 1,
    },
    title: {
        textAlign: 'center',
        fontSize:24,
        color: Colors.light.headerText,
    },
    header_container:{
        justifyContent: 'center',
        alignItems: 'center',
        padding:20,
        backgroundColor: Colors.light.phaseBoxBackground,
        width:'100%'

    },
    header:{
        textAlign:'center',
        fontSize: 36,
        color: Colors.light.headerText,

    },
    code: {
        textAlign:'center',
        color: Colors.light.headerText,
    }, 
    button: {
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        padding:10,
        backgroundColor: Colors.light.addtaskbuttoniconDefault,
    },
    buttonDisabled: {
        opacity: 0.55,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '700',
    },
    editing_container:{
        justifyContent: 'center',
        width:'80%',
        //flexDirection:'row',
        alignItems: 'center',
        backgroundColor: Colors.light.taskListBackground,
        borderRadius:10,
        padding:10,
    },
    item_container:{
        justifyContent:"space-between",
        alignItems:"center",
        flexDirection:'row',
        width:'100%',
        padding: 15,
    },
    item_text:{
       fontSize:14,
       textAlign: 'left',
       color: Colors.light.taskListText,

    },
    divider:{
          height: 3,
          width:'100%',
          backgroundColor: Colors.light.profileDivider,
          marginVertical: 10,
        },
    leftaligned:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: Colors.light.taskListBackground,
        gap:20,
    }
});