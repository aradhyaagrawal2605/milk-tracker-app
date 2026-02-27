/**
 * Generates a formatted monthly summary and opens the native Share sheet.
 * Works with WhatsApp, SMS, and any other sharing target.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Share, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { getMonthYearLabel, buildShareText } from '../utils/helpers';
import { COLORS } from '../theme/colors';

const ShareButton = () => {
  const {
    currentYear, currentMonth, entries, payments,
    totalLiters, totalDue, totalPaid, settings,
  } = useApp();

  const handleShare = async () => {
    const monthLabel = getMonthYearLabel(currentYear, currentMonth);
    const text = buildShareText(
      monthLabel, entries, payments,
      totalLiters, totalDue, totalPaid, settings.pricePerLiter
    );

    try {
      await Share.share({ message: text });
    } catch (err) {
      Alert.alert('Error', 'Could not open share sheet.');
    }
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handleShare} activeOpacity={0.7}>
      <Text style={styles.btnText}>📤 Share Monthly Summary</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  btnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ShareButton;