import React, { useState } from "react";
import {Modal, View, Text, TextInput, Pressable, StyleSheet, Image, Platform, Alert} from "react-native";
import {useEffect} from "react";
import {ActivityIndicator} from "react-native";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from "@/lib/auth-context";

type Props = {
    visible:boolean;
    onClose:()=>void;
    onSubmit: (data: any)=> void;
    backendUrl:string;
    initialData?: any;
};
type PickerField = "start_date" | "end_date" | null;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

function toTimestamp(date: string, time: string): string | null {
  if (!DATE_RE.test(date) || !TIME_RE.test(time)) return null;
  const [h, m] = time.split(":");
  const d = new Date(`${date}T${h.padStart(2, "0")}:${m}:00`); // parsed as device-local time
  if (isNaN(d.getTime())) return null;
  // reject rollovers like 2026-02-31
  const [y, mo, day] = date.split("-").map(Number);
  if (d.getFullYear() !== y || d.getMonth() + 1 !== mo || d.getDate() !== day) return null;
  return d.toISOString();
}
export default function AddTaskModal({visible,  onClose, onSubmit, backendUrl, initialData}: Props) {
    //figure out how handle timezones later
    const { userId }= useAuth();
    const [taskData, setTaskData] = useState(initialData || { title: "", description: "", startTime: "", endTime: "" , date: ""});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pad = (n: number) => String(n).padStart(2, "0");
    const toYMD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const [picker, setPicker] = useState<PickerField>(null);
    
    useEffect(() => {
        setTaskData(initialData || { title: "", description: "", startTime: "", endTime: "" , start_date: "", end_date: ""});
    }, [initialData]);
    const submit = async (data: any) => {
        if (!userId) return Alert.alert("Error", "You need to be signed in.");

        const title = data.title?.trim();
        const start = toTimestamp(data.start_date, data.startTime);
        const end = toTimestamp(data.end_date, data.endTime);

        if (!title) return Alert.alert("Error", "Please enter a title.");
        if (!start) return Alert.alert("Error", "Start date/time is invalid. Use YYYY-MM-DD and HH:MM (24-hour).");
        if (!end) return Alert.alert("Error", "End date/time is invalid. Use YYYY-MM-DD and HH:MM (24-hour).");
        if (new Date(end) < new Date(start)) return Alert.alert("Error", "End must be after the start.");

        const payload = {
            name: title,
            description: data.description?.trim() ?? "",
            location: data.location?.trim() || null,
            start_date: data.start_date,
            end_date: data.end_date,
            start_time: start,
            end_time: end,
        };

        setIsSubmitting(true);
        try {
            const response = await fetch(`${backendUrl}/add-task`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-User-id": userId },
            body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            onSubmit(await response.json());
            onClose();
        } catch (error) {
            console.error("Error submitting task:", error);
            Alert.alert("Error", "Failed to submit task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
        };
    const handleSubmit = () => {
        submit(taskData);
    };
    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <TouchableWithoutFeedback onPress={Platform.OS === "web"? undefined: Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <View style={styles.popup}>
                        <View style={styles.row}>
                            <Pressable style={styles.promptButton} onPress={onClose}>
                                <MaterialCommunityIcons
                                name="cancel"
                                size={30}
                                color={Colors.light.addtaskbuttoniconDefault}/>
                            </Pressable>
                            <Text> Add Task</Text>
                            <Pressable style={styles.promptButton} onPress={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text style={{ fontWeight: "bold" }}>Submit</Text>
                                )}
                            </Pressable>
                        </View>
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            value={taskData.title}
                            onChangeText={(text) => setTaskData({...taskData, title: text})}
                        />
                        <Text> Select Start Date</Text>
                        {Platform.OS === "web" ? (
                            <input
                                aria-label="Start date"
                                type="date"
                                value={taskData.start_date || ""}
                                onChange={(event) => setTaskData({ ...taskData, start_date: event.currentTarget.value })}
                                style={webDateInputStyle}
                            />
                        ) : (
                            <Pressable style={styles.input} onPress={() => setPicker("start_date")}>
                                <Text>{taskData.start_date || "Start date"}</Text>
                            </Pressable>
                        )}
                        {picker=="start_date" && (
                            <DateTimePicker
                                value={taskData[picker] ? new Date(`${taskData[picker]}T12:00:00`) : new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "compact" : "default"}
                                onChange={(event, selectedDate) => {
                                    if (event.type === "set" && selectedDate) {
                                        setTaskData({ ...taskData, [picker]: toYMD(selectedDate) });
                                    }
                                    setPicker(null);
                                }}
                            />
                        )}
                        <Text> Select End Date</Text>
                        {Platform.OS === "web" ? (
                            <input
                                aria-label="End date"
                                type="date"
                                value={taskData.end_date || ""}
                                onChange={(event) => setTaskData({ ...taskData, end_date: event.currentTarget.value })}
                                style={webDateInputStyle}
                            />
                        ) : (
                            <Pressable style={styles.input} onPress={() => setPicker("end_date")}>
                                <Text>{taskData.end_date || "End date"}</Text>
                            </Pressable>
                        )}
                        {picker=="end_date" && (
                            <DateTimePicker
                                value={taskData[picker] ? new Date(`${taskData[picker]}T12:00:00`) : new Date()}
                                mode="date"
                                display={Platform.OS === "ios" ? "compact" : "default"}
                                onChange={(event, selectedDate) => {
                                    if (event.type === "set" && selectedDate) {
                                        setTaskData({ ...taskData, [picker]: toYMD(selectedDate) });
                                    }
                                    setPicker(null);
                                }}
                            />
                        )}
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
                        
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
const webDateInputStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${Colors.light.addtaskbuttoniconDefault}`,
    backgroundColor: Colors.light.headerBackground,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    boxSizing: "border-box",
    color: Colors.light.taskListText,
};

const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: Colors.light.phaseBoxBackground,
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
            height: 45,
            borderRadius: 10,
            backgroundColor: Colors.light.popupBackground,
            justifyContent: "center",
            alignItems: "center",

            },

        row: {
            flexDirection: "row",
            alignItems: "center",
            //gap: 8, 
            justifyContent: "space-between",
            //paddingHorizontal:50,
            paddingBottom:50,
            },

        popup: {
            width: Platform.OS === "web" ? 500 : "85%",
            height: Platform.OS === "web" ? "auto" : "70%",
            maxHeight: "90%",
            padding: 20,
            backgroundColor: Colors.light.popupBackground,
            borderRadius: 12,
            alignContent:'center',
            //justifyContent:'center',
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
            borderColor: Colors.light.addtaskbuttoniconDefault,
            backgroundColor: Colors.light.headerBackground,
            borderRadius: 8,
            padding: 10,
            marginBottom: 10,
        },
        imagePicker: {
            height: 100,
            borderWidth: 1,
            borderColor: Colors.light.addtaskbuttonDefault,
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
            color: Colors.light.taskListText,
            fontWeight: "600",
        },
        cancelText: {
            textAlign: "center",
            color: Colors.light.taskListText,
        },
        });
