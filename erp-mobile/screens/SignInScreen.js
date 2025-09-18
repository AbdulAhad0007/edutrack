import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { mockUsers } from '../lib/students';

const SignInScreen = ({ navigation }) => {
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!uniqueId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both Unique ID and Password');
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = mockUsers.find(user => user.id === uniqueId && user.password === password);

      if (user) {
        // Store user session (in a real app, you'd use AsyncStorage or secure storage)
        console.log('Login successful:', user);

        // Navigate to main app based on user role
        if (user.role === 'admin') {
          navigation.replace('AdminDashboard');
        } else if (user.role === 'teacher') {
          navigation.replace('TeacherDashboard');
        } else {
          navigation.replace('StudentDashboard', { userId: user.id });
        }
      } else {
        Alert.alert('Error', 'Invalid credentials. Please check your Unique ID and Password.');
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/favicon.png')}
            style={styles.favicon}
            resizeMode="contain"
          />
          {/* <Image
            source={require('../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          /> */}
          <Text style={styles.title}>EduTrack</Text>
          {/* <Text style={styles.subtitle}>Mobile App</Text> */}
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.instructionText}>Please sign in to continue</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Unique ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Unique ID (e.g., UID001)"
              value={uniqueId}
              onChangeText={setUniqueId}
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <Text style={styles.signInButtonText}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Student: UID001 / password1</Text>
            {/* <Text style={styles.demoText}>Admin: ADMIN001 / admin123</Text>
            <Text style={styles.demoText}>Teacher: TEACHER001 / teacher123</Text> */}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  favicon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  signInButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  demoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  demoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default SignInScreen;
