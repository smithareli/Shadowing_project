import React, { useState } from "react";
import {Modal, View, Text, TextInput, Pressable, StyleSheet, Image, Platform, Alert, ScrollView} from "react-native";
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
interface Option{
    label: string;
    value:string;
}
interface SelectOneOrNoneProps{
    options: Option[];
    value:string | null;
    onChange:(value:string | null)=>void;
    color:string;
    colorSelected:string;
}
const theme = Colors['light'];
export function SelectOneOrNoneGroup({
    options,
    value,
    onChange,
    color, 
    colorSelected}: SelectOneOrNoneProps){
        const handlePress = (optionValue:string)=>{
            onChange(value===optionValue ? null:optionValue);
    };
    return (
        <View style={styles.container} accessibilityRole="radiogroup">
            {options.map((option)=>{
                const isSelected = value ===option.value;
                return (
          <Pressable
            key={option.value}
            onPress={() => handlePress(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            style={[styles.option,{backgroundColor: isSelected? colorSelected : color}]} >
            <Text style={[styles.label, {color: isSelected ? 'white': Colors.light.taskListText}]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type GoalKey = "productivity" | "fitness" | "energy" | "learning";
type Goals = Record<GoalKey, string | null>;
const EMPTY: Goals = { productivity: null, fitness: null, energy: null, learning: null };

const CATEGORIES: {
  key: GoalKey; title: string; color: string; colorSelected: string; options: Option[];
}[] = [
  {
    key: "productivity", title: "Productivity", color: "#E7C0E4", colorSelected: "#A1809E",
    options: [
      { label: "Deep Focus", value: "deep_focus" },
      { label: "Avoid Burnout", value: "avoid_burnout" },
      { label: "Stay Organized", value: "stay_organized" },
      { label: "Meet Deadlines", value: "meet_deadlines" },
    ],
  },
  {
    key: "fitness", title: "Fitness", color: "#B4D7E6", colorSelected: "#90AAB6",
    options: [
      { label: "Stay Active", value: "stay_active" },
      { label: "Recover Well", value: "recover_well" },
      { label: "Endurance", value: "endurance" },
      { label: "Build Strength", value: "build_strength" },

    ],
  },
  {
    key: "energy", title: "Energy & Wellbeing", color: "#C0AEDE", colorSelected: "#9685B0",
    options: [
      { label: "Better Sleep", value: "better_sleep" },
      { label: "Manage Stress", value: "manage_stress" },
      { label: "Support My Mood", value: "support_mood" },
      { label: "Steady Energy", value: "steady_energy" },

    ],
  },
  {
    key: "learning", title: "Learning & Growth", color: "#CAE4C5", colorSelected: "#80947D",
    options: [
      { label: "Study & Learn", value: "study_learn" },
      { label: "Creative Projects", value: "creative_projects" },
      { label: "Social & Networking", value: "social_networking" },
    ],
  },
];

export default function EditGoalsModal({visible,  onClose, onSubmit, backendUrl, initialData}: Props) {
    const { userId }= useAuth();
    const [goals, setGoals] = useState<Goals>({ ...EMPTY, ...initialData});
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    useEffect(() => {
        if (visible) setGoals({ ...EMPTY, ...initialData });
        }, [visible, initialData]);
        const submit = async () => {
            if (!userId) return Alert.alert("Error", "You need to be signed in.");
            setIsSubmitting(true);
            try {
                const response = await fetch(`${backendUrl}/add-goals`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-User-id": userId },
                    body: JSON.stringify(goals),
                    });
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    onSubmit(await response.json());
                    onClose();
                } catch (error) {
                    console.error("Error submitting goals:", error);
                    Alert.alert("Error", "Failed to submit goals. Please try again.");
                } finally {
                    setIsSubmitting(false);
                }
                };
       
    return(
        <Modal visible={visible} animationType="slide" transparent={true}>
                        <View style={styles.overlay}>
                            <View style={styles.popup}>
                                <View style={styles.row}>
                                    <View style={styles.header}>
                                        <Text style= {styles.title}> Set New Focus Goals</Text>
                                        <Text style={styles.subtitle}> Select up to one option per catergory</Text>
                                    </View>
                                    <Pressable style={styles.promptButton} onPress={onClose}>
                                        <MaterialCommunityIcons
                                        name="cancel"
                                        size={30}
                                        color={Colors.light.addtaskbuttoniconDefault}/>
                                    </Pressable>
                                    
                                </View>
                               <ScrollView>
                                    {CATEGORIES.map((cat) => (
                                    <View key={cat.key} style={styles.category}>
                                        <Text style={styles.categoryTitle}>{cat.title}</Text>
                                        <SelectOneOrNoneGroup
                                        options={cat.options}
                                        value={goals[cat.key]}
                                        onChange={(v) => setGoals((g) => ({ ...g, [cat.key]: v }))}
                                        color={cat.color}
                                        colorSelected={cat.colorSelected}
                                        />
                                    </View>
                                    ))}
                                </ScrollView>

                                <Pressable style={styles.saveButton} onPress={submit} disabled={isSubmitting}>
                                    {isSubmitting ? <ActivityIndicator /> : <Text style={styles.saveText}>Save goals</Text>}
                                </Pressable>
                            </View>
                        </View>
        </Modal>


    )
}
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
        row: {
            flexDirection: "row",
            alignItems: "center",
            //gap: 8, 
            justifyContent: "space-between",
            //paddingHorizontal:50,
            paddingBottom:10,
            },

        popup: {
            width: Platform.OS === "web" ? 500 : "90%",
            height: Platform.OS === "web" ? "auto" : "70%",
            maxHeight: "90%",
            padding: 20,
            backgroundColor: Colors.light.popupBackground,
            borderRadius: 12,
            alignContent:'center',
            //justifyContent:'center',
        },
        promptButton: {
            height: 45,
            borderRadius: 10,
            backgroundColor: Colors.light.popupBackground,
            justifyContent: "center",
            alignItems: "center",

            },
        header:{
            padding:10,
            flexDirection:'column',
         },
         title:{
            fontSize:20,
            fontWeight:'bold',
            color: Colors.light.taskListText,
            textAlign:'left',

         },
         subtitle:{
            fontSize:12,
            color: Colors.light.taskListText,
            textAlign:'left',
            fontWeight: 'bold',
         },
         container:{
            flexDirection:'row',
            justifyContent: 'space-between',
            gap:5,

         },
         option:{
            flex:1,
            height:42,
            borderRadius:5,
            alignContent:'center',
            justifyContent:'center',
         },
         
         label:{
            fontSize:11,
            textAlign:'center',
            padding:5,
            //color:Colors.light.taskListText,
            
         },
         labelSelected:{
            fontSize:14,
            //color:'white',
         },
         category:{
            paddingVertical:10,
         },
         categoryTitle:{
            color:"#1F092A",
            fontSize: 14,
            paddingLeft:15,
            paddingBottom: 5,
            fontWeight: 'semibold',
         },
         saveButton:{
            minHeight: 48,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            padding:10,
            backgroundColor: Colors.light.addtaskbuttoniconDefault,
         },
         saveText:{
            color: '#ffffff',
            fontWeight: '700',
         }


})