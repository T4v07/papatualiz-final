import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import ProdutoCardFavorito from "@/components/ProdutoCardFavorito";
import styles from "@/styles/minhaConta.module.css";

export default function PaginaFavoritos() {
  const { user } = useContext(AuthContext);
  const [favoritos, setFavoritos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [agrupados, setAgrupados] = useState({});
  const [selecionados, setSelecionados] = useState([]);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!user?.ID_utilizador) return;
      const res = await fetch(`/api/favoritos/listar?id_utilizador=${user.ID_utilizador}`);
      if (res.ok) {
        const data = await res.json();
        const ids = data.map((fav) => fav.ID_produto);
        setFavoritos(ids);
      }
    };
    fetchFavoritos();
  }, [user]);

  useEffect(() => {
    const fetchProdutos = async () => {
      if (favoritos.length === 0) return;
      const res = await fetch("/api/produtos");
      if (res.ok) {
        const data = await res.json();
        const filtrados = data.filter((p) => favoritos.includes(p.ID_produto));
        setProdutos(filtrados);

        const grupos = {};
        filtrados.forEach((prod) => {
          const categoria = prod.Tipo_de_Categoria || "Outros";
          if (!grupos[categoria]) grupos[categoria] = [];
          grupos[categoria].push(prod);
        });
        setAgrupados(grupos);
      }
    };
    fetchProdutos();
  }, [favoritos]);

  const toggleFavorito = async (id_produto) => {
    if (!user?.ID_utilizador) return;
    const res = await fetch("/api/favoritos/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_utilizador: user.ID_utilizador, id_produto }),
    });
    if (res.ok) {
      setFavoritos((prev) =>
        prev.includes(id_produto)
          ? prev.filter((id) => id !== id_produto)
          : [...prev, id_produto]
      );
    }
  };

  const adicionarCarrinho = async (id_produto) => {
    const res = await fetch("/api/carrinho/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.ID_utilizador,
        id_produto,
        quantidade: 1,
      }),
    });
    res.ok
      ? alert("Produto adicionado ao carrinho!")
      : alert("Erro ao adicionar.");
  };

  const toggleSelecionado = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const removerSelecionados = async () => {
    for (let id of selecionados) {
      await toggleFavorito(id);
    }
    setSelecionados([]);
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="favoritos" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>❤️ Meus Favoritos</h2>

            {selecionados.length > 0 && (
              <button className={styles.saveButton} onClick={removerSelecionados}>
                Remover selecionados
              </button>
            )}

            {Object.keys(agrupados).map((categoria) => (
              <div key={categoria}>
                <h3 style={{ marginTop: "20px", color: "#002244" }}>{categoria}</h3>
                <div className={styles.cardGrid}>
                  {agrupados[categoria].map((produto) => (
                    <ProdutoCardFavorito
                      key={produto.ID_produto}
                      produto={produto}
                      favoritos={favoritos}
                      onToggleFavorito={toggleFavorito}
                      onAddCarrinho={adicionarCarrinho}
                      selecionado={selecionados.includes(produto.ID_produto)}
                      onSelecionar={toggleSelecionado}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
