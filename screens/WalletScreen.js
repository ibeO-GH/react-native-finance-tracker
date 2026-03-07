import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FinanceContext } from "../context/FinanceContext";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { ThemeContext } from "../context/ThemeContext";

export default function WalletScreen() {
  const { theme } = useContext(ThemeContext);

  const { transactions, totalBalance, totalIncome, totalExpense } =
    useContext(FinanceContext);

  const savingsRate =
    totalIncome === 0
      ? 0
      : (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1);
  const total = totalIncome + totalExpense;

  const incomePercent = total === 0 ? 0 : (totalIncome / total) * 100;

  const expensePercent = total === 0 ? 0 : (totalExpense / total) * 100;

  const screenWidth = Dimensions.get("window").width;

  const expenseTransactions = transactions.filter((t) => t.type === "expense");

  const categoryTotals = {};

  expenseTransactions.forEach((t) => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = 0;
    }
    categoryTotals[t.category] += t.amount;
  });

  const chartData = Object.keys(categoryTotals).map((category, index) => {
    const colors = [
      "#EF4444",
      "#F97316",
      "#EAB308",
      "#22C55E",
      "#3B82F6",
      "#A855F7",
      "#14B8A6",
    ];

    return {
      name: category,
      amount: categoryTotals[category],
      color: colors[index % colors.length],
      legendFontColor: "#FFF",
      legendFontSize: 12,
    };
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Overview</Text>

      <Text style={styles.balance}>₦ {totalBalance.toLocaleString()}</Text>

      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.label}>Income</Text>
          <Text style={styles.income}>₦ {totalIncome.toLocaleString()}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Expense</Text>
          <Text style={styles.expense}>₦ {totalExpense.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.savingsBox}>
        <Text style={styles.label}>Savings Rate</Text>
        <Text style={styles.savings}>{savingsRate}%</Text>
      </View>
      <View style={styles.breakdownContainer}>
        <Text style={styles.label}>Income vs Expense</Text>

        <View style={styles.bar}>
          <View style={[styles.incomeBar, { width: `${incomePercent}%` }]} />
          <View style={[styles.expenseBar, { width: `${expensePercent}%` }]} />
        </View>

        <View style={styles.percentRow}>
          <Text style={styles.income}>{incomePercent.toFixed(1)}%</Text>
          <Text style={styles.expense}>{expensePercent.toFixed(1)}%</Text>
        </View>
      </View>

      {chartData.length > 0 && (
        <View style={{ marginTop: 40 }}>
          <Text style={styles.label}>Expense Breakdown</Text>

          <PieChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#0F172A",
              backgroundGradientFrom: "#0F172A",
              backgroundGradientTo: "#0F172A",
              color: () => `#FFF`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0F172A",
  },
  title: {
    fontSize: 22,
    color: "#FFF",
    marginBottom: 20,
  },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#22C55E",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  box: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 16,
    width: "48%",
  },
  label: {
    color: "#94A3B8",
    marginBottom: 10,
  },
  income: {
    color: "#22C55E",
    fontSize: 18,
  },
  expense: {
    color: "#EF4444",
    fontSize: 18,
  },
  savingsBox: {
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  savings: {
    fontSize: 28,
    color: "#38BDF8",
    fontWeight: "bold",
  },
  breakdownContainer: {
    marginTop: 30,
  },

  bar: {
    height: 20,
    flexDirection: "row",
    backgroundColor: "#334155",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },

  incomeBar: {
    backgroundColor: "#22C55E",
  },

  expenseBar: {
    backgroundColor: "#EF4444",
  },

  percentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
