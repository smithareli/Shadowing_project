import React, {useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
type TaskProps = {
    taskId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
};
export default function TaskUI({ taskId, title, description, startTime, endTime }: TaskProps) {
    const [isEnabled, setIsEnabled] = React.useState(false);
    return (
        <View style={styles.taskContainer}>
            <TouchableOpacity 
                style={styles.radioContainer} 
                onPress={() => setIsEnabled(!isEnabled)}
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
                <Text style={styles.taskTime}>{startTime} - {endTime}</Text>
            </View>
        
        </View>
    );
}
const styles = StyleSheet.create({
    taskContainer: {
        padding: 10,
        verticalAlign: "middle",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        flexDirection: "row",
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
        borderColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
    },
    outerCircleSelected: {
        borderColor: "#007AFF",
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#007AFF",
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
});
