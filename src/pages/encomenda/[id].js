import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import styles from "@/styles/minhaConta.module.css";

export default function DetalhesEncomenda() {
  const router = useRouter();
  const { id } = router.query;

  const [encomenda, setEncomenda] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    const fetchDetalhes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/encomendas/detalhes?id=${id}`);
        if (!res.ok) throw new Error("Erro ao carregar detalhes da encomenda");
        const data = await res.json();
        setEncomenda(data.encomenda);
        setProdutos(data.produtos || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setEncomenda(null);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhes();
  }, [router.isReady, id]);

  if (loading) return <p className={styles.loading}>Carregando detalhes da encomenda...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!encomenda) return <p className={styles.error}>Encomenda não encontrada.</p>;

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="encomendas" />
        <main className={styles.mainContent}>
          <h2>📦 Detalhes da Encomenda</h2>

          <section className={styles.secao}>
            <h3>Informações da Encomenda</h3>
            <p><strong>Código de Rastreio:</strong> {encomenda.Codigo_rastreio || "Não atribuído"}</p>
            <p><strong>Estado:</strong> {encomenda.Estado}</p>
            <p><strong>Data da Criação:</strong> {new Date(encomenda.Data_criacao).toLocaleDateString()}</p>
            <p><strong>Notas:</strong> {encomenda.Notas || "-"}</p>
          </section>

          <section className={styles.secao}>
            <h3>Endereço de Entrega</h3>
            <p>{encomenda.Rua}, {encomenda.Numero}</p>
            <p>{encomenda.Codigo_postal} - {encomenda.Cidade}</p>
            <p>{encomenda.Pais}</p>
          </section>

          <section className={styles.secao}>
            <h3>Contato do Cliente</h3>
            <p>{encomenda.nome} {encomenda.apelido}</p>
            <p>Telefone: {encomenda.telefone}</p>
            <p>Email: {encomenda.email}</p>
          </section>

          <section className={styles.secao}>
            <h3>Resumo Financeiro</h3>
            <p><strong>Subtotal:</strong> € {parseFloat(encomenda.Subtotal).toFixed(2)}</p>
            <p><strong>Frete:</strong> € {parseFloat(encomenda.Frete).toFixed(2)}</p>
            <p><strong>Total:</strong> € {parseFloat(encomenda.Total_Valor).toFixed(2)}</p>
          </section>

          {produtos.length > 0 && (
            <section className={styles.secao}>
              <h3>Produtos na Encomenda</h3>
              <ul>
                {produtos.map((p, i) => (
                  <li key={i}>
                    {p.Nome_Produtos} - {p.Marca} - Quantidade: {p.quantidade} - € {parseFloat(p.Preco).toFixed(2)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <button className={styles.botaoVoltar} onClick={() => router.back()}>
            ← Voltar
          </button>
        </main>
      </div>
    </div>
  );
}
