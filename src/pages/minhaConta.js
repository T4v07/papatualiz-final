// pages/minhaConta.js
import React from "react";
import Link from "next/link";
import styles from "../styles/minhaConta.module.css";

const MinhaConta = () => {
  return (
    <div className={styles.accountContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.profileSection}>
          {/* Bolinha com iniciais, por exemplo */}
          <div className={styles.profileCircle}>ET</div>
          <h3>Emanuel Tavares</h3>
          <p>emanuelfredericotavares@gmail.com</p>
        </div>

        <nav className={styles.navMenu}>
          <Link href="#">Programa de fidelização</Link>
          <Link href="#">As minhas compras</Link>
          <Link href="#">Favoritos</Link>
          <Link href="#">Gerir a minha conta</Link>
          <Link href="#">Sair</Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className={styles.mainContent}>
        <h2>Bem-vindo, Emanuel!</h2>
        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <h3>Todas as compras</h3>
            <p>Não há nenhuma encomenda nos últimos meses.</p>
            <button>Ver compras</button>
          </div>

          <div className={styles.card}>
            <h3>O meu perfil</h3>
            <p>Complete 20% do seu perfil e ganhe vantagens!</p>
            <button>Atualizar o meu perfil</button>
          </div>

          <div className={styles.card}>
            <h3>Pontos e recompensas</h3>
            <p>Você tem 0 pontos acumulados.</p>
            <button>Ver detalhes</button>
          </div>

          <div className={styles.card}>
            <h3>Devolução</h3>
            <p>O seu produto Decathlon garante direito de devolução.</p>
            <button>Como fazer uma devolução?</button>
          </div>

          <div className={styles.card}>
            <h3>NIF</h3>
            <p>Registe o seu NIF para faturas.</p>
            <button>Alterar NIF</button>
          </div>

          <div className={styles.card}>
            <h3>Aplicação Decathlon</h3>
            <p>Faça as suas compras onde estiver.</p>
            <button>Saiba mais</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MinhaConta;
