// /pages/sucesso.js
import Navbar from "@/components/navbar";
import styles from "@/styles/sucesso.module.css";
import { FaCheckCircle } from "react-icons/fa";

export default function SucessoPage() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <FaCheckCircle className={styles.icone} />
          <h2 className={styles.titulo}>✅ Encomenda finalizada com sucesso!</h2>
          <p className={styles.texto}>
            Obrigado pela tua compra. Receberás um e-mail com o resumo da encomenda,
            produtos comprados e o código de rastreio.
          </p>
          <p className={styles.texto}>
            Qualquer dúvida, entra em contacto com o nosso suporte.
          </p>
          <a href="/" className={styles.botao}>Voltar à loja</a>
        </div>
      </div>
    </>
  );
}
