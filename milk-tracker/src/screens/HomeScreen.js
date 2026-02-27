/**
 * HomeScreen — orchestrates all components:
 *  1. Summary Card (always visible at top)
 *  2. Calendar Grid
 *  3. Action Buttons (Log Payment, Settings)
 *  4. Payment History
 *  5. Share Button
 *  6. Modals (Day Entry, Payment, Settings)
 */
import React, { useState } from 'react';
import {
  SafeAreaView, ScrollView, View, TouchableOpacity, Text, StyleSheet, StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import SummaryCard from '../components/SummaryCard';
import CalendarView from '../components/CalendarView';
import DayEntryModal from '../components/DayEntryModal';
import PaymentModal from '../components/PaymentModal';
import SettingsModal from '../components/SettingsModal';
import PaymentHistory from '../components/PaymentHistory';
import ShareButton from '../components/ShareButton';
import { COLORS } from '../theme/colors';

const HomeScreen = () => {
  const { ready } = useApp();

  // Modal visibility states
  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Currently selected date for the day entry modal
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  // Handler when a calendar day is tapped
  const handleDayPress = (dateKey) => {
    setSelectedDateKey(dateKey);
    setDayModalVisible(true);
  };

  if (!ready) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🥛 Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🥛 Milk Tracker</Text>
        <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Financial Summary — always visible */}
        <SummaryCard />

        {/* 2. Calendar */}
        <CalendarView onDayPress={handleDayPress} />

        {/* 3. Action Buttons Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.paymentBtn}
            onPress={() => setPaymentModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.paymentBtnText}>💰 Log Payment</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Payment History */}
        <PaymentHistory />

        {/* 5. Share Button */}
        <ShareButton />

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ---- Modals ---- */}
      <DayEntryModal
        visible={dayModalVisible}
        dateKey={selectedDateKey}
        onClose={() => setDayModalVisible(false)}
      />
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
      />
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  settingsBtn: {
    padding: 6,
  },
  settingsIcon: {
    fontSize: 22,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  paymentBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentBtnText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default HomeScreen;