/**
 * Displays the list of payments for the current month.
 * Each payment can be deleted with a long-press.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDisplayDate } from '../utils/helpers';
import { COLORS } from '../theme/colors';

const PaymentHistory = () => {
  const { payments, removePayment } = useApp();

  if (payments.length === 0) return null;

  const handleLongPress = (payment) => {
    Alert.alert(
      'Delete Payment',
      `Remove payment of ${formatCurrency(payment.amount)} on ${formatDisplayDate(payment.date)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removePayment(payment.id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>💰 Payments This Month</Text>
      {payments.map((p) => (
        <TouchableOpacity
          key={p.id}
          style={styles.row}
          onLongPress={() => handleLongPress(p)}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <Text style={styles.date}>{formatDisplayDate(p.date)}</Text>
            {p.note ? <Text style={styles.note}>{p.note}</Text> : null}
          </View>
          <Text style={styles.amount}>{formatCurrency(p.amount)}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.hint}>Long-press a payment to delete it</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowLeft: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  note: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default PaymentHistory;