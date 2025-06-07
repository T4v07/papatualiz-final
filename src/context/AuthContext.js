import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext(); // exportação default removida

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

 useEffect(() => {
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Erro ao ler user do localStorage:", err);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }
}, []);


  const login = (userData) => {
  const normalizado = {
    ID_utilizador: userData.ID_utilizador || userData.id,
    Nome: userData.Nome || userData.nome,
    Email: userData.Email || userData.email,
    Tipo_de_Conta: userData.Tipo_de_Conta || userData.tipo_de_conta || "Cliente",
  };

  setUser(normalizado);
  localStorage.setItem("user", JSON.stringify(normalizado));
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
