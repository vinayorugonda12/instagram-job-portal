import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticated =
      sessionStorage.getItem("admin_authenticated") === "true";

    setAdminAuthenticated(authenticated);
    setLoading(false);
  }, []);

  function adminLogin() {
    sessionStorage.setItem("admin_authenticated", "true");
    setAdminAuthenticated(true);
  }

  function adminLogout() {
    sessionStorage.removeItem("admin_authenticated");
    setAdminAuthenticated(false);
  }

  const value = {
    adminAuthenticated,
    loading,
    adminLogin,
    adminLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}