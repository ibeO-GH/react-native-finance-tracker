import StackNavigator from "./navigation/StackNavigator";
import { FinanceProvider } from "./context/FinanceContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <StackNavigator />
      </FinanceProvider>
    </ThemeProvider>
  );
}
