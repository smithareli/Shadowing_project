import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ActivityIndicator, Button, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import DailyPhase from '@/components/Daily-phase';
import TaskUI from '@/components/task_ui';
import AddTaskModal from '@/components/add_tasks';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';


type Task = {
  taskId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
};

type CalendarEvent = {
  id: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

export default function HomeScreen() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [phase, setPhase] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);

  const loadGoogleCalendarEvents = async () => {
    setCalendarLoading(true);
    try {
      const response = await fetch('https://shadowing-project.onrender.com/google-calendar-events');
      if (!response.ok) {
        throw new Error(`Backend request failed with HTTP ${response.status}`);
      }

      const json: { events?: CalendarEvent[] } = await response.json();
      if (!Array.isArray(json.events)) {
        throw new Error('Backend response must contain an events array.');
      }
      /*
      setTasks(json.events.map((event) => ({
        taskId: event.id,
        title: event.summary ?? '(Untitled event)',
        description: event.description ?? '',
        startTime: event.start?.dateTime ?? event.start?.date ?? '',
        endTime: event.end?.dateTime ?? event.end?.date ?? '',
      })));
      */
    } catch (error: unknown) {
      console.error('Error fetching Google Calendar events:', error);
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    const backendUrl = 'https://shadowing-project.onrender.com';

    fetch(backendUrl)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(`Backend request failed with HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json: { phase?: unknown , tasks?: Task[] }) => {
        if (typeof json.phase !== 'string' || json.phase.trim().length === 0) {
          throw new Error('Backend response must contain a non-empty phase string.');
        }
        setPhase(json.phase);
        if (Array.isArray(json.tasks)) {
          setTasks(
            json.tasks.map((task: any) => ({
              taskId: String(task.id),
              title: task.name,
              description: task.description ?? '',
              startTime: task.start_time ?? '',
              endTime: task.end_time ?? '',
            }))
          );
        }
        setLoading(false);
      })
      .catch((error: unknown) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

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
              {"Hello\nAreli Smith!"}
            
            </ThemedText>
            <ThemedView style={styles.divider} />
            <ThemedText type="code" style={[styles.code, { color: theme.headerText }]}>
              Here's today's schedule.
            </ThemedText>
          </ThemedView>
          {phase && <DailyPhase phase={phase} />}
          <ThemedView style={styles.tasks_container}>
            <ThemedView  style={styles.task_header}>
              <ThemedText type="title" style={styles.taskTitle}>
                Tasks
              </ThemedText>

                <Pressable
                  disabled={calendarLoading}
                  onPress={loadGoogleCalendarEvents}
                  style={({ pressed }) => [
                    styles.button_container,
                    {
                      backgroundColor: pressed
                        ? theme.GooglecalendarButtonSelected
                        : theme.GooglecalendarButtonDefault,
                      opacity: calendarLoading ? 0.6 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarButtonText,
                      { color: theme.GooglecalendarButtonTextDefault },
                    ]}
                  >
                    {calendarLoading ? 'Loading Calendar...' : 'Google Calendar'}
                  </Text>
                </Pressable>
              <Pressable style={styles.addbuttoncontainer} onPress={() => setAddTaskModalVisible(true)}>
                <Ionicons name="add" size={24} color={theme.addtaskbuttoniconDefault}/>
              </Pressable>
            </ThemedView>
            
          <ThemedView style={styles.taskListContainer}>
          <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
          {tasks.map((task) => (
            <TaskUI
              key={task.taskId}
              taskId={task.taskId}
              title={task.title}
              description={task.description}
              startTime={task.startTime}
              endTime={task.endTime}
            />
          ))}
          </ScrollView>
          </ThemedView>
          
          <AddTaskModal
            visible={addTaskModalVisible}
            onClose={() => setAddTaskModalVisible(false)}
            onSubmit={(data) => setTasks((currentTasks) => [...currentTasks, data])}
            backendUrl="https://shadowing-project.onrender.com"
          />
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
    tasks_container: {
        padding: 10,
        width: '100%',
        backgroundColor: Colors.light.taskListBackground,
        borderRadius: 10,
        marginTop: 20,
        gap: 0,
    },
    task_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
        paddingBottom:0,
        backgroundColor: Colors.light.taskListBackground,
    },
    button_container: {
        borderRadius: 10,
        width: 130,
        height: 42,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider:{
      height: 3,
      width:'50%',
      backgroundColor: Colors.light.divider,
      marginVertical: 10,
    },
    taskTitle: {
      fontSize: 20,
      color: Colors.light.taskListText,
      paddingRight:80,

    },
    calendarButtonText: {
      textAlign: 'center',
      fontSize: 14,
    }, 
    addbuttoncontainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.light.addtaskbuttonDefault,
      width:55,
      height:55,
      borderTopLeftRadius: 10,
      borderTopRightRadius:10,

    },
    taskListContainer:{
      width: '100%',       
      minHeight: 200,       
      padding: 12,         
      borderRadius: 8,
      backgroundColor: Colors.light.taskitemBackground,

    },
    scroll:{
      flex:1,
    },
    content:{
      padding:20,
      alignItems:'center',
      paddingBottom:40,
    }
});