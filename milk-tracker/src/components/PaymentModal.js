/**
 * Modal for logging a payment to the milkmaid.
 */
import React, { useState } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { COLORS } from '../theme/colors';

const PaymentModal = ({ visible, onClose }) => {
  const { totalDue, addPayment } = useApp();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    addPayment(parsedAmount, note.trim());
    setAmount('');
    setNote('');
    onClose();
  };

  // Quick-fill the full due amount
  const fillDue = () => {
    if (totalDue > 0) setAmount(String(totalDue.toFixed(2)));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>💰 Log Payment</Text>

          {/* Current due display */}
          <View style={styles.dueBox}>
            <Text style={styles.dueLabel}>Current Due</Text>
            <Text style={styles.dueValue}>{formatCurrency(Math.max(totalDue, 0))}</Text>
          </View>

          {/* Amount input */}
          <Text style={styles.label}>Amount Paid (₹)</Text>
          <View style={styles.amountRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 500"
              placeholderTextColor={COLORS.textSecondary}
              selectTextOnFocus
            />
            {totalDue > 0 && (
              <TouchableOpacity style={styles.fillBtn} onPress={fillDue}>
                <Text style={styles.fillBtnText}>Pay Full</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Note input */}
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Paid via UPI"
            placeholderTextColor={COLORS.textSecondary}
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Log Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 24,
    width: '88%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  dueBox: {
    backgroundColor: COLORS.dueLight,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  dueLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  dueValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.due,
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 16,
    backgroundColor: COLORS.background,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  fillBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
  },
  fillBtnText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: COLORS.calendarEmpty,
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
  },
  saveText: {
    color: COLORS.textLight,
    fontWeight: '700',
  },
});

export default PaymentModal;