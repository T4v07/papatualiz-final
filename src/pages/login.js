import { useState, useContext, useRef } from "react";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/auth.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const userRef = useRef(null);

  // Foco automático no campo de usuário
  useState(() => {
    setTimeout(() => {
      userRef.current?.focus();
    }, 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (username.length < 3) {
      setError("O nome de usuário deve ter no mínimo 3 caracteres.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Erro ao fazer login");
        setIsLoading(false);
        return;
      }

      // ✅ Salva o ID do utilizador no localStorage para o carrinho funcionar
      localStorage.setItem("usuarioId", data.user.ID_utilizador);

      login(data.user);
      router.push("/home");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      {/* Lado da imagem com botão Voltar */}
      <div
        className={styles.imageSide}
        style={{
          backgroundImage:
            'url("https://res.cloudinary.com/dk56q7rsl/image/upload/v1750469378/login-banner1_c0nitz.jpg")',
        }}
      >
        <Link href="/" className={styles.backOverlay}>
          <ArrowLeft size={18} style={{ marginRight: 6 }} />
          Voltar
        </Link>
      </div>

      {/* Lado do formulário */}
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
                placeholder="nome de utilizador ou email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ref={userRef}
                maxLength={30}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.icon}><Lock size={18} /></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="palavra-passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={40}
                required
              />
              <span
                className={styles.toggleIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Aguarde..." : "ENTRAR"}
            </button>
          </form>

          <div className={styles.switch}>
            <p>
              Ainda não tem uma conta?{" "}
              <Link href="/register"><span>Registre-se aqui</span></Link>
            </p>
            <p>
              Esqueceu a senha?{" "}
              <Link href="/recuperar"><span>Recuperar password</span></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
