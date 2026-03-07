import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TabsNavigator from "./TabsNavigator";
import AddTransactionScreen from "../screens/AddTransactionScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabsNavigator} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
