import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

const styles = StyleSheet.create({
    section:{
        height: 298,
        width: '100%',
        borderRadius:25,
        backgroundColor: Colors.light.phaseBoxBackground,
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    container: {
        padding: 20,
        borderRadius:123,
        borderColor: Colors.light.insightButtonTextDefault,
        borderWidth: 15,
        height:246,
        width:246,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 15,
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        color: Colors.light.headerText,
    },
    subtext:{
        marginTop:10,
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
        color: Colors.light.headerText,
    },
    button:{
        padding: 10,
        borderRadius: 100,
        width:57,
        backgroundColor: Colors.light.insightButtonDefault,
        justifyContent: 'center',
        alignItems: 'center',
        
    }
}); 
const DailyPhase = ({phase}) => {
    const router = useRouter();
    return (
        <View style={styles.section}>
        <View style={styles.container}>
            <Text style={styles.text}>Looks like your in your {phase}</Text>
            <Text style={styles.subtext}>Find out what that means for today</Text>
            <Pressable style={styles.button} onPress={()=> router.push('/insights')}>
                <Image source={require('@/assets/images/tabIcons/Insights-page.png')} style={{ width: 33, height: 33 }} resizeMode="contain" />
            </Pressable>
        </View>
        </View>
    );
}
export default DailyPhase;