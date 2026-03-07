import React, { createContext, useState, useMemo } from "react";
import { initialTransactions } from "../data/transactions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    saveTransactions();
  }, [transactions]);

  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem("transactions");
      if (stored !== null) {
        setTransactions(JSON.parse(stored));
      } else {
        setTransactions(initialTransactions);
      }
    } catch (e) {
      console.log("Error loading transactions");
    }
  };

  const saveTransactions = async () => {
    try {
      await AsyncStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (e) {
      console.log("Error saving transactions");
    }
  };

  const addTransaction = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalBalance = totalIncome - totalExpense;

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const resetTransactions = () => {
    setTransactions([]);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        resetTransactions,
        totalIncome,
        totalExpense,
        totalBalance,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
