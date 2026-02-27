/**
 * Modal for entering/editing milk delivery for a specific day.
 *
 * Fields:
 *  - Liters (pre-filled with default from settings)
 *  - Note (optional)
 *  - Delete entry button (if entry exists)
 */
import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { formatDisplayDate } from '../utils/helpers';
import { COLORS } from '../theme/colors';

const DayEntryModal = ({ visible, dateKey, onClose }) => {
  const { entries, settings, setDayEntry, removeDayEntry } = useApp();

  const existing = entries[dateKey];

  const [liters, setLiters] = useState('');
  const [note, setNote] = useState('');

  // When the modal opens, populate fields
  useEffect(() => {
    if (visible) {
      if (existing) {
        setLiters(String(existing.liters));
        setNote(existing.note || '');
      } else {
        // Pre-fill with default liters from settings
        setLiters(String(settings.defaultLiters));
        setNote('');
      }
    }
  }, [visible, dateKey]);

  const handleSave = () => {
    const parsedLiters = parseFloat(liters) || 0;
    if (parsedLiters <= 0 && !note.trim()) {
      // Nothing to save — treat as delete
      removeDayEntry(dateKey);
    } else {
      setDayEntry(dateKey, { liters: parsedLiters, note: note.trim() });
    }
    onClose();
  };

  const handleDelete = () => {
    removeDayEntry(dateKey);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modal}>
          {/* Header */}
          <Text style={styles.title}>🥛 {dateKey ? formatDisplayDate(dateKey) : ''}</Text>

          {/* Liters input */}
          <Text style={styles.label}>Milk Received (liters)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={liters}
            onChangeText={setLiters}
            placeholder="e.g. 1.5"
            placeholderTextColor={COLORS.textSecondary}
            selectTextOnFocus
          />

          {/* Note input */}
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={[styles.input, styles.noteInput]}
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Watery milk today"
            placeholderTextColor={COLORS.textSecondary}
            multiline
          />

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            {existing && (
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            )}

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
  noteInput: {
    minHeight: 70,
    textAlignVertical: 'top',
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
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#FDECEC',
  },
  deleteText: {
    color: COLORS.danger,
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

export default DayEntryModal;