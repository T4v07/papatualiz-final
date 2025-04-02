import Navbar from "../components/navbar";
import SidebarConta from "../components/SidebarConta";
import styles from "../styles/minhaConta.module.css";

export default function MinhasCompras() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="compras" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>As minhas compras</h2>
            <p>(Ainda não tens compras registradas)</p>
          </section>
        </main>
      </div>
    </div>
  );
}
