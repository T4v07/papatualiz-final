// pages/servicosLogin.js
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/navbar";
import styles from "../styles/auth.module.css";

export default function ServicosLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext); // <- IMPORTANTE

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro ao fazer login");
        return;
      }

      login(data.user); // <- SALVAR NO CONTEXTO!

      const tipoConta = data.user?.Tipo_de_Conta?.toLowerCase();
      if (tipoConta === "admin") {
        router.push("/areaAdmin");
      } else if (tipoConta === "funcionario") {
        router.push("/areaFuncionario");
      } else {
        setError("Acesso não autorizado.");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2 className={styles.title}>Área de Serviços</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitButton}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
