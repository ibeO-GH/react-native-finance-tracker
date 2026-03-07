import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FinanceContext } from "../context/FinanceContext";

export default function AddTransactionScreen({ navigation }) {
  const [category, setCategory] = useState("Other");
  const { addTransaction } = useContext(FinanceContext);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = () => {
    if (!title || !amount) return;

    addTransaction({
      id: Date.now().toString(),
      title,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString(),
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Add Transaction</Text>

        <TextInput
          placeholder="Title"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Amount"
          placeholderTextColor="#94A3B8"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeButton, type === "income" && styles.activeType]}
            onPress={() => setType("income")}
          >
            <Text style={styles.typeText}>Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, type === "expense" && styles.activeType]}
            onPress={() => setType("expense")}
          >
            <Text style={styles.typeText}>Expense</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Category</Text>

          <View style={styles.categoryRow}>
            {[
              "Salary",
              "Food",
              "Transport",
              "Bills",
              "Shopping",
              "Investment",
              "Other",
            ].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  category === item && styles.categorySelected,
                ]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === item && styles.categoryTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: "#FFF",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    color: "#FFF",
    marginBottom: 15,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryContainer: {
    marginTop: 20,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryButton: {
    backgroundColor: "#1E293B",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 10,
  },

  categorySelected: {
    backgroundColor: "#38BDF8",
  },

  categoryText: {
    color: "#94A3B8",
    fontSize: 12,
  },

  categoryTextSelected: {
    color: "#0F172A",
    fontWeight: "bold",
  },
  typeButton: {
    flex: 0.48,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#1E293B",
    alignItems: "center",
  },
  activeType: {
    backgroundColor: "#6366F1",
  },
  typeText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#22C55E",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: {
    color: "#000",
    fontWeight: "bold",
  },
});
