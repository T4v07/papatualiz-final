// /pages/compra-pendente.js
import styles from "@/styles/sucesso.module.css";
import { FaCheckCircle } from "react-icons/fa";
import Navbar from "@/components/navbar";

export default function CompraPendente() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <FaCheckCircle className={styles.icone} />
          <h2 className={styles.titulo}>Confirmação enviada para o teu e-mail!</h2>
          <p className={styles.texto}>
            Verifica a tua caixa de entrada e clica no link para confirmar a compra.
          </p>
          <p className={styles.texto}>
            ⚠️ <strong>O link expira em 5 minutos.</strong>
          </p>
          <a href="/" className={styles.botao}>Voltar à loja</a>
        </div>
      </div>
    </>
  );
}
