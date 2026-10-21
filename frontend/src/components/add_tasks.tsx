import React, { useState } from "react";
import {Modal, View, Text, TextInput, Pressable, StyleSheet, Image, Platform, Alert} from "react-native";
import {useEffect} from "react";
import {ActivityIndicator} from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
type Props = {
    visible:boolean;
    onClose:()=>void;
    onSubmit: (data: any)=> void;
    initialData?: any;
};
export default function AddTaskModal({visible, onClose, onSubmit, initialData}: Props) {
    //figure out how handle timezones later
    const [taskData, setTaskData] = useState(initialData || { title: "", description: "", startTime: "", endTime: "" , date: ""});
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        setTaskData(initialData || { title: "", description: "", startTime: "", endTime: "" , date: ""});
    }, [initialData]);
    const handleSubmit =() => {
        if(!taskData.title || !taskData.description || !taskData.startTime || !taskData.endTime || !taskData.date){
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        setIsSubmitting(true);
        onSubmit(taskData);
        setIsSubmitting(false);
        onClose();
    };
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback onPress={Platform.OS === "web"? undefined: Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <Text>Add Task</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={taskData.title}
                            onChangeText={(text) => setTaskData({...taskData, title: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date"
                            value={taskData.date}
                            onChangeText={(text) => setTaskData({...taskData, date: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Start Time"
                            value={taskData.startTime}
                            onChangeText={(text) => setTaskData({...taskData, startTime: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="End Time"
                            value={taskData.endTime}
                            onChangeText={(text) => setTaskData({...taskData, endTime: text})}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={taskData.description}
                            onChangeText={(text) => setTaskData({...taskData, description: text})}
                        />
                        <Pressable style={styles.promptButton}onPress={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <ActivityIndicator />
                            ) : (
                                <Text>Submit</Text>
                            )}
                        </Pressable>
                        <Pressable style={styles.promptButton} onPress={onClose}>
                            <Text>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
        },
        loadingOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            },

        promptButton: {
            width: 45,
            height: 45,
            borderRadius: 8,
            backgroundColor: "#EDEDED",
            justifyContent: "center",
            alignItems: "center",
            },

        row: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8, // optional, RN 0.71+
            },

        popup: {
            width: Platform.OS === "web" ? 500 : "85%",
            height: Platform.OS === "web" ? "auto" : "70%",
            maxHeight: "90%",
            padding: 20,
            backgroundColor: "white",
            borderRadius: 12,
        },

        entryBox: {
            flex: 1,
            minHeight: 120,
            textAlignVertical: "top",
            paddingTop: 10,
        },

        header: {
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 12,
        },
        input: {
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
        },
        imagePicker: {
            height: 100,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
        },
        imagePreview: {
            width: "100%",
            height: "100%",
            borderRadius: 8,
        },
        statusRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
        },
        statusButton: {
            padding: 10,
            borderWidth: 1,
            borderColor: "#aaa",
            borderRadius: 8,
            width: "48%",
            alignItems: "center",
        },
        activeStatus: {
            backgroundColor: "#d0f0d0",
            borderColor: "#6bbf6b",
        },
        submitButton: {
            backgroundColor: "#F4A896",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 8,
        },
        submitText: {
            color: "white",
            fontWeight: "600",
        },
        cancelText: {
            textAlign: "center",
            color: "black",
        },
        });
