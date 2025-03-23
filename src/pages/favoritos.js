import Navbar from "../components/navbar";
import styles from "../styles/favoritos.module.css";

export default function Favoritos() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h3>Área Pessoal</h3>
          <ul>
            <li><a href="/minhasCompras">As minhas compras</a></li>
            <li className={styles.active}>Favoritos</li>
            <li><a href="/minhaConta">Gerir a minha conta</a></li>
            <li><a href="/">Sair</a></li>
          </ul>
        </aside>
        <main className={styles.main}>
          <h2>Favoritos</h2>
          <p>(Ainda não tens favoritos guardados)</p>
        </main>
      </div>
    </>
  );
}
