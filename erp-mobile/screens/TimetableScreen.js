import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { mockStudents, mockUsers } from '../lib/students';

const TimetableScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState('Monday');

  // In a real app, you'd get the user from route params or context
  const currentUser = mockUsers.find(user => user.id === 'UID001');
  const studentData = mockStudents.find(student => student.id === currentUser.id);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Timetables based on class (copied from web app)
  const timetables = {
    '10-A': [
      { day: 'Monday', subject: 'Math', time: '9:00 - 10:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Tuesday', subject: 'English', time: '10:00 - 11:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Wednesday', subject: 'Science', time: '11:00 - 12:00', teacher: 'Dr. Smith', room: 'C-303' },
      { day: 'Thursday', subject: 'History', time: '9:00 - 10:00', teacher: 'Ms. Rose', room: 'A-102' },
      { day: 'Friday', subject: 'Computer', time: '1:00 - 2:00', teacher: 'Mr. Doe', room: 'Lab-1' },
    ],
    '9-B': [
      { day: 'Monday', subject: 'Science', time: '9:00 - 10:00', teacher: 'Dr. Smith', room: 'C-303' },
      { day: 'Tuesday', subject: 'Math', time: '10:00 - 11:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Wednesday', subject: 'English', time: '11:00 - 12:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Thursday', subject: 'Computer', time: '9:00 - 10:00', teacher: 'Mr. Doe', room: 'Lab-1' },
      { day: 'Friday', subject: 'History', time: '1:00 - 2:00', teacher: 'Ms. Rose', room: 'A-102' },
    ],
    '11-C': [
      { day: 'Monday', subject: 'English', time: '9:00 - 10:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Tuesday', subject: 'Science', time: '10:00 - 11:00', teacher: 'Dr. Smith', room: 'C-303' },
      { day: 'Wednesday', subject: 'Math', time: '11:00 - 12:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Thursday', subject: 'Computer', time: '9:00 - 10:00', teacher: 'Mr. Doe', room: 'Lab-1' },
      { day: 'Friday', subject: 'History', time: '1:00 - 2:00', teacher: 'Ms. Rose', room: 'A-102' },
    ],
    '12-B': [
      { day: 'Monday', subject: 'History', time: '9:00 - 10:00', teacher: 'Ms. Rose', room: 'A-102' },
      { day: 'Tuesday', subject: 'Computer', time: '10:00 - 11:00', teacher: 'Mr. Doe', room: 'Lab-1' },
      { day: 'Wednesday', subject: 'Math', time: '11:00 - 12:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Thursday', subject: 'English', time: '9:00 - 10:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Friday', subject: 'Science', time: '1:00 - 2:00', teacher: 'Dr. Smith', room: 'C-303' },
    ],
    '8-A': [
      { day: 'Monday', subject: 'Math', time: '9:00 - 10:00', teacher: 'Mrs. Clara', room: 'A-101' },
      { day: 'Tuesday', subject: 'English', time: '10:00 - 11:00', teacher: 'Mr. John', room: 'B-202' },
      { day: 'Wednesday', subject: 'Science', time: '11:00 - 12:00', teacher: 'Dr. Smith', room: 'C-303' },
      { day: 'Thursday', subject: 'History', time: '9:00 - 10:00', teacher: 'Ms. Rose', room: 'A-102' },
      { day: 'Friday', subject: 'Computer', time: '1:00 - 2:00', teacher: 'Mr. Doe', room: 'Lab-1' },
    ],
  };

  const schedule = studentData?.class ? timetables[studentData.class] || [] : [];
  const todaysSchedule = schedule.filter(item => item.day === selectedDay);

  const getSubjectColor = (subject) => {
    const colors = {
      'Math': '#FF6B6B',
      'English': '#4ECDC4',
      'Science': '#45B7D1',
      'History': '#96CEB4',
      'Computer': '#FFEAA7',
    };
    return colors[subject] || '#A8E6CF';
  };

  const renderDayButton = (day) => (
    <TouchableOpacity
      key={day}
      style={[
        styles.dayButton,
        selectedDay === day && styles.dayButtonActive
      ]}
      onPress={() => setSelectedDay(day)}
    >
      <Text
        style={[
          styles.dayButtonText,
          selectedDay === day && styles.dayButtonTextActive
        ]}
      >
        {day.slice(0, 3)}
      </Text>
    </TouchableOpacity>
  );

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>

      <View style={[styles.subjectCard, { backgroundColor: getSubjectColor(item.subject) }]}>
        <Text style={styles.subjectName}>{item.subject}</Text>
        <Text style={styles.teacherName}>{item.teacher}</Text>
        <Text style={styles.roomText}>{item.room}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Timetable</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Class Info */}
      <View style={styles.classInfo}>
        <Text style={styles.classText}>Class: {studentData?.class || 'N/A'}</Text>
        <Text style={styles.studentText}>Student: {studentData?.name || currentUser.name}</Text>
      </View>

      {/* Day Selector */}
      <View style={styles.daySelector}>
        <Text style={styles.selectorTitle}>Select Day</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.daysContainer}>
            {daysOfWeek.map(renderDayButton)}
          </View>
        </ScrollView>
      </View>

      {/* Schedule Display */}
      <View style={styles.scheduleContainer}>
        <Text style={styles.scheduleTitle}>{selectedDay}'s Schedule</Text>

        {todaysSchedule.length > 0 ? (
          <FlatList
            data={todaysSchedule}
            renderItem={renderScheduleItem}
            keyExtractor={(item, index) => `${item.subject}-${index}`}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.noSchedule}>
            <Text style={styles.noScheduleText}>No classes scheduled for {selectedDay}</Text>
            <Text style={styles.noScheduleSubtext}>Enjoy your free day! 📚</Text>
          </View>
        )}
      </View>

      {/* Weekly Overview */}
      <View style={styles.weeklyOverview}>
        <Text style={styles.overviewTitle}>This Week Overview</Text>
        <View style={styles.overviewGrid}>
          {daysOfWeek.slice(0, 5).map(day => {
            const daySchedule = schedule.filter(item => item.day === day);
            return (
              <View key={day} style={styles.overviewDay}>
                <Text style={styles.overviewDayName}>{day.slice(0, 3)}</Text>
                <Text style={styles.overviewCount}>{daySchedule.length}</Text>
                <Text style={styles.overviewLabel}>classes</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  classInfo: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  classText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  studentText: {
    fontSize: 16,
    color: '#666',
  },
  daySelector: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    padding: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  daysContainer: {
    flexDirection: 'row',
  },
  dayButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#007bff',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: '#fff',
  },
  scheduleContainer: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    padding: 20,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeContainer: {
    width: 100,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  subjectCard: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    marginLeft: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  teacherName: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 3,
  },
  roomText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  noSchedule: {
    alignItems: 'center',
    padding: 40,
  },
  noScheduleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  noScheduleSubtext: {
    fontSize: 14,
    color: '#999',
  },
  weeklyOverview: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    padding: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewDay: {
    alignItems: 'center',
    flex: 1,
  },
  overviewDayName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  overviewCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 2,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default TimetableScreen;
