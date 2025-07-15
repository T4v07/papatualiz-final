// pages/servicosLogin.js
import { useState, useContext, useRef, useEffect } from "react";
import { User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/auth.module.css";

export default function ServicosLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const userRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      userRef.current?.focus();
    }, 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (username.length < 3) {
      setError("O nome de utilizador deve ter no mínimo 3 caracteres.");
      return;
    }
    if (password.length < 6) {
      setError("A palavra-passe deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Erro ao fazer login.");
        setLoading(false);
        return;
      }

      console.log("🔐 Dados recebidos do login:", data.user);

      // Corrigido: garantir que os nomes estão no formato certo
      login({
        ID_utilizador: data.user.ID_utilizador,
        nome: data.user.Nome,
        email: data.user.Email,
        tipo_de_conta: data.user.Tipo_de_Conta,
      });

      const tipoConta = data.user?.Tipo_de_Conta?.toLowerCase();
      if (tipoConta === "admin") {
        router.push("/areaAdmin");
      } else if (tipoConta === "funcionario") {
        router.push("/areaFuncionario");
      } else {
        setError("Acesso não autorizado.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
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

      <div className={styles.formSide}>
        <div className={styles.authCard}>
          <h1 className={styles.brand}>SPORT’S ET</h1>
          <h2 className={styles.title}>Área de Serviços</h2>
          <p className={styles.subtitle}>Login para funcionários e administradores</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <span className={styles.icon}><User size={18} /></span>
              <input
                type="text"
                placeholder="nome de utilizador"
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

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Entrando..." : "ENTRAR"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
