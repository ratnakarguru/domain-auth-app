
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";

export default function Dashboard() {
  const { user } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogout = async () => {
    setErrorMessage(null);
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (!user) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>

      <Text style={styles.subtitle}>
        {user.email}
      </Text>

      <Text style={styles.message}>
        You are logged into the company portal.
      </Text>

      <TouchableOpacity
        style={[styles.button, loggingOut && styles.disabledButton]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Logout</Text>}
      </TouchableOpacity>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#F4F6FA",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    marginTop: 15,
    color: "#2563EB",
  },
  message: {
    marginTop: 15,
    color: "#6B7280",
  },
  button: {
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: 180,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  error: {
    color: "#B91C1C",
    textAlign: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
