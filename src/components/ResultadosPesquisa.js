import { useState, useEffect } from "react";
import styles from "@/styles/pesquisa.module.css";

export default function ResultadosPesquisa() {
  const [produtos, setProdutos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [filtros, setFiltros] = useState({ marca: "", cor: "", categoria: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const termo = params.get("q") || "";
    setPesquisa(termo);

    fetch(`/api/produtos/pesquisa?q=${termo}`)
      .then((res) => res.json())
      .then((data) => setProdutos(data));
  }, []);

  const handleAddCarrinho = (produtoId) => {
    console.log("Adicionar ao carrinho:", produtoId);
    // lógica real depois
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
            <div key={produto.ID_produto} className={styles.card}>
              <img src={produto.Foto} alt={produto.Nome_Produtos} />
              <h4>{produto.Nome_Produtos}</h4>
              <p>{produto.Marca}</p>
              <p>{produto.Preco} €</p>
              <button onClick={() => handleAddCarrinho(produto.ID_produto)}>
                Adicionar ao carrinho
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
