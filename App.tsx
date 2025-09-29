import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AuthScreen from './src/screens/AuthScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <AuthScreen />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
