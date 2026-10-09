import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#080A0F" />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#080A0F" },
        animation: "fade"
      }} />
    </>
  );
}
