// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

/**
 * Milk Tracker — Entry Point
 *
 * Wraps the entire app in the AppProvider for global state management.
 */
import React from 'react';
import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <AppProvider>
      <HomeScreen />
    </AppProvider>
  );
}