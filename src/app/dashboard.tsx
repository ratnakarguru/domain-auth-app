import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

  const name = user.displayName?.trim();
  const initial = (name || user.email || "?").charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.brand}>Domain Auth</Text>
            <TouchableOpacity
              style={[styles.logoutButton, loggingOut && styles.disabledButton]}
              onPress={handleLogout}
              disabled={loggingOut}
              accessibilityRole="button"
              accessibilityLabel="Log out"
            >
              {loggingOut ? (
                <ActivityIndicator color="#2563EB" />
              ) : (
                <Text style={styles.logoutText}>Logout</Text>
              )}
            </TouchableOpacity>
          </View>

          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

          <View style={styles.card}>
            <Text style={styles.welcome}>Welcome, {name || user.email || "there"}</Text>
            <Text style={styles.description}>You are signed in to your account.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account information</Text>
            <View style={styles.profile}>
              {user.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.avatar}
                  accessibilityLabel="Profile picture"
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>{initial}</Text>
                </View>
              )}
              <View style={styles.profileDetails}>
                <Text style={styles.fieldLabel}>Name</Text>
                <Text style={styles.fieldValue}>{name || "Not provided"}</Text>
                <Text style={styles.fieldLabel}>Email</Text>
                <Text style={styles.fieldValue}>{user.email || "Not provided"}</Text>
              </View>
            </View>
            <View style={styles.verification}>
              <Text style={styles.fieldLabel}>Email verification</Text>
              <Text style={styles.verifiedText}>
                {user.emailVerified ? "Verified" : "Not verified"}
              </Text>
            </View>
          </View>

          <View style={styles.accessCard}>
            <Text style={styles.accessTitle}>Access granted</Text>
            <Text style={styles.accessText}>
              Your signed-in account passed the app&apos;s access check.
            </Text>
          </View>
        </View>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  content: {
    width: "100%",
    maxWidth: 760,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  brand: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "700",
    flexShrink: 1,
  },
  logoutButton: {
    minWidth: 96,
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    borderRadius: 10,
    marginLeft: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  logoutText: {
    color: "#1D4ED8",
    fontSize: 15,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  welcome: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "700",
  },
  description: {
    color: "#6B7280",
    fontSize: 15,
    marginTop: 8,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },
  profile: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#1D4ED8",
    fontSize: 22,
    fontWeight: "700",
  },
  profileDetails: {
    flex: 1,
    marginLeft: 16,
  },
  fieldLabel: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 4,
  },
  fieldValue: {
    color: "#111827",
    fontSize: 16,
    marginBottom: 14,
  },
  verification: {
    borderTopColor: "#E5E7EB",
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 4,
  },
  verifiedText: {
    color: "#1D4ED8",
    fontSize: 15,
    fontWeight: "600",
  },
  accessCard: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  accessTitle: {
    color: "#1D4ED8",
    fontSize: 17,
    fontWeight: "700",
  },
  accessText: {
    color: "#334155",
    fontSize: 14,
    marginTop: 6,
  },
  error: {
    color: "#B91C1C",
    marginBottom: 16,
  },
});
