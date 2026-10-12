import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius:123,
        borderColor: '#000',
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
    },
    subtext:{
        marginTop:10,
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
    },
    button:{
        padding: 10,
        borderRadius: 100,
        width:57,
        backgroundColor:"#757575",
        justifyContent: 'center',
        alignItems: 'center',
        
    }
}); 
const DailyPhase = ({phase}) => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Looks like your in your {phase} phase</Text>
            <Text style={styles.subtext}>Find out what that means for today</Text>
            <Pressable style={styles.button} onPress={()=> router.push('/insights')}>
                <Image source={require('@/assets/images/tabIcons/Insights-page.png')} style={{ width: 33, height: 33 }} resizeMode="contain" />
            </Pressable>
        </View>
    );
}
export default DailyPhase;