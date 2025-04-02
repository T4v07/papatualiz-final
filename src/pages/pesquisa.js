import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import ProdutoCard from "@/components/ProdutoCard";
import Navbar from "@/components/navbar";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/pesquisa.module.css";

export default function Pesquisa() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);
  const [filtros, setFiltros] = useState({ marca: "", cor: "", categoria: "" });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 6;

  const termo = router.query.q || "";

  useEffect(() => {
    if (termo) {
      fetch(`/api/produtos/pesquisa?q=${termo}`)
        .then((res) => res.json())
        .then((data) => setProdutos(data));
    }
  }, [termo]);

  const filtrados = produtos.filter((p) => {
    const matchMarca = filtros.marca ? p.Marca === filtros.marca : true;
    const matchCor = filtros.cor ? p.Cor === filtros.cor : true;
    const matchCategoria = filtros.categoria ? p.Tipo_de_Categoria === filtros.categoria : true;
    return matchMarca && matchCor && matchCategoria;
  });

  const produtosPaginados = filtrados.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  const sugestoes = ["camisola", "futebol", "adidas", "sapatos", "fitness"];

  return (
    <>
      <Navbar />
      <div className={styles.container}>
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
          <h2>Resultado para: "{termo}"</h2>

          <div className={styles.sugestoes}>
            <p>🔍 Sugestões:</p>
            {sugestoes.map((s, i) => (
              <button key={i} onClick={() => router.push(`/pesquisa?q=${s}`)}>
                {s}
              </button>
            ))}
          </div>

          <div className={styles.gridProdutos}>
            {produtosPaginados.map((produto) => (
              <ProdutoCard key={produto.ID_produto} produto={produto} userId={user?.id} />
            ))}
          </div>

          <div className={styles.paginacao}>
            {Array.from({ length: Math.ceil(filtrados.length / produtosPorPagina) }).map((_, i) => (
              <button key={i} onClick={() => setPaginaAtual(i + 1)} className={paginaAtual === i + 1 ? styles.ativo : ""}>
                {i + 1}
              </button>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
