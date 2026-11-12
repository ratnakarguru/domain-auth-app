
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginWithGoogle } from "../services/authService";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>H</Text>
          </View>

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Sign in with an authorized Google account to continue.
          </Text>

          <TouchableOpacity
            style={[styles.googleButton, loading && styles.disabledButton]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>
                Continue with Google
              </Text>
            )}
          </TouchableOpacity>

          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

          <Text style={styles.restriction}>
            Access is limited to authorized accounts.
          </Text>
        </View>

        <Text style={styles.footer}>
          Secure Company Portal
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 30,
    lineHeight: 23,
  },
  googleButton: {
    backgroundColor: "#2563EB",
    width: "100%",
    padding: 16,
    borderRadius: 10,
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
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  restriction: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 22,
    textAlign: "center",
  },
  footer: {
    marginTop: 25,
    color: "#9CA3AF",
    fontSize: 12,
  },
});
