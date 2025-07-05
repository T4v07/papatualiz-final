// src/pages/pesquisa.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import ProdutoCard from "@/components/ProdutoCard";
import Navbar from "@/components/navbar";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/pesquisa.module.css";
import FiltrosSidebar from "@/components/FiltrosSidebar";

export default function Pesquisa() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const termo = router.query.q || "";

  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 8;

  const [filtros, setFiltros] = useState({
    marca: [],
    cor: [],
    genero: [],
    idade: [],
    categoria: [],
    stock: false,
    desconto: false,
    novidade: false,
    tamanho: [],
    tecnologia: [],
    origem: [],
    material: [],
    uso: [],
    preco: [0, 500],
  });

  const sugestoes = ["camisola", "futebol", "adidas", "mochila", "fitness"];

  useEffect(() => {
    if (termo) {
      fetch(`/api/produtos/pesquisa?q=${termo}`)
        .then((res) => res.json())
        .then((data) => setProdutos(data));
    }
  }, [termo]);

  // Função de filtro (mesma que antes)
  const aplicarFiltros = () => {
    if (!Array.isArray(produtos)) return [];

    return produtos.filter((produto) => {
      const matchMarca = filtros.marca.length === 0 || filtros.marca.includes(produto.Marca);
      const matchCor = filtros.cor.length === 0 || filtros.cor.includes(produto.Cor);
      const matchGenero = filtros.genero.length === 0 || filtros.genero.includes(produto.Genero);
      const matchIdade = filtros.idade.length === 0 || filtros.idade.includes(produto.Idade);
      const matchCategoria = filtros.categoria.length === 0 || filtros.categoria.includes(produto.Tipo_de_Categoria);
      const matchTamanho =
        filtros.tamanho.length === 0 ||
        (produto.Tamanho_Roupa && produto.Tamanho_Roupa.split(',').some(t => filtros.tamanho.includes(t))) ||
        (produto.Tamanho_Calcado && produto.Tamanho_Calcado.split(',').some(t => filtros.tamanho.includes(t))) ||
        (produto.Tamanho_Objeto && produto.Tamanho_Objeto.split(',').some(t => filtros.tamanho.includes(t)));
      const matchTecnologia = filtros.tecnologia.length === 0 || filtros.tecnologia.includes(produto.Tecnologia);
      const matchOrigem = filtros.origem.length === 0 || filtros.origem.includes(produto.Origem);
      const matchMaterial = filtros.material.length === 0 || filtros.material.includes(produto.Material);
      const matchUso = filtros.uso.length === 0 || filtros.uso.includes(produto.Uso_Recomendado);
      const matchPreco = produto.Preco >= filtros.preco[0] && produto.Preco <= filtros.preco[1];
      const matchStock = !filtros.stock || produto.Stock > 0;
      const matchDesconto = !filtros.desconto || (produto.Desconto && produto.Desconto > 0);
      const matchNovidade = !filtros.novidade || produto.Novidade === 1;

      return (
        matchMarca && matchCor && matchGenero && matchIdade &&
        matchCategoria && matchTamanho && matchTecnologia &&
        matchOrigem && matchMaterial && matchUso &&
        matchPreco && matchStock && matchDesconto && matchNovidade
      );
    });
  };

  const produtosFiltrados = aplicarFiltros();
  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
  const produtosPaginados = produtosFiltrados.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <FiltrosSidebar filtros={filtros} setFiltros={setFiltros} produtos={produtos} />

        <main className={styles.resultados}>
          {termo && termo.trim() !== "" ? (
            <h2>Resultados para: "{termo}"</h2>
          ) : (
            <h2>Nenhum produto encontrado</h2>
          )}

          <div className={styles.sugestoes}>
            <p>Sugestões:</p>
            {sugestoes.map((s, i) => (
              <button
                key={i}
                className={styles.sugestaoBtn}
                onClick={() => router.push(`/pesquisa?q=${s}`)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className={styles.gridProdutos}>
            {termo && produtosPaginados.length === 0 ? (
              <p>Nenhum produto encontrado.</p>
            ) : (
              produtosPaginados.map((produto) => (
                <ProdutoCard
                  key={produto.ID_produto}
                  produto={produto}
                  mostrarFavorito={false}
                  onClick={() => router.push(`/produto/${produto.ID_produto}`)}
                />
              ))
            )}
          </div>

          {produtosFiltrados.length > 0 && (
            <div className={styles.paginacao}>
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPaginaAtual(i + 1)}
                  className={paginaAtual === i + 1 ? styles.ativo : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
