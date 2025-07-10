// pages/servicosLogin.js
import { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar";
import styles from "@/styles/auth.module.css";

export default function ServicosLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return; // evita múltiplos cliques
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      login(data.user);

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
    } finally {
      setLoading(false);
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
              autoComplete="username"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
