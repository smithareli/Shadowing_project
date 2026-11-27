import React from 'react';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import {useAuth} from '@/lib/auth-context';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';


type Recommendation = {
  reccomendationid: string;
  taskid: string;
  reason: string;
  startdate:string;
  enddate:string;
  startTime: string;
  endTime: string;
  status: string;
};
export default function InsightsScreen() {
    const scheme = useColorScheme() ?? 'light';
    const theme = Colors[scheme];
      const [phase, setPhase] = useState<string | null>(null);
      const [recs, setRecs] = useState<Recommendation[]>([]);
      const [symptoms, setSymptoms] = useState<string[]>([]);
      const [tips, setTips] = useState<string[]>([]);
      const [loading, setLoading] = useState(true);
      const { userId } = useAuth();
      useEffect(() => {
        const backendUrl = 'https://shadowing-project.onrender.com';
        if(!userId){
        return;
        }

        fetch(backendUrl, {headers:{ 'X-User-Id': userId!},})
        .then((response: Response) => {
            if (!response.ok) {
            throw new Error(`Backend request failed with HTTP ${response.status}`);
            }
            return response.json();
        })
        .then((json: { phase?: unknown , recommendations?: Recommendation[], symptoms?:string[], tips?: string[] }) => {
            if (typeof json.phase !== 'string' || json.phase.trim().length === 0) {
            throw new Error('Backend response must contain a non-empty phase string.');
            }
            setPhase(json.phase);
            if (Array.isArray(json.recommendations)) {
            setRecs(
                json.recommendations.map((recommendation: any) => ({
                reccomendationid: String(recommendation.id),
                taskid: String(recommendation.task_id),
                reason: recommendation.reason ?? '',
                startdate: recommendation.start_date ?? '',
                enddate: recommendation.end_date ?? '',
                startTime: recommendation.start_time ?? '',
                endTime: recommendation.end_time ?? '',
                status: recommendation.status,
                }))
            );
            }
            if (Array.isArray(json.symptoms)) {
            setSymptoms(json.symptoms.map((symptom: string) => String(symptom)));
            }
            if (Array.isArray(json.tips)) {
            setTips(json.tips.map((tip: string) => String(tip)));
            }
            setLoading(false);
        })
        .catch((error: unknown) => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
    }, [userId]);

    if (loading) {
        return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={theme.background} />
        </View>
        );
    }
      

    
    return (
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
                 <ThemedView style={styles.title_container}>
                   <ThemedText type="title" style={[styles.title, { color: theme.headerText }]}>
                     {"Weekly's Insights"}
                   
                   </ThemedText>
                   <ThemedView style={styles.divider} />
                   <ThemedText type="code" style={[styles.code, { color: theme.headerText }]}>
                    Your in your {phase} phase, so today you may feel:
                   </ThemedText>
                 </ThemedView>
                 <ThemedView style= {styles.symptomRows}>
                    {symptoms.map((symptom, index)=>(
                        <ThemedView key={index} style={styles.symptomContainers}>
                            <Text style={{ color: Colors.light.insightButtonTextDefault, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
                            {symptom}
                            </Text>
                        </ThemedView>
                        ))}
                 </ThemedView>
                <Text style={styles.subheading}>
                    Recommendations
                </Text>
                <Text style={styles.subheading}>
                    Tips
                </Text>
                <ThemedView style={styles.divider} />
                <ThemedView style= {styles.tipRows}>
                    {tips.map((tip, index)=>(
                        <ThemedView key={index} style={styles.tipContainers}>
                            <Text style={styles.tipText}>
                            {tip}
                            </Text>
                        </ThemedView>
                    ))}
                </ThemedView>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 20,
        
    },
    screen: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingHorizontal: 12,
      paddingTop: 100,
    },
    title_container: {
      display:'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
      gap:'16px',
      paddingTop: 60,
      paddingBottom: 20,
      
    },
    title: {
        //textAlign: 'center',
        fontSize: 24,
        padding:0,
        lineHeight: 25,
    },
    code: {
        textTransform: 'uppercase',
        fontSize: 16,
    },
    divider:{
      height: 3,
      width:'50%',
      backgroundColor: Colors.light.divider,
      marginVertical: 10,
    },
    symptomRows:{
        flexDirection:'row',
        width:'80%',
        justifyContent:'space-between',
    },
    symptomContainers:{
        flex:1,
        padding:10,
        borderRadius:100,
        backgroundColor:Colors.light.popupBackground,
        justifyContent:'center',
        alignContent:'center'
    },
    tipRows:{
        flexDirection:'row',
        flexWrap:'wrap',
        display:'flex',
        width:'80%',
        padding:20,
    },
    tipContainers:{
        flex:1,
        padding:10,
        borderRadius:10,
        backgroundColor:Colors.light.phaseBoxBackground,
        justifyContent:'center',
        alignContent:'center',
        width:131,
        height:112,
    },
    tipText:{
        fontSize:16,
        color:"#FFFFFF",
        textAlign:'center',
        textOverflow:'wrap',
    },
    subheading:{
        fontSize:20,
        color:Colors.light.insightButtonTextDefault,
        fontWeight:'bold',
        textAlign:'left',
        padding: 20,
    }
});