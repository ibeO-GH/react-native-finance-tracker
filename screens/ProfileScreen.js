import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import { ThemeContext } from "../context/ThemeContext";
import ThemedContainer from "../components/ThemedContainer";

export default function ProfileScreen() {
  const { theme } = useContext(ThemeContext);

  const { resetTransactions } = useContext(FinanceContext);

  // const handleReset = () => {
  //   Alert.alert(
  //     "Reset Data",
  //     "Are you sure you want to delete all transactions?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Yes, Reset",
  //         style: "destructive",
  //         onPress: () => resetTransactions(),
  //       },
  //     ],
  //   );
  // }; code works for mobile (Android/iOS not the web. below is the web version of the alert.

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all transactions?",
    );

    if (confirmed) {
      resetTransactions();
    }
  };

  return (
    <ThemedContainer style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Profile</Text>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Reset All Data</Text>
      </TouchableOpacity>

      <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
        <Text style={[styles.infoText, { color: theme.text }]}>
          Finance Tracker v1.0
        </Text>

        <Text style={[styles.infoSub, { color: theme.subText }]}>
          Built with React Native + Expo
        </Text>
      </View>
    </ThemedContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#FFF",
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: "#EF4444",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  resetText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  infoBox: {
    marginTop: 40,
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 16,
  },
  infoText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
  },
  infoSub: {
    color: "#94A3B8",
  },
});
