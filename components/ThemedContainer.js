import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemedContainer({ children, style, safe }) {
  const { theme } = useContext(ThemeContext);

  const Container = safe ? SafeAreaView : View;

  return (
    <Container
      style={[
        {
          flex: 1,
          backgroundColor: theme.background,
        },
        style,
      ]}
    >
      {children}
    </Container>
  );
}
