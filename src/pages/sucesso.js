// /pages/sucesso.js
import Link from "next/link";
import Navbar from "@/components/navbar";
import styles from "@/styles/sucesso.module.css";

export default function SucessoPage() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>✅ Compra efetuada com sucesso!</h1>
        <p>Obrigado pela tua compra. Receberás um email com os detalhes em breve.</p>
        <Link href="/" className={styles.botao}>
          Voltar à loja
        </Link>
      </div>
    </>
  );
}
