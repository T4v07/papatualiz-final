import React, { useContext } from "react";
import Link from "next/link";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/navbar"; // Importando a Navbar
import styles from "../styles/minhaConta.module.css";

const MinhaConta = () => {
  const { user } = useContext(AuthContext) || {};

  return (
    <div className={styles.pageContainer}>
      {/* Navbar no topo */}
      <Navbar />

      <div className={styles.accountContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.profileSection}>
            {user?.foto ? (
              <img src={user.foto} alt="Foto de perfil" className={styles.profilePhoto} />
            ) : (
              <div className={styles.profileCircle}>
                {user?.nome ? user.nome.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <h3>{user?.nome || "Usuário"}</h3>
            <p className={styles.email}>{user?.email || "email@exemplo.com"}</p>
          </div>

          <nav className={styles.navMenu}>
            <Link href="#">As minhas compras</Link>
            <Link href="#">Favoritos</Link>
            <Link href="#">Gerir a minha conta</Link>
            <Link href="#">Sair</Link>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className={styles.mainContent}>
          <h2>Bem-vindo, {user?.nome || "Usuário"}!</h2>
          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <h3>Todas as compras</h3>
              <p>Não há nenhuma encomenda nos últimos meses.</p>
              <button>Ver compras</button>
            </div>
           
          </div>
        </main>
      </div>
    </div>
  );
};

export default MinhaConta;
