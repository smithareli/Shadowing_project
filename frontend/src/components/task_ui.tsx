import React, {useState, useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from "./themed-view";
import { useAuth } from "@/lib/auth-context";
function formatTime(value?: string): string {
  if (!value) return '';
  let d = new Date(value);

  // fallback for time-only strings like "13:00:00"
  if (isNaN(d.getTime()) && /^\d{1,2}:\d{2}/.test(value)) {
    const [h, m] = value.split(':').map(Number);
    d = new Date();
    d.setHours(h, m, 0, 0);
  }
  if (isNaN(d.getTime())) return '';

  return d
    .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    .replace(' ', '')       
    .toLowerCase();         
}

function formatTimeRange(start?: string, end?: string): string {
  const s = formatTime(start);
  const e = formatTime(end);
  if (s && e) return `${s} - ${e}`;
  return s || e;
}
type TaskProps = {
    taskId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    done?:boolean;
    backendUrl:string;
};
export default function TaskUI({ taskId, title, description, startTime, endTime, done=false, backendUrl }: TaskProps) {
   
    const [isEnabled, setIsEnabled] = useState(done);
    const {userId}= useAuth();
    useEffect(() => setIsEnabled(done), [done]);

    const handleClicked = async() =>{
        if (!userId) return Alert.alert("Error", "You need to be signed in.");
        const next= !isEnabled;
        setIsEnabled(next);
        try {
            const response = await fetch(`${backendUrl}/mark-done`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-User-id": userId },
            body: JSON.stringify({id: Number(taskId), done:next}),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            } catch (error) {
                console.error("Error submitting task:", error);
                setIsEnabled(!next);
                Alert.alert("Error", "Failed to submit task. Please try again.");
            } 
        };
    

    
    return (
        <View style={styles.taskContainer}>
            <View style={styles.taskitem}>
            <TouchableOpacity 
                style={styles.radioContainer} 
                onPress={() => handleClicked()}
                activeOpacity={0.8}
                accessible={true}
                accessibilityRole="radio"
                accessibilityState={{ checked: isEnabled }}
            >
                {/* Outer Circle */}
                <View style={[styles.outerCircle, isEnabled && styles.outerCircleSelected]}>
                {/* Inner Circle (Visible only when selected) */}
                {isEnabled && <View style={styles.innerCircle} />}
                </View>
            </TouchableOpacity>
            <View style={styles.rows}>
                <Text style={styles.taskTitle}>{title}</Text>
                <Text style={styles.taskTime}>{formatTimeRange(startTime, endTime)}</Text>
            </View>            
        </View>
        <ThemedView style={styles.divider} />
        </View>
    );
}
const styles = StyleSheet.create({
    taskContainer: {
        paddingTop: 15,
        paddingHorizontal:10,
        verticalAlign: "middle",
        //borderBottomWidth: 1,
        //borderBottomColor: "#ccc",
        //flexDirection: "row",
        backgroundColor: Colors.light.taskitemBackground,
        
        
    },
    taskitem:{
        flexDirection:"row",
        paddingBottom:5,
    },
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    outerCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.light.taskListText,
        justifyContent: "center",
        alignItems: "center",
    },
    outerCircleSelected: {
        borderColor: Colors.light.taskListText,
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.light.taskListText,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    taskTime: {
        fontSize: 14,
        color: "#666",
    },
    rows: {
        flexDirection: "column",
        marginLeft: 10,
        
    },
    divider:{
      height: 2,
      width:'80%',
      backgroundColor: Colors.light.tabIconDefault,
      marginVertical: 10,
      alignSelf:"center",
      padding:0,
    },
});
