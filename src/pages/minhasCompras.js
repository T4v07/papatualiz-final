import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "../components/navbar";
import SidebarConta from "../components/SidebarConta";
import styles from "../styles/minhaConta.module.css";

export default function MinhasCompras() {
  const { user } = useContext(AuthContext);
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchCompras = async () => {
      if (!user) return;
      const res = await fetch(`/api/compras-do-utilizador?email=${user?.Email}`);
      const data = await res.json();
      if (res.ok) setCompras(data);
    };
    fetchCompras();
  }, [user]);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="compras" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>As minhas compras</h2>
            {compras.length === 0 ? (
              <p>(Ainda não tens compras registradas)</p>
            ) : (
              <div className={styles.cardGrid}>
                {compras.map((compra) => (
                  <div key={compra.ID_compra} className={styles.card}>
                    <h4>Compra #{compra.ID_compra}</h4>
                    <p><strong>Data:</strong> {new Date(compra.Data_compra).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> {parseFloat(compra.Total_Valor).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
