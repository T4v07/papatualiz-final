// /pages/encomenda/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import styles from "@/styles/minhaConta.module.css";

export default function DetalhesEncomenda() {
  const router = useRouter();
  const { id } = router.query;
  const [detalhes, setDetalhes] = useState(null);

  useEffect(() => {
    const fetchDetalhes = async () => {
      if (!id) return;
      const res = await fetch(`/api/encomenda-detalhes?id=${id}`);
      const data = await res.json();
      if (res.ok) setDetalhes(data);
    };

    fetchDetalhes();
  }, [id]);

  if (!detalhes) {
    return <p style={{ padding: "2rem" }}>Carregando detalhes da encomenda...</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Detalhes da Encomenda</h2>

            <div className={styles.card}>
              <p><strong>Código de Rastreio:</strong> {detalhes.Codigo_rastreio}</p>
              <p><strong>Estado:</strong> {detalhes.Estado}</p>
              <p><strong>Data:</strong> {new Date(detalhes.Data_criacao).toLocaleDateString()}</p>
              <p><strong>Endereço:</strong> {detalhes.Endereco_entrega}</p>
              {detalhes.Notas && (
                <p><strong>Notas:</strong> {detalhes.Notas}</p>
              )}
            </div>

            <h3 style={{ marginTop: "2rem" }}>Produtos da Encomenda</h3>
            <div className={styles.cardGrid}>
              {detalhes.produtos.map((p, i) => (
                <div className={styles.card} key={i}>
                  <h4>{p.Nome_Produto}</h4>
                  <p>Quantidade: {p.Quantidade}</p>
                  <p>Preço Unitário: {parseFloat(p.Preco_unitario).toFixed(2)}€</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
