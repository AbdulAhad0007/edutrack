import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { mockStudents, mockUsers } from '../lib/students';

const GradesScreen = ({ navigation, route }) => {
  // Get user ID from route params or default to 'UID001'
  const userId = route?.params?.userId || 'UID001';
  const currentUser = mockUsers.find(user => user.id === userId);
  const studentData = mockStudents.find(student => student.id === userId);

  // Mock grades data
  const gradesData = {
    'Current Semester': [
      { subject: 'Mathematics', grade: 'A', marks: '95/100', teacher: 'Mr. Sharma' },
      { subject: 'Physics', grade: 'A-', marks: '88/100', teacher: 'Ms. Patel' },
      { subject: 'Chemistry', grade: 'B+', marks: '82/100', teacher: 'Dr. Kumar' },
      { subject: 'English', grade: 'A', marks: '92/100', teacher: 'Mrs. Singh' },
      { subject: 'Computer Science', grade: 'A-', marks: '89/100', teacher: 'Mr. Gupta' },
    ],
    'Semester 2': [
      { subject: 'Mathematics', grade: 'B+', marks: '85/100', teacher: 'Mr. Sharma' },
      { subject: 'Physics', grade: 'A', marks: '91/100', teacher: 'Ms. Patel' },
      { subject: 'Chemistry', grade: 'A-', marks: '87/100', teacher: 'Dr. Kumar' },
      { subject: 'English', grade: 'A', marks: '94/100', teacher: 'Mrs. Singh' },
      { subject: 'Biology', grade: 'B', marks: '78/100', teacher: 'Ms. Reddy' },
    ],
    'Semester 1': [
      { subject: 'Mathematics', grade: 'A-', marks: '89/100', teacher: 'Mr. Sharma' },
      { subject: 'Physics', grade: 'B+', marks: '84/100', teacher: 'Ms. Patel' },
      { subject: 'Chemistry', grade: 'A', marks: '93/100', teacher: 'Dr. Kumar' },
      { subject: 'English', grade: 'A', marks: '96/100', teacher: 'Mrs. Singh' },
      { subject: 'History', grade: 'B+', marks: '86/100', teacher: 'Mr. Khan' },
    ],
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#28a745';
    if (grade.startsWith('B')) return '#ffc107';
    if (grade.startsWith('C')) return '#fd7e14';
    return '#dc3545';
  };

  const calculateGPA = (grades) => {
    const gradePoints = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0 };
    const totalPoints = grades.reduce((sum, subject) => {
      const grade = subject.grade.split('')[0]; // Get letter grade
      return sum + (gradePoints[grade] || 0);
    }, 0);
    return (totalPoints / grades.length).toFixed(2);
  };

  const currentGrades = gradesData['Current Semester'];
  const gpa = calculateGPA(currentGrades);

  const renderGradeItem = ({ item }) => (
    <View style={styles.gradeItem}>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{item.subject}</Text>
        <Text style={styles.teacherName}>{item.teacher}</Text>
      </View>

      <View style={styles.gradeInfo}>
        <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) }]}>
          <Text style={styles.gradeText}>{item.grade}</Text>
        </View>
        <Text style={styles.marksText}>{item.marks}</Text>
      </View>
    </View>
  );

  // Removed renderSemesterButton function as semester selector is removed

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
        <Text style={styles.headerTitle}>Grades</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* GPA Overview */}
      <View style={styles.gpaCard}>
        <Text style={styles.gpaTitle}>Grade Point Average</Text>
        <Text style={styles.gpaValue}>{gpa}</Text>
        <Text style={styles.gpaLabel}>GPA</Text>
      </View>

      {/* Grades List */}
      <View style={styles.gradesList}>
        <Text style={styles.listTitle}>Grades</Text>
        <FlatList
          data={currentGrades}
          renderItem={renderGradeItem}
          keyExtractor={(item) => item.subject}
          scrollEnabled={false}
        />
      </View>

      {/* Grade Scale */}
      <View style={styles.gradeScale}>
        <Text style={styles.scaleTitle}>Grade Scale</Text>
        <View style={styles.scaleContainer}>
          <View style={styles.scaleItem}>
            <View style={[styles.scaleColor, { backgroundColor: '#28a745' }]} />
            <Text style={styles.scaleText}>A (90-100%)</Text>
          </View>
          <View style={styles.scaleItem}>
            <View style={[styles.scaleColor, { backgroundColor: '#ffc107' }]} />
            <Text style={styles.scaleText}>B (80-89%)</Text>
          </View>
          <View style={styles.scaleItem}>
            <View style={[styles.scaleColor, { backgroundColor: '#fd7e14' }]} />
            <Text style={styles.scaleText}>C (70-79%)</Text>
          </View>
          <View style={styles.scaleItem}>
            <View style={[styles.scaleColor, { backgroundColor: '#dc3545' }]} />
            <Text style={styles.scaleText}>D (Below 70%)</Text>
          </View>
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
  gpaCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gpaTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  gpaValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  gpaLabel: {
    fontSize: 14,
    color: '#666',
  },

  gradesList: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    padding: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 14,
    color: '#666',
  },
  gradeInfo: {
    alignItems: 'flex-end',
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 5,
  },
  gradeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  marksText: {
    fontSize: 14,
    color: '#666',
  },
  gradeScale: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    padding: 20,
  },
  scaleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scaleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  scaleColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  scaleText: {
    fontSize: 14,
    color: '#333',
  },
});

export default GradesScreen;
