import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import SignInScreen from './screens/SignInScreen';
import StudentDashboard from './screens/StudentDashboard';
import ProfileScreen from './screens/ProfileScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import FeesScreen from './screens/FeesScreen';

import GradesScreen from './screens/GradesScreen';
import TimetableScreen from './screens/TimetableScreen';
import ExamsScreen from './screens/ExamsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="SignIn"
        screenOptions={{
          headerShown: false, // We'll handle headers in individual screens
        }}
      >
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            title: 'Sign In',
          }}
        />
        <Stack.Screen
          name="StudentDashboard"
          component={StudentDashboard}
          options={{
            title: 'Dashboard',
          }}
        />
        {/* Placeholder screens for future implementation */}
        <Stack.Screen
          name="AdminDashboard"
          component={StudentDashboard} // Temporary placeholder
          options={{
            title: 'Admin Dashboard',
          }}
        />
        <Stack.Screen
          name="TeacherDashboard"
          component={StudentDashboard} // Temporary placeholder
          options={{
            title: 'Teacher Dashboard',
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
        <Stack.Screen
          name="Attendance"
          component={AttendanceScreen}
          options={{
            title: 'Attendance',
          }}
        />
        <Stack.Screen
          name="Fees"
          component={FeesScreen}
          options={{
            title: 'Fees',
          }}
        />
        <Stack.Screen
          name="Grades"
          component={GradesScreen}
          options={{
            title: 'Grades',
          }}
        />
        <Stack.Screen
          name="Timetable"
          component={TimetableScreen}
          options={{
            title: 'Timetable',
          }}
        />
        <Stack.Screen
          name="Exams"
          component={ExamsScreen}
          options={{
            title: 'Exams',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
