import { useState, useEffect, useContext } from "react";
import styles from "@/styles/pesquisa.module.css";
import produtoStyles from "@/styles/produtoCard.module.css";
import AuthContext from "@/context/AuthContext";

export default function ResultadosPesquisa() {
  const [produtos, setProdutos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtros, setFiltros] = useState({ marca: "", cor: "", categoria: "" });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const termo = params.get("q") || "";
    setPesquisa(termo);

    fetch(`/api/produtos/pesquisa?q=${termo}`)
      .then((res) => res.json())
      .then((data) => setProdutos(data));

    if (user?.ID_utilizador) {
      fetch(`/api/favoritos/listar?id_utilizador=${user.ID_utilizador}`)
        .then((res) => res.json())
        .then((data) => setFavoritos(data.map((f) => f.ID_produto)))
        .catch((err) => console.error("Erro ao carregar favoritos:", err));
    }
  }, [user]);

  const handleAddFavorito = async (produtoId) => {
    if (!user?.ID_utilizador) {
      alert("Precisas de fazer login para usar favoritos.");
      return;
    }

    const res = await fetch("/api/favoritos/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.ID_utilizador,
        id_produto: produtoId,
      }),
    });

    if (res.ok) {
      setFavoritos((prev) =>
        prev.includes(produtoId)
          ? prev.filter((id) => id !== produtoId)
          : [...prev, produtoId]
      );
    } else {
      alert("Erro ao atualizar favorito");
    }
  };

  const produtosFiltrados = produtos.filter((p) => {
    const matchMarca = filtros.marca ? p.Marca === filtros.marca : true;
    const matchCor = filtros.cor ? p.Cor === filtros.cor : true;
    const matchCategoria = filtros.categoria
      ? p.Tipo_de_Categoria === filtros.categoria
      : true;
    return matchMarca && matchCor && matchCategoria;
  });

  return (
    <div className={styles.pesquisaContainer}>
      <aside className={styles.filtros}>
        <h3>Filtros</h3>
        <select onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}>
          <option value="">Marca</option>
          {[...new Set(produtos.map((p) => p.Marca))].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <select onChange={(e) => setFiltros({ ...filtros, cor: e.target.value })}>
          <option value="">Cor</option>
          {[...new Set(produtos.map((p) => p.Cor))].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}>
          <option value="">Categoria</option>
          {[...new Set(produtos.map((p) => p.Tipo_de_Categoria))].map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </aside>

      <main className={styles.resultados}>
        <h2>Resultado da pesquisa: "{pesquisa}"</h2>
        <div className={styles.gridProdutos}>
          {produtosFiltrados.map((produto) => (
            <div key={produto.ID_produto} className={produtoStyles.card}>
              <div style={{ position: "relative" }}>
                <img src={produto.Foto} alt={produto.Nome_Produtos} />
                {user && (
                  <button
                    onClick={() => handleAddFavorito(produto.ID_produto)}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "none",
                      border: "none",
                      fontSize: 22,
                      cursor: "pointer",
                      color: favoritos.includes(produto.ID_produto) ? "red" : "#ccc",
                    }}
                  >
                    ♥
                  </button>
                )}
              </div>
              <h3>{produto.Nome_Produtos}</h3>
              <p>{produto.Marca}</p>
              <p>{parseFloat(produto.Preco).toFixed(2)} €</p>
              <button>Adicionar ao carrinho</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
