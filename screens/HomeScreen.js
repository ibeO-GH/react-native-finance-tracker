import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { ThemeContext } from "../context/ThemeContext";
import ThemedContainer from "../components/ThemedContainer";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { darkMode, toggleTheme, theme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { transactions, totalIncome, totalExpense, totalBalance } =
    useContext(FinanceContext);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const { deleteTransaction } = useContext(FinanceContext);

  const monthlyExpenses = Array(12).fill(0);

  transactions.forEach((t) => {
    if (t.type === "expense") {
      const month = new Date(t.date).getMonth();
      monthlyExpenses[month] += t.amount;
    }
  });

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentMonth = new Date().getMonth();

  const chartLabels = [];
  const chartValues = [];

  for (let i = 5; i >= 0; i--) {
    const index = (currentMonth - i + 12) % 12;
    chartLabels.push(monthNames[index]);
    chartValues.push(monthlyExpenses[index]);
  }

  const chartValuesSafe = chartValues.every((v) => v === 0)
    ? [1, 1, 1, 1, 1, 1]
    : chartValues;

  return (
    <ThemedContainer safe>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={[styles.header, { color: theme.text }]}>Dashboard</Text>

          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons
              name={darkMode ? "sunny" : "moon"}
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>

        {/* Animated Balance Card */}
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.subText }]}>
              Total Balance
            </Text>
            <Text style={[styles.balance, { color: theme.text }]}>
              ₦ {totalBalance.toLocaleString()}
            </Text>
          </Animated.View>
        </Pressable>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Ionicons name="arrow-down-circle" size={28} color="#22C55E" />
            <Text style={[styles.statAmount, { color: theme.text }]}>
              ₦ {totalIncome.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>
              Income
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Ionicons name="arrow-up-circle" size={28} color="#EF4444" />
            <Text style={[styles.statAmount, { color: theme.text }]}>
              ₦ {totalExpense.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>
              Expenses
            </Text>
          </View>
        </View>

        {/* Chart Section */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Spending Overview
        </Text>

        <View style={styles.chartContainer}>
          <LineChart
            data={{
              labels: chartLabels,
              datasets: [
                {
                  data: chartValuesSafe,
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#1E293B",
              backgroundGradientTo: "#1E293B",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: () => "#94A3B8",
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#6366F1",
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Transactions */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Recent Transactions
        </Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <View style={styles.deleteBox}>
                  <Text style={styles.deleteText}>Delete</Text>
                </View>
              )}
              onSwipeableOpen={() => deleteTransaction(item.id)}
            >
              <View
                style={[styles.transaction, { backgroundColor: theme.card }]}
              >
                <Text style={styles.transactionText}>{item.title}</Text>
                <Text style={[styles.categoryBadge, { color: theme.accent }]}>
                  {item.category}
                </Text>
                <Text
                  style={
                    item.type === "income" ? styles.income : styles.expense
                  }
                >
                  {item.type === "income" ? "+ " : "- "}₦{" "}
                  {item.amount.toLocaleString()}
                </Text>
              </View>
            </Swipeable>
          )}
        />
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AddTransaction")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </ThemedContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#94A3B8",
    fontSize: 14,
  },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#1E293B",
    flex: 0.48,
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  statAmount: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginTop: 5,
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  chartContainer: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  transaction: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  transactionText: {
    color: "#FFFFFF",
  },
  income: {
    color: "#22C55E",
    fontWeight: "bold",
  },
  expense: {
    color: "#EF4444",
    fontWeight: "bold",
  },
  categoryBadge: {
    color: "#38BDF8",
    fontSize: 12,
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#6366F1",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  fabText: {
    fontSize: 30,
    color: "#FFF",
  },
  deleteBox: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
