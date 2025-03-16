import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import styles from "../styles/auth.module.css";

export default function VerifyEmail() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState(router.query.email || ""); // Captura o e-mail da URL automaticamente
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
    }
  }, [router.query.email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login"); // Redireciona para login após sucesso
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Erro ao verificar código:", err);
      setError("Erro ao verificar código. Tente novamente.");
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Digite seu e-mail primeiro para reenviar o código.");
      return;
    }

    setError("");
    setResendMessage("Enviando novo código...");

    try {
      const response = await fetch("/api/resendCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setResendMessage("Novo código enviado para o seu e-mail!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Erro ao reenviar código:", err);
      setError("Erro ao reenviar código. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2 className={styles.title}>Verificar E-mail</h2>
          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>Conta verificada com sucesso! Redirecionando...</div>}
          {resendMessage && <div className={styles.success}>{resendMessage}</div>}

          <form onSubmit={handleVerify} className={styles.form}>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Código de Verificação"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitButton}>Verificar</button>
          </form>

          <button onClick={handleResendCode} className={styles.resendButton}>Reenviar Código</button>
        </div>
      </div>
    </>
  );
}
