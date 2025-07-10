// /pages/minhasEncomendas.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import styles from "@/styles/minhaConta.module.css";

export default function MinhasEncomendas() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [encomendas, setEncomendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading || !user?.ID_utilizador) return;

    const fetchEncomendas = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/encomendas/listar-por-id?usuario_id=${user.ID_utilizador}`);
        if (!res.ok) throw new Error("Erro ao buscar encomendas");
        const data = await res.json();
        setEncomendas(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar encomendas:", err);
        setError(err.message);
        setEncomendas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEncomendas();
  }, [authLoading, user]);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="encomendas" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>📦 As Minhas Encomendas</h2>

            {loading ? (
              <p>Carregando encomendas...</p>
            ) : error ? (
              <p className={styles.error}>Erro: {error}</p>
            ) : encomendas.length === 0 ? (
              <p>Não tens encomendas registradas.</p>
            ) : (
              <div className={styles.cardGrid}>
                {encomendas.map((enc) => (
                  <div key={enc.ID_encomenda} className={styles.card}>
                    <h4>Encomenda #{enc.ID_encomenda}</h4>
                    <p><strong>Estado:</strong> {enc.Estado}</p>
                    <p><strong>Data:</strong> {new Date(enc.Data_criacao).toLocaleDateString()}</p>
                    <p><strong>Código de Rastreio:</strong> {enc.Codigo_rastreio || "Não atribuído"}</p>
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
