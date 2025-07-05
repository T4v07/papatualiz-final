import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "../styles/auth.module.css"; // usamos o mesmo CSS do login

export default function Verifcemail() {
  const router = useRouter();
  const { email: emailQuery } = router.query;

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState(""); // sucesso ou erro
  const [reenviando, setReenviando] = useState(false);

  useEffect(() => {
    if (emailQuery) setEmail(emailQuery);
  }, [emailQuery]);

  const handleVerificar = () => {
    if (!codigo || codigo.trim().length < 6) {
      setMensagem("O código deve ter pelo menos 6 dígitos.");
      setTipoMensagem("erro");
      return;
    }

    if (codigo.trim() === "123456") {
      setMensagem("✅ Código verificado com sucesso!");
      setTipoMensagem("sucesso");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setMensagem("❌ Código inválido. Tente novamente.");
      setTipoMensagem("erro");
    }
  };

  const handleReenviar = () => {
    setReenviando(true);
    setMensagem(`Código reenviado com sucesso para ${email}`);
    setTipoMensagem("sucesso");

    setTimeout(() => {
      setReenviando(false);
    }, 3000);
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

      {/* Formulário de verificação */}
      <div className={styles.formSide}>
        <div className={styles.authCard}>
          <h1 className={styles.brand}>SPORT’S ET</h1>
          <h2 className={styles.title}>Verificar E-mail</h2>
          <p className={styles.subtitle}>
            Introduz o código que foi enviado para o teu e-mail.
          </p>

          {mensagem && (
            <div
              className={styles.error}
              style={{
                background: tipoMensagem === "sucesso" ? "#e1f9e4" : "#ffe5e5",
                color: tipoMensagem === "sucesso" ? "#207d36" : "#d8000c",
                borderLeft:
                  tipoMensagem === "sucesso"
                    ? "4px solid #207d36"
                    : "4px solid #d8000c",
              }}
            >
              {mensagem}
            </div>
          )}

          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                readOnly
                placeholder="Email"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Código de Verificação"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                maxLength={6}
              />
            </div>

            <button
              type="button"
              className={styles.submitButton}
              onClick={handleVerificar}
            >
              Verificar
            </button>

            <button
              type="button"
              className={styles.submitButton}
              onClick={handleReenviar}
              disabled={reenviando}
              style={{ marginTop: "10px", backgroundColor: "#e0e0e0", color: "#333" }}
            >
              {reenviando ? "Aguarde..." : "Reenviar Código"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
