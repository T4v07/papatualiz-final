// pages/login.js
import { useState, useContext } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../components/navbar";
import styles from "../styles/auth.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Preencha todos os campos.");
      return;
    }

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

      login(data.user);
      router.push("/home");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.splitContainer}>
        <div
          className={styles.imageSide}
          style={{
            backgroundImage: 'url("https://res.cloudinary.com/dk56q7rsl/image/upload/v1750469378/login-banner1_c0nitz.jpg")',
          }}
        ></div>

        <div className={styles.formSide}>
          <div className={styles.authCard}>
            <h1 className={styles.brand}>SPORT’S ET</h1>
            <h2 className={styles.title}>Bem-vindo de volta</h2>
            <p className={styles.subtitle}>Faça login para continuar</p>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.inputGroup}>
                <span className={styles.icon}><User size={18} /></span>
                <input
                  type="text"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.icon}><Lock size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className={styles.toggleIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <button type="submit" className={styles.submitButton}>
                ENTRAR
              </button>
            </form>

            <p className={styles.switch}>
              Ainda não tem uma conta?{" "}
              <Link href="/register"><span>Registre-se aqui</span></Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
