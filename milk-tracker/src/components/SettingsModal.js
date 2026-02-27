/**
 * Settings modal — configure price per liter & default daily liters.
 */
import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../theme/colors';

const SettingsModal = ({ visible, onClose }) => {
  const { settings, updateSettings } = useApp();

  const [price, setPrice] = useState('');
  const [defaultLiters, setDefaultLiters] = useState('');

  useEffect(() => {
    if (visible) {
      setPrice(String(settings.pricePerLiter));
      setDefaultLiters(String(settings.defaultLiters));
    }
  }, [visible]);

  const handleSave = () => {
    const parsedPrice = parseFloat(price) || settings.pricePerLiter;
    const parsedLiters = parseFloat(defaultLiters) || settings.defaultLiters;
    updateSettings({
      pricePerLiter: parsedPrice,
      defaultLiters: parsedLiters,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>⚙️ Settings</Text>

          <Text style={styles.label}>Price per Liter (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
            placeholder="e.g. 60"
            placeholderTextColor={COLORS.textSecondary}
            selectTextOnFocus
          />

          <Text style={styles.label}>Default Daily Liters</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={defaultLiters}
            onChangeText={setDefaultLiters}
            placeholder="e.g. 1"
            placeholderTextColor={COLORS.textSecondary}
            selectTextOnFocus
          />

          <Text style={styles.hint}>
            The default liters will auto-fill when you tap a day on the calendar. You can always change it per day.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
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
    marginBottom: 20,
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
  hint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
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
    backgroundColor: COLORS.primary,
  },
  saveText: {
    color: COLORS.textLight,
    fontWeight: '700',
  },
});

export default SettingsModal;