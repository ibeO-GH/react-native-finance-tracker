import { View, Text, StyleSheet } from "react-native";

export default function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This is where your powerful content lives.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});
