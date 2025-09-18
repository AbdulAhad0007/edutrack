import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { mockUsers, mockStudents, mockDashboardData } from '../lib/students';

const StudentDashboard = ({ navigation, route }) => {
  // Get user ID from route params or default to 'UID001'
  const userId = route?.params?.userId || 'UID001';
  const currentUser = mockUsers.find(user => user.id === userId);
  const studentData = mockStudents.find(student => student.id === userId);

  const menuItems = [
    {
      id: 'profile',
      title: 'My Profile',
      icon: '👤',
      screen: 'Profile',
      color: '#007bff'
    },
    {
      id: 'attendance',
      title: 'Attendance',
      icon: '📊',
      screen: 'Attendance',
      color: '#28a745'
    },
    {
      id: 'fees',
      title: 'Fees',
      icon: '💰',
      screen: 'Fees',
      color: '#ffc107'
    },
    {
      id: 'grades',
      title: 'Grades',
      icon: '📚',
      screen: 'Grades',
      color: '#dc3545'
    },
    {
      id: 'timetable',
      title: 'Timetable',
      icon: '📅',
      screen: 'Timetable',
      color: '#6f42c1'
    },
    {
      id: 'exams',
      title: 'Exams',
      icon: '📝',
      screen: 'Exams',
      color: '#fd7e14'
    }
  ];

  const renderMenuItem = (item) => (
      <TouchableOpacity
        key={item.id}
        style={[styles.menuItem, { borderLeftColor: item.color }]}
        onPress={() => navigation.navigate(item.screen, { userId })}
      >
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <Text style={styles.menuTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: studentData?.avatar }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{currentUser?.name}</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{studentData?.attendance}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{studentData?.fees.paid}</Text>
          <Text style={styles.statLabel}>Fees Paid</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{studentData?.grade}</Text>
          <Text style={styles.statLabel}>Grade</Text>
        </View>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.menuGrid}>
          {menuItems.map(renderMenuItem)}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.activitiesContainer}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {mockDashboardData.recentActivities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <Text style={styles.activityMessage}>{activity.message}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))}
      </View>
      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          // Placeholder logout action: navigate to SignIn screen
          navigation.navigate('SignIn');
        }}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  menuContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activitiesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  activityItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentDashboard;
