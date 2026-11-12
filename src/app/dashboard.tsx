import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";

export default function Dashboard() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
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
  const compact = width < 640;
  const signedInWithGoogle = user.providerData.some(
    (provider) => provider.providerId === "google.com"
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, compact && styles.scrollContentCompact]}
      >
        <View style={styles.content}>
          <View style={[styles.header, compact && styles.headerCompact]}>
            <View style={styles.brandGroup}>
              <View style={styles.brandMark}>
                <Text style={styles.brandInitial}>D</Text>
              </View>
              <Text style={styles.brand}>Domain Auth</Text>
            </View>
            <View style={[styles.headerActions, compact && styles.headerActionsCompact]}>
              <View style={styles.activePage}>
                <Text style={styles.activePageText}>Dashboard</Text>
              </View>
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
          </View>

          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

          <View style={styles.pageHeading}>
            <Text style={styles.pageTitle}>Dashboard</Text>
            <Text style={styles.pageSubtitle}>Account overview</Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.welcome}>Welcome, {name || user.email || "there"}</Text>
            <Text style={styles.heroDescription}>You are signed in to your account.</Text>
          </View>

          <View style={[styles.summary, compact && styles.summaryCompact]}>
            <View style={[styles.summaryCard, !compact && styles.summaryCardWide]}>
              <Text style={styles.summaryLabel}>Access</Text>
              <Text style={styles.summaryValue}>Granted</Text>
              <Text style={styles.summaryNote}>This dashboard is protected.</Text>
            </View>
            <View style={[styles.summaryCard, !compact && styles.summaryCardWide]}>
              <Text style={styles.summaryLabel}>Email</Text>
              <Text style={styles.summaryValue}>
                {user.emailVerified ? "Verified" : "Not verified"}
              </Text>
              <Text style={styles.summaryNote}>Firebase account status</Text>
            </View>
            {signedInWithGoogle && (
              <View style={[styles.summaryCard, !compact && styles.summaryCardWide]}>
                <Text style={styles.summaryLabel}>Sign-in method</Text>
                <Text style={styles.summaryValue}>Google</Text>
                <Text style={styles.summaryNote}>Connected provider</Text>
              </View>
            )}
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

          <View style={styles.footer}>
            <Text style={styles.footerText}>Domain Auth • React Native + Firebase</Text>
            <Text style={styles.footerText}>Authentication demo</Text>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  scrollContentCompact: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },
  headerCompact: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minWidth: 0,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  brandInitial: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },
  brand: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "700",
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionsCompact: {
    justifyContent: "space-between",
    marginTop: 16,
  },
  activePage: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activePageText: {
    color: "#1D4ED8",
    fontSize: 14,
    fontWeight: "700",
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
  },
  disabledButton: {
    opacity: 0.7,
  },
  logoutText: {
    color: "#1D4ED8",
    fontSize: 15,
    fontWeight: "600",
  },
  pageHeading: {
    marginBottom: 18,
  },
  pageTitle: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "700",
  },
  pageSubtitle: {
    color: "#6B7280",
    fontSize: 15,
    marginTop: 4,
  },
  hero: {
    backgroundColor: "#1E3A8A",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  welcome: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    flexShrink: 1,
  },
  heroDescription: {
    color: "#DBEAFE",
    fontSize: 15,
    marginTop: 8,
  },
  summary: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
    width: "100%",
  },
  summaryCompact: {
    flexDirection: "column",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  summaryCardWide: {
    flex: 1,
    minWidth: 0,
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 13,
  },
  summaryValue: {
    color: "#1D4ED8",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },
  summaryNote: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 6,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
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
    minWidth: 0,
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
  footer: {
    marginTop: "auto",
    borderTopColor: "#D1D5DB",
    borderTopWidth: 1,
    paddingTop: 20,
    paddingBottom: 8,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 13,
    marginBottom: 4,
  },
  error: {
    color: "#B91C1C",
    marginBottom: 16,
  },
});
