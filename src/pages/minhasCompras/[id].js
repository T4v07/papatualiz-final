import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import styles from "@/styles/minhaConta.module.css";

export default function DetalhesCompra() {
  const router = useRouter();
  const { id } = router.query;
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetalhes = async () => {
      try {
        const res = await fetch(`/api/compra-detalhes?id=${id}`);
        if (!res.ok) throw new Error("Compra não encontrada");
        const data = await res.json();
        setDados(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhes();
  }, [id]);

  if (loading) return <p className={styles.loading}>Carregando...</p>;
  if (!dados) return <p className={styles.error}>Compra não encontrada.</p>;

  const { produtos, encomenda } = dados;

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="compras" />
        <main className={styles.mainContent}>
          <button className={styles.botaoVoltar} onClick={() => router.push("/minhasCompras")}>
            ⬅ Voltar às Compras
          </button>

          <h2 className={styles.tituloPrincipal}>Detalhes da Compra #{id}</h2>

          <section className={styles.secao}>
            <h3>📦 Produtos</h3>
            <ul className={styles.listaBonita}>
              {produtos.map((p, i) => (
                <li key={i}>
                  <img src={p.Imagem || "/images/placeholder.png"} alt={p.Nome} />
                  <div className={styles.produtoInfo}>
                    <span className={styles.produtoNome}>{p.Nome}</span>
                    <span className={styles.produtoQuantidadePreco}>
                      {p.Quantidade}x — {parseFloat(p.Preco_unitario).toFixed(2)}€
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {encomenda && (
            <>
              <section className={styles.secao}>
                <h3>📍 Endereço de Entrega</h3>
                <p>
                  {encomenda.nome} {encomenda.apelido}
                </p>
                <p>
                  {encomenda.Rua}, {encomenda.Numero}
                </p>
                <p>
                  {encomenda.Codigo_postal} — {encomenda.Cidade}, {encomenda.Pais}
                </p>
                <p>Tel: {encomenda.telefone}</p>
                <p>Email: {encomenda.email}</p>
                {encomenda.Notas && (
                  <p>
                    <strong>Notas:</strong> {encomenda.Notas}
                  </p>
                )}
              </section>

              <section className={styles.secao}>
                <h3>🚚 Rastreamento</h3>
                <p>
                  <strong>Código:</strong> {encomenda.ID_compra}
                </p>
                <p>
                  <strong>Status:</strong> {encomenda.Estado}
                </p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
