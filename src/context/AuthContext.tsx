
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../config/firebase";
import { isAllowedDomain } from "../utils/domainValidator";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const allowed = !!currentUser?.emailVerified &&
        !!currentUser.email && isAllowedDomain(currentUser.email);
      setUser(allowed ? currentUser : null);
      setLoading(false);

      if (currentUser && !allowed) {
        void signOut(auth).catch((error) => {
          console.error("Could not clear rejected Firebase session:", error);
        });
      }
    }, (error) => {
      console.error("Could not restore Firebase session:", error);
      setUser(null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
