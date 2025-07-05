import { useState } from "react";
import { Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "../styles/auth.module.css"; // aproveita o mesmo estilo do login/register

export default function RedefinirPassword() {
  const [codigo, setCodigo] = useState("");
  const [novaPassword, setNovaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState(""); // "erro" ou "sucesso"

  const handleRedefinir = async () => {
    setMensagem("");
    if (!codigo || !novaPassword || !confirmarPassword) {
      setMensagem("Preencha todos os campos.");
      setTipo("erro");
      return;
    }

    if (novaPassword !== confirmarPassword) {
      setMensagem("As senhas não coincidem.");
      setTipo("erro");
      return;
    }

    if (novaPassword.length < 6) {
      setMensagem("A nova senha deve ter pelo menos 6 caracteres.");
      setTipo("erro");
      return;
    }

    try {
      const res = await fetch("/api/redefinir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, novaPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensagem(data.message || "Erro ao redefinir.");
        setTipo("erro");
        return;
      }

      setMensagem("Senha redefinida com sucesso! Redirecionando...");
      setTipo("sucesso");

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch {
      setMensagem("Erro ao conectar. Tente mais tarde.");
      setTipo("erro");
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
        <Link href="/" className={styles.backOverlay}>
          <ArrowLeft size={18} />
          Voltar
        </Link>
      </div>

      <div className={styles.formSide}>
        <div className={styles.authCard}>
          <h2 className={styles.title}>Redefinir Senha</h2>
          <p className={styles.subtitle}>
            Insira o código recebido e escolha uma nova senha.
          </p>

          {mensagem && (
            <div
              className={styles.error}
              style={{
                background: tipo === "erro" ? "#ffe5e5" : "#e5ffe8",
                color: tipo === "erro" ? "#d8000c" : "#007e33",
                borderLeft: `4px solid ${tipo === "erro" ? "#d8000c" : "#007e33"}`,
              }}
            >
              {mensagem}
            </div>
          )}

          <div className={styles.form}>
            <div className={styles.inputGroup}>
              <span className={styles.icon}><ShieldCheck size={18} /></span>
              <input
                type="text"
                placeholder="Código recebido"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.icon}><Lock size={18} /></span>
              <input
                type="password"
                placeholder="Nova palavra-passe"
                value={novaPassword}
                onChange={(e) => setNovaPassword(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <span className={styles.icon}><Lock size={18} /></span>
              <input
                type="password"
                placeholder="Confirmar nova palavra-passe"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
              />
            </div>

            <button className={styles.submitButton} onClick={handleRedefinir}>
              Redefinir palavra-passe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
