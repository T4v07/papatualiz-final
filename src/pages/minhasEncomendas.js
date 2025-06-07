import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import styles from "@/styles/minhaConta.module.css";
import { useRouter } from "next/router";

export default function MinhasEncomendas() {
  const { user } = useContext(AuthContext);
  const [encomendas, setEncomendas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEncomendas = async () => {
      if (!user) return;
      const res = await fetch(`/api/encomendas-do-utilizador?email=${user?.Email}`);
      const data = await res.json();
      if (res.ok) setEncomendas(data);
    };

    fetchEncomendas();
  }, [user]);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="encomendas" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>📦 As minhas encomendas</h2>
            {encomendas.length === 0 ? (
              <p>(Ainda não tens encomendas registradas)</p>
            ) : (
              <div className={styles.cardGrid}>
                {encomendas.map((enc) => (
                  <div key={enc.ID_encomenda} className={styles.card}>
                    <h4>Código: {enc.Codigo_rastreio}</h4>
                    <p>Estado: {enc.Estado}</p>
                    <p>Data: {new Date(enc.Data_criacao).toLocaleDateString()}</p>
                    <button
                      className={styles.saveButton}
                      onClick={() => router.push(`/encomenda/${enc.ID_encomenda}`)}
                    >
                      Ver Detalhes
                    </button>
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
