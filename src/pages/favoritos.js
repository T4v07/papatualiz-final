import Navbar from "../components/navbar";
import SidebarConta from "../components/SidebarConta";
import styles from "../styles/minhaConta.module.css";

export default function Favoritos() {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="favoritos" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Favoritos</h2>
            <p>(Ainda não tens favoritos guardados)</p>
          </section>
        </main>
      </div>
    </div>
  );
}
