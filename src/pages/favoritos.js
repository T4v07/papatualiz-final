import { useEffect, useState, useContext, useMemo } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import ProdutoCardFavorito from "@/components/ProdutoCardFavorito";
import styles from "@/styles/favoritos.module.css";

const ITEMS_PER_PAGE = 8;

export default function PaginaFavoritos() {
  const { user } = useContext(AuthContext);
  const [favoritos, setFavoritos] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    if (!user?.ID_utilizador) return;

    fetch(`/api/favoritos/listar?id_utilizador=${user.ID_utilizador}`)
      .then(res => (res.ok ? res.json() : []))
      .then(data => setFavoritos(data.map(f => f.ID_produto)))
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (favoritos.length === 0) {
      setProdutos([]);
      return;
    }

    fetch("/api/produtos")
      .then(res => (res.ok ? res.json() : []))
      .then(data => {
        const filtrados = data.filter(p => favoritos.includes(p.ID_produto));
        setProdutos(filtrados);
      })
      .catch(console.error);
  }, [favoritos]);

  const categoriasUnicas = useMemo(() => {
    const cats = new Set(produtos.map(p => p.Tipo_de_Categoria || "Outros"));
    return Array.from(cats).sort();
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter(p => {
      if (filtroCategoria && (p.Tipo_de_Categoria || "Outros") !== filtroCategoria) {
        return false;
      }
      if (filtroTexto.trim() !== "") {
        const texto = filtroTexto.toLowerCase();
        if (
          !p.Nome_Produtos.toLowerCase().includes(texto) &&
          !p.Marca.toLowerCase().includes(texto)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [produtos, filtroCategoria, filtroTexto]);

  const totalPaginas = Math.ceil(produtosFiltrados.length / ITEMS_PER_PAGE);
  const produtosPaginados = produtosFiltrados.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  );

  const limparFiltros = () => {
    setFiltroCategoria("");
    setFiltroTexto("");
    setPaginaAtual(1);
  };

  const mudarPagina = novaPagina => {
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    setPaginaAtual(novaPagina);
  };

  const toggleFavorito = async id_produto => {
    if (!user?.ID_utilizador) return;

    try {
      let res;
      if (favoritos.includes(id_produto)) {
        res = await fetch("/api/favoritos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_utilizador: user.ID_utilizador, id_produto }),
        });
      } else {
        res = await fetch("/api/favoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_utilizador: user.ID_utilizador, id_produto }),
        });
      }

      if (res.ok) {
        // Refaz a lista de favoritos para manter UI sincronizada
        fetch(`/api/favoritos/listar?id_utilizador=${user.ID_utilizador}`)
          .then(res => (res.ok ? res.json() : []))
          .then(data => setFavoritos(data.map(f => f.ID_produto)))
          .catch(console.error);
      } else {
        alert("Erro ao atualizar favoritos");
      }
    } catch {
      alert("Erro ao atualizar favoritos");
    }
  };

  const adicionarCarrinho = async id_produto => {
    if (!user?.ID_utilizador) {
      alert("Faça login para adicionar ao carrinho.");
      return;
    }

    try {
      const res = await fetch("/api/carrinho/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_utilizador: user.ID_utilizador, id_produto, quantidade: 1 }),
      });

      if (res.ok) alert("Produto adicionado ao carrinho!");
      else alert("Erro ao adicionar ao carrinho.");
    } catch {
      alert("Erro ao adicionar ao carrinho.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <aside className={styles.sidebarConta}>
          <SidebarConta active="favoritos" />
        </aside>

        <main className={styles.mainContent}>
          <section className={styles.filterSection}>
            <h2>❤️ Meus Favoritos</h2>
            <div className={styles.filtrosWrapper}>
              <select
                className={styles.selectCategoria}
                value={filtroCategoria}
                onChange={e => {
                  setFiltroCategoria(e.target.value);
                  setPaginaAtual(1);
                }}
              >
                <option value="">Todas as categorias</option>
                {categoriasUnicas.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Buscar por nome ou marca"
                className={styles.inputBusca}
                value={filtroTexto}
                onChange={e => {
                  setFiltroTexto(e.target.value);
                  setPaginaAtual(1);
                }}
              />

              <button className={styles.btnLimparFiltros} onClick={limparFiltros}>
                Limpar filtros
              </button>
            </div>
          </section>

          <section className={styles.produtosGridSection}>
            {produtosPaginados.length === 0 ? (
              <p className={styles.semProdutos}>Nenhum produto encontrado.</p>
            ) : (
              <div className={styles.cardGrid}>
                {produtosPaginados.map(produto => (
                  <ProdutoCardFavorito
                    key={produto.ID_produto}
                    produto={produto}
                    favoritos={favoritos}
                    onToggleFavorito={toggleFavorito}
                    onAddCarrinho={adicionarCarrinho}
                  />
                ))}
              </div>
            )}
          </section>

          {totalPaginas > 1 && (
            <section className={styles.paginacaoSection}>
              <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
                &lt; Anterior
              </button>
              <span>
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                onClick={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima &gt;
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
