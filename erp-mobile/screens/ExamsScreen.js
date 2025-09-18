import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { mockExamsData, mockStudents } from '../lib/students';

const ExamsScreen = ({ route }) => {
  const userId = route?.params?.userId || 'UID001';

  const student = mockStudents.find(s => s.id === userId);

  const upcomingExams = mockExamsData.upcoming;
  const examResults = mockExamsData.results.filter(r => r.studentId === userId);

  const handleDownloadAdmitCard = () => {
    Alert.alert('Download Admit Card', 'Admit card downloaded and saved to your phone downloads!');
  };

  const renderUpcomingExam = ({ item }) => (
    <View style={styles.examItem}>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.dateTime}>{item.date} • {item.time}</Text>
    </View>
  );

  const renderResult = ({ item }) => (
    <View style={styles.resultRow}>
      <Text style={styles.resultSubject}>{item.subject}</Text>
      <Text style={styles.resultMarks}>{item.marks}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exams for {student?.name}</Text>

      <Text style={styles.sectionTitle}>Upcoming Exams</Text>
      <FlatList
        data={upcomingExams}
        keyExtractor={item => item.id.toString()}
        renderItem={renderUpcomingExam}
        style={styles.list}
      />

      <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadAdmitCard}>
        <Text style={styles.downloadButtonText}>Download Admit Card</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Results</Text>
      {examResults.length === 0 ? (
        <Text style={styles.noResults}>No results available.</Text>
      ) : (
        <FlatList
          data={examResults}
          keyExtractor={item => item.id.toString()}
          renderItem={renderResult}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#007bff',
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  examItem: {
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateTime: {
    fontSize: 14,
    color: '#666',
  },
  downloadButton: {
    backgroundColor: '#6f42c1',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  resultSubject: {
    fontSize: 16,
    color: '#333',
  },
  resultMarks: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
  noResults: {
    fontStyle: 'italic',
    color: '#666',
    padding: 10,
  },
});

export default ExamsScreen;
