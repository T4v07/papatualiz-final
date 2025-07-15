// context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      console.log("useEffect AuthProvider, storedUser:", storedUser);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Erro ao ler user do localStorage:", err);
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const normalizado = {
      ID_utilizador: userData.ID_utilizador || userData.id || userData.ID || null,
      nome: userData.nome || userData.Nome || "",
      email: userData.email || userData.Email || "",
      tipo_de_conta: userData.tipo_de_conta || userData.Tipo_de_Conta || "Cliente",
    };
    console.log("👤 login function normalizado user:", normalizado);
    setUser(normalizado);
    localStorage.setItem("user", JSON.stringify(normalizado));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
