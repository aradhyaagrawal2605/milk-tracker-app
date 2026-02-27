/**
 * Financial dashboard card — always visible on the main screen.
 * Shows total liters, bill, paid, and due amount.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthYearLabel } from '../utils/helpers';
import { COLORS } from '../theme/colors';

const SummaryCard = () => {
  const { currentYear, currentMonth, totalLiters, totalBill, totalPaid, totalDue, settings } = useApp();

  return (
    <View style={styles.card}>
      {/* Month label */}
      <Text style={styles.monthLabel}>
        {getMonthYearLabel(currentYear, currentMonth)}
      </Text>

      {/* Metrics row */}
      <View style={styles.metricsRow}>
        {/* Total Liters */}
        <View style={[styles.metricBox, { backgroundColor: COLORS.primaryLight }]}>
          <Text style={styles.metricValue}>{totalLiters.toFixed(1)}L</Text>
          <Text style={styles.metricLabel}>Total Milk</Text>
        </View>

        {/* Total Bill */}
        <View style={[styles.metricBox, { backgroundColor: COLORS.accentLight }]}>
          <Text style={styles.metricValue}>{formatCurrency(totalBill)}</Text>
          <Text style={styles.metricLabel}>Total Bill</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        {/* Paid */}
        <View style={[styles.metricBox, { backgroundColor: COLORS.accentLight }]}>
          <Text style={[styles.metricValue, { color: COLORS.paid }]}>{formatCurrency(totalPaid)}</Text>
          <Text style={styles.metricLabel}>Paid</Text>
        </View>

        {/* Due */}
        <View style={[styles.metricBox, { backgroundColor: totalDue > 0 ? COLORS.dueLight : COLORS.accentLight }]}>
          <Text style={[styles.metricValue, { color: totalDue > 0 ? COLORS.due : COLORS.paid }]}>
            {formatCurrency(Math.max(totalDue, 0))}
          </Text>
          <Text style={styles.metricLabel}>Due</Text>
        </View>
      </View>

      {/* Rate info */}
      <Text style={styles.rateInfo}>Rate: {formatCurrency(settings.pricePerLiter)} / liter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 8,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricBox: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  rateInfo: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

export default SummaryCard;