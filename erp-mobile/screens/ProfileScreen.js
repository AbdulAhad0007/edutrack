import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { mockStudents, mockUsers } from '../lib/students';

const ProfileScreen = ({ navigation, route }) => {
  // In a real app, you'd get the user from route params or context
  const userId = route?.params?.userId || 'UID001';
  const currentUser = mockUsers.find(user => user.id === userId);
  const studentData = mockStudents.find(student => student.id === userId);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.replace('SignIn')
        }
      ]
    );
  };

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
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: studentData?.avatar }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{currentUser?.name}</Text>
          <Text style={styles.email}>{currentUser?.email}</Text>
          <Text style={styles.role}>{currentUser?.role?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Student Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Academic Information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Student ID:</Text>
          <Text style={styles.detailValue}>{studentData?.id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Grade:</Text>
          <Text style={styles.detailValue}>{studentData?.grade}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Attendance:</Text>
          <Text style={styles.detailValue}>{studentData?.attendance}%</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fees Paid:</Text>
          <Text style={styles.detailValue}>₹{studentData?.fees.paid}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Fees:</Text>
          <Text style={styles.detailValue}>₹{studentData?.fees.total}</Text>
        </View>
      </View>

      {/* Subjects */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Current Subjects</Text>
        <View style={styles.subjectsContainer}>
          {studentData?.subjects.map((subject, index) => (
            <View key={index} style={styles.subjectChip}>
              <Text style={styles.subjectText}>{subject}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleChangePassword}
        >
          <Text style={styles.actionButtonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Logout</Text>
        </TouchableOpacity>
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
  editButton: {
    padding: 5,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  profileCard: {
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  role: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  detailsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectChip: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  subjectText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  actionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  actionButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#fff',
  },
});

export default ProfileScreen;
