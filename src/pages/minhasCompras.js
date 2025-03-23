import Navbar from "../components/navbar";
import styles from "../styles/minhasCompras.module.css";

export default function MinhasCompras() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h3>Área Pessoal</h3>
          <ul>
            <li className={styles.active}>As minhas compras</li>
            <li><a href="/favoritos">Favoritos</a></li>
            <li><a href="/minhaConta">Gerir a minha conta</a></li>
            <li><a href="/">Sair</a></li>
          </ul>
        </aside>
        <main className={styles.main}>
          <h2>As minhas compras</h2>
          <p>(Ainda não tens compras registradas)</p>
        </main>
      </div>
    </>
  );
}
