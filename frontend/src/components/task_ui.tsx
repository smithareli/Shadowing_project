import React from "react";
import { Switch, View, Text, StyleSheet } from "react-native";
type TaskProps = {
    taskId: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
};
export default function TaskUI({ taskId, title, description, startTime, endTime }: TaskProps) {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <View style={styles.taskContainer}>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd9d" : "#f4f3f4"}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
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
