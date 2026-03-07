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
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart } from "react-native-chart-kit";
import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import ThemedContainer from "../components/ThemedContainer";
import { ThemeContext } from "../context/ThemeContext";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { theme } = useContext(ThemeContext);
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

  return (
    <ThemedContainer safe>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: theme.text }]}>Dashboard</Text>

        {/* Animated Balance Card */}
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View
            style={[
              [styles.card, { backgroundColor: theme.card }],
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Text style={styles.cardTitle}>Total Balance</Text>
            <Text style={styles.balance}>
              ₦ {totalBalance.toLocaleString()}
            </Text>
          </Animated.View>
        </Pressable>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Ionicons name="arrow-down-circle" size={28} color="#22C55E" />
            <Text style={styles.statAmount}>
              ₦ {totalIncome.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Income</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Ionicons name="arrow-up-circle" size={28} color="#EF4444" />
            <Text style={styles.statAmount}>
              ₦ {totalExpense.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
        </View>

        {/* Chart Section */}
        <Text style={styles.sectionTitle}>Spending Overview</Text>

        <View style={[styles.chartContainer, { backgroundColor: theme.card }]}>
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [
                {
                  data: [200, 180, 220, 190, 250, 230],
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
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

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
                <Text style={styles.categoryBadge}>{item.category}</Text>
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
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
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
