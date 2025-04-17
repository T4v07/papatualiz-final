// pages/login.js
import {useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/navbar";
import styles from "../styles/auth.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const router = useRouter();

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

      login(data.user); // <-- salva user com ID, email, nome etc.
      router.push("/home");
    } catch (err) {
      setError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2 className={styles.title}>Login</h2>
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
          <p className={styles.switch}>
            Ainda não tem uma conta?{" "}
            <Link href="/register">
              <span>Registre-se aqui</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
