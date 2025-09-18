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

const AttendanceScreen = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState('October');

  // In a real app, you'd get the user from route params or context
  const currentUser = mockUsers.find(user => user.id === 'UID001');
  const studentData = mockStudents.find(student => student.id === currentUser.id);

  const months = ['September', 'October', 'November', 'December'];
  const attendancePercentage = studentData?.attendance || 85;

  // Mock attendance data for the selected month
  const attendanceData = [
    { date: '2024-10-01', status: 'present', day: 'Mon' },
    { date: '2024-10-02', status: 'present', day: 'Tue' },
    { date: '2024-10-03', status: 'absent', day: 'Wed' },
    { date: '2024-10-04', status: 'present', day: 'Thu' },
    { date: '2024-10-05', status: 'present', day: 'Fri' },
    { date: '2024-10-08', status: 'present', day: 'Mon' },
    { date: '2024-10-09', status: 'late', day: 'Tue' },
    { date: '2024-10-10', status: 'present', day: 'Wed' },
    { date: '2024-10-11', status: 'present', day: 'Thu' },
    { date: '2024-10-12', status: 'present', day: 'Fri' },
    { date: '2024-10-15', status: 'present', day: 'Mon' },
    { date: '2024-10-16', status: 'present', day: 'Tue' },
    { date: '2024-10-17', status: 'absent', day: 'Wed' },
    { date: '2024-10-18', status: 'present', day: 'Thu' },
    { date: '2024-10-19', status: 'present', day: 'Fri' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#28a745';
      case 'absent': return '#dc3545';
      case 'late': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      default: return 'Unknown';
    }
  };

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.dateText}>{item.date.split('-')[2]}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) }
          ]}
        />
        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
      </View>
    </View>
  );

  const renderMonthButton = (month) => (
    <TouchableOpacity
      key={month}
      style={[
        styles.monthButton,
        selectedMonth === month && styles.monthButtonActive
      ]}
      onPress={() => setSelectedMonth(month)}
    >
      <Text
        style={[
          styles.monthButtonText,
          selectedMonth === month && styles.monthButtonTextActive
        ]}
      >
        {month}
      </Text>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Monthly Overview</Text>
        <Text style={styles.attendancePercentage}>{attendancePercentage}%</Text>
        <Text style={styles.attendanceLabel}>Attendance Rate</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>22</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
        </View>
      </View>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <Text style={styles.selectorTitle}>Select Month</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.monthsContainer}>
            {months.map(renderMonthButton)}
          </View>
        </ScrollView>
      </View>

      {/* Attendance List */}
      <View style={styles.attendanceList}>
        <Text style={styles.listTitle}>{selectedMonth} Attendance</Text>
        <FlatList
          data={attendanceData}
          renderItem={renderAttendanceItem}
          keyExtractor={(item) => item.date}
          scrollEnabled={false}
        />
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
  overviewCard: {
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
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  attendancePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 5,
  },
  attendanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  monthSelector: {
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
  monthsContainer: {
    flexDirection: 'row',
  },
  monthButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  monthButtonActive: {
    backgroundColor: '#007bff',
  },
  monthButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  monthButtonTextActive: {
    color: '#fff',
  },
  attendanceList: {
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
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateContainer: {
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default AttendanceScreen;
