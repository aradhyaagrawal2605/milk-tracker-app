/**
 * Custom calendar grid for the current month.
 *
 * Visual indicators:
 *  - Blue dot → milk logged
 *  - Yellow dot → has note
 *  - Green dot → payment on that day
 *  - Bold ring → today
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { getDaysInMonth, getFirstDayOfMonth, getDateKey } from '../utils/helpers';
import { COLORS } from '../theme/colors';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarView = ({ onDayPress }) => {
  const { currentYear, currentMonth, entries, payments, navigateMonth } = useApp();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const today = new Date();
  const todayKey = getDateKey(today);

  // Build payment lookup by date
  const paymentDays = new Set(payments.map((p) => p.date));

  // Navigate to previous / next month
  const goPrev = () => {
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    navigateMonth(y, m);
  };
  const goNext = () => {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    navigateMonth(y, m);
  };

  // Build grid cells
  const cells = [];
  // Empty cells before the 1st
  for (let i = 0; i < firstDay; i++) {
    cells.push(<View key={`empty-${i}`} style={styles.cell} />);
  }
  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = getDateKey(new Date(currentYear, currentMonth, day));
    const entry = entries[dateKey];
    const isToday = dateKey === todayKey;
    const hasMilk = entry && entry.liters > 0;
    const hasNote = entry && entry.note && entry.note.trim().length > 0;
    const hasPayment = paymentDays.has(dateKey);

    cells.push(
      <TouchableOpacity
        key={dateKey}
        style={[
          styles.cell,
          isToday && styles.todayCell,
          hasMilk && styles.milkCell,
        ]}
        activeOpacity={0.6}
        onPress={() => onDayPress(dateKey, day)}
      >
        <Text style={[styles.dayNumber, isToday && styles.todayText]}>
          {day}
        </Text>

        {/* Indicator dots */}
        <View style={styles.dotRow}>
          {hasMilk && <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />}
          {hasNote && <View style={[styles.dot, { backgroundColor: COLORS.warning }]} />}
          {hasPayment && <View style={[styles.dot, { backgroundColor: COLORS.accent }]} />}
        </View>

        {/* Liters label */}
        {hasMilk && (
          <Text style={styles.litersLabel}>{entry.liters}L</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Month navigation arrows */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={goPrev} style={styles.navBtn}>
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goNext} style={styles.navBtn}>
          <Text style={styles.navText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday headers */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((wd) => (
          <View key={wd} style={styles.cell}>
            <Text style={styles.weekdayText}>{wd}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>{cells}</View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>Milk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.warning }]} />
          <Text style={styles.legendText}>Note</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
          <Text style={styles.legendText}>Payment</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  navText: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.primary,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekdayText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%', // 7 columns
    alignItems: 'center',
    paddingVertical: 6,
    minHeight: 52,
  },
  todayCell: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.calendarToday,
  },
  milkCell: {
    backgroundColor: COLORS.calendarMilk,
    borderRadius: 10,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  todayText: {
    fontWeight: '800',
    color: COLORS.calendarToday,
  },
  dotRow: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  litersLabel: {
    fontSize: 9,
    color: COLORS.primaryDark,
    fontWeight: '600',
    marginTop: 1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});

export default CalendarView;