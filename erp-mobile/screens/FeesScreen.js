import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { mockStudents, mockUsers } from '../lib/students';

const FeesScreen = ({ navigation }) => {
  // In a real app, you'd get the user from route params or context
  const currentUser = mockUsers.find(user => user.id === 'UID001');
  const studentData = mockStudents.find(student => student.id === currentUser.id);

  const feesData = studentData?.fees || { paid: 1200, total: 1500 };
  const remainingFees = feesData.total - feesData.paid;
  const paymentPercentage = Math.round((feesData.paid / feesData.total) * 100);

  // Mock payment history
  const paymentHistory = [
    {
      id: 1,
      date: '2024-09-01',
      amount: 500,
      type: 'Tuition Fee',
      status: 'paid',
      method: 'Online Payment'
    },
    {
      id: 2,
      date: '2024-08-01',
      amount: 400,
      type: 'Tuition Fee',
      status: 'paid',
      method: 'Cash'
    },
    {
      id: 3,
      date: '2024-07-01',
      amount: 300,
      type: 'Tuition Fee',
      status: 'paid',
      method: 'Bank Transfer'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#28a745';
      case 'pending': return '#ffc107';
      case 'overdue': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const handlePayNow = () => {
    alert('Payment gateway integration coming soon!');
  };

  const renderPaymentItem = (item) => (
    <View key={item.id} style={styles.paymentItem}>
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentType}>{item.type}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.paymentDetails}>
        <Text style={styles.paymentAmount}>₹{item.amount}</Text>
        <Text style={styles.paymentDate}>{item.date}</Text>
      </View>

      <Text style={styles.paymentMethod}>{item.method}</Text>
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
        <Text style={styles.headerTitle}>Fees</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Fee Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Fee Summary</Text>

        <View style={styles.feeProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${paymentPercentage}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{paymentPercentage}% Paid</Text>
        </View>

        <View style={styles.feeStats}>
          <View style={styles.feeStat}>
            <Text style={styles.feeAmount}>₹{feesData.paid}</Text>
            <Text style={styles.feeLabel}>Paid</Text>
          </View>
          <View style={styles.feeStat}>
            <Text style={styles.feeAmount}>₹{remainingFees}</Text>
            <Text style={styles.feeLabel}>Remaining</Text>
          </View>
          <View style={styles.feeStat}>
            <Text style={styles.feeAmount}>₹{feesData.total}</Text>
            <Text style={styles.feeLabel}>Total</Text>
          </View>
        </View>

        {remainingFees > 0 && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayNow}
          >
            <Text style={styles.payButtonText}>Pay Remaining Fees</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Payment History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Payment History</Text>
        {paymentHistory.map(renderPaymentItem)}
      </View>

      {/* Fee Breakdown */}
      <View style={styles.breakdownSection}>
        <Text style={styles.sectionTitle}>Fee Breakdown</Text>

        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Tuition Fee</Text>
          <Text style={styles.breakdownAmount}>₹1,200</Text>
        </View>

        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Library Fee</Text>
          <Text style={styles.breakdownAmount}>₹150</Text>
        </View>

        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Sports Fee</Text>
          <Text style={styles.breakdownAmount}>₹100</Text>
        </View>

        <View style={styles.breakdownItem}>
          <Text style={styles.breakdownLabel}>Transportation Fee</Text>
          <Text style={styles.breakdownAmount}>₹50</Text>
        </View>

        <View style={[styles.breakdownItem, styles.totalItem]}>
          <Text style={[styles.breakdownLabel, styles.totalLabel]}>Total</Text>
          <Text style={[styles.breakdownAmount, styles.totalAmount]}>₹{feesData.total}</Text>
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
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  feeProgress: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  feeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  feeStat: {
    alignItems: 'center',
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  payButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
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
  paymentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  breakdownSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    borderRadius: 10,
    padding: 20,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownLabel: {
    fontSize: 16,
    color: '#333',
  },
  breakdownAmount: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  totalItem: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: '#333',
    marginTop: 10,
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default FeesScreen;
