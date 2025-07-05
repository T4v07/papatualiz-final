import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "../styles/auth.module.css";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState(""); // "sucesso" ou "erro"

  const handleEnviar = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (!email.trim()) {
      setMensagem("Por favor, insira o seu e-mail.");
      setTipoMensagem("erro");
      return;
    }

    try {
      const res = await fetch("/api/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensagem(data.message || "Erro ao enviar o código.");
        setTipoMensagem("erro");
      } else {
        setMensagem("Código enviado para o seu e-mail.");
        setTipoMensagem("sucesso");

        // Redireciona para redefinir após 2 segundos
        setTimeout(() => {
          window.location.href = "/redefinir";
        }, 2000);
      }
    } catch {
      setMensagem("Erro de conexão. Tente novamente.");
      setTipoMensagem("erro");
    }
  };

  return (
    <div className={styles.splitContainer}>
      <div
        className={styles.imageSide}
        style={{
          backgroundImage:
            'url("https://res.cloudinary.com/dk56q7rsl/image/upload/v1750937335/tom-briskey-HM3WZ4B1gvM-unsplash_g5ztsn.jpg")',
        }}
      >
        <Link href="/login" className={styles.backOverlay}>
          <ArrowLeft size={18} />
          Voltar ao login
        </Link>
      </div>

      <div className={styles.formSide}>
        <div className={styles.authCard}>
          <h1 className={styles.brand}>SPORT’S ET</h1>
          <h2 className={styles.title}>Recuperar Acesso</h2>
          <p className={styles.subtitle}>Informe o seu e-mail para continuar</p>

          {mensagem && (
            <div
              className={styles.error}
              style={{
                backgroundColor: tipoMensagem === "sucesso" ? "#e0ffe3" : "#ffe5e5",
                borderLeft: tipoMensagem === "sucesso" ? "4px solid #2e7d32" : "4px solid #d8000c",
                color: tipoMensagem === "sucesso" ? "#2e7d32" : "#d8000c",
              }}
            >
              {mensagem}
            </div>
          )}

          <form onSubmit={handleEnviar} className={styles.form}>
            <div className={styles.inputGroup}>
              <span className={styles.icon}><Mail size={18} /></span>
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Enviar Código
            </button>
          </form>

          <div className={styles.switch}>
            <p>
              Lembrou da palavra-passe?{" "}
              <Link href="/login"><span>Entrar aqui</span></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
