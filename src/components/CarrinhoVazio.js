import Link from "next/link";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import styles from "./CarrinhoVazio.module.css";
import Image from "next/image";

export default function CarrinhoVazio({ modo = "pagina" }) {
  const { user } = useContext(AuthContext);

  if (modo === "box") {
    return (
      <section className={styles.leftBox}>
        <h2>O carrinho está vazio</h2>
        <p>Adicione alguns produtos para ver o resumo da sua compra.</p>
        <Link href="/pesquisa" className={styles.botaoLink}>
          Explorar produtos
        </Link>
      </section>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.linkHeader}>
          &larr; Continuar a comprar
        </Link>

        <div className={styles.logoContainer}>
          <Image
            src="/logo3.png"
            alt="Logo SportSet"
            width={180}
            height={48}
            className={styles.logo}
            priority
          />
        </div>

        <span className={styles.user}>
          {user?.nome ? `Olá, ${user.nome}` : ""}
        </span>
      </header>

      {/* Barra de progresso */}
      <div className={styles.progressBar}>
        <div className={styles.steps}>
          {["Carrinho", "Entrega", "Pagamento"].map((etapa, index) => (
            <div key={etapa} className={styles.step}>
              <div
                className={`${styles.stepNumber} ${
                  index === 0 ? styles.stepActive : styles.stepInactive
                }`}
              >
                {index + 1}
              </div>
              {etapa}
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className={styles.main}>
        <section className={styles.leftBox}>
          <h2>Ainda não existem artigos</h2>
          <p>Adicione os seus produtos favoritos e continue com a compra.</p>
          <Link href="/pesquisa" className={styles.botaoLink}>
            Explorar produtos
          </Link>
        </section>

        <aside className={styles.rightBox}>
          <h3>Resumo da encomenda</h3>
          <div className={styles.resumoLinha}>
            <span>Subtotal (0 artigos)</span>
            <span>0,00 €</span>
          </div>
          <div className={styles.resumoLinha}>
            <span>Entrega</span>
            <span>-</span>
          </div>
          <div className={styles.resumoTotal}>
            <span>Total com IVA incluído</span>
            <span>0,00 €</span>
          </div>
        </aside>
      </main>
    </div>
  );
}
