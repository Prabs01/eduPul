import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // safe parse helper
  const safeParse = (value) => {
    try {
      if (!value || value === "undefined") return null;
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  // load auth on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = safeParse(localStorage.getItem("user"));

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    }

    setLoading(false);
  }, []);

  // login function
  const login = (data) => {
    if (!data?.access) {
      console.error("Invalid login response:", data);
      return;
    }else if (!data?.user) {
        console.error("User not registered", data);
        return;
    }

    localStorage.setItem("token", data.access);
    localStorage.setItem("refresh", data.refresh || "");
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.access);
    setUser(data.user);
  };

  // logout function
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);