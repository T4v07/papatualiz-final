import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import ProdutoCard from "@/components/ProdutoCard";
import Navbar from "@/components/navbar";
import AuthContext from "@/context/AuthContext";
import FiltrosSidebar from "@/components/FiltrosSidebar";
import PesquisaHeader from "@/components/PesquisaHeader";
import styles from "@/styles/pesquisa.module.css";

export default function Pesquisa() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const termo = router.query.q || "";

  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 8;
  const [ordenacao, setOrdenacao] = useState("mais-vendidos");

  const [filtros, setFiltros] = useState({
    marca: [],
    cor: [],
    genero: [],
    idade: [],
    categoria: [],
    tamanho: [],
    tecnologia: [],
    origem: [],
    material: [],
    uso: [],
    preco: [0, 500],
  });

  useEffect(() => {
    if (termo) {
      fetch(`/api/produtos/pesquisa?q=${termo}`)
        .then((res) => res.json())
        .then((data) => setProdutos(data));
    }
  }, [termo]);

  const gerarSugestoes = (termo, produtos) => {
    if (!termo || produtos.length === 0)
      return ["camisola", "futebol", "adidas", "mochila", "fitness"];

    const termoLower = termo.toLowerCase();
    const encontradas = new Set();

    produtos.forEach((produto) => {
      if (produto.Nome_Produtos?.toLowerCase().includes(termoLower)) {
        encontradas.add(produto.Nome_Produtos);
      }
      if (produto.NomeCategoria?.toLowerCase().includes(termoLower)) {
        encontradas.add(produto.NomeCategoria);
      }
      if (produto.Marca?.toLowerCase().includes(termoLower)) {
        encontradas.add(produto.Marca);
      }
    });

    const lista = Array.from(encontradas);
    return lista.length > 0
      ? lista.slice(0, 4)
      : ["camisola", "futebol", "adidas", "mochila", "fitness"];
  };

  const sugestoesDinamicas = gerarSugestoes(termo, produtos);

  const aplicarFiltros = () => {
    if (!Array.isArray(produtos)) return [];

    return produtos.filter((produto) => {
      const matchMarca =
        filtros.marca.length === 0 || filtros.marca.includes(produto.Marca);

      const matchCor =
        filtros.cor.length === 0 ||
        (produto.variacoes &&
          produto.variacoes.some((v) => filtros.cor.includes(v.cor)));

      const matchGenero =
        filtros.genero.length === 0 ||
        filtros.genero.includes(produto.Genero);

      const matchIdade =
        filtros.idade.length === 0 ||
        filtros.idade.includes(produto.Idade);

      const matchCategoria =
        filtros.categoria.length === 0 ||
        filtros.categoria.includes(produto.NomeCategoria);

      const matchTamanho =
        filtros.tamanho.length === 0 ||
        (produto.variacoes &&
          produto.variacoes.some((v) => {
            if (!v.tamanho) return false;
            const tamanhos = v.tamanho.split(",").map((t) => t.trim());
            return tamanhos.some((tam) => filtros.tamanho.includes(tam));
          })) ||
        (produto.Tamanho_Roupa &&
          produto.Tamanho_Roupa.split(",").some((t) =>
            filtros.tamanho.includes(t)
          )) ||
        (produto.Tamanho_Calcado &&
          produto.Tamanho_Calcado.split(",").some((t) =>
            filtros.tamanho.includes(t)
          )) ||
        (produto.Tamanho_Objeto &&
          produto.Tamanho_Objeto.split(",").some((t) =>
            filtros.tamanho.includes(t)
          ));

      const matchTecnologia =
        filtros.tecnologia.length === 0 ||
        filtros.tecnologia.includes(produto.Tecnologia);

      const matchOrigem =
        filtros.origem.length === 0 ||
        filtros.origem.includes(produto.Origem);

      const matchMaterial =
        filtros.material.length === 0 ||
        filtros.material.includes(produto.Material);

      const matchUso =
        filtros.uso.length === 0 ||
        filtros.uso.includes(produto.Uso_Recomendado);

      const matchPreco =
        produto.Preco >= filtros.preco[0] &&
        produto.Preco <= filtros.preco[1];

      return (
        matchMarca &&
        matchCor &&
        matchGenero &&
        matchIdade &&
        matchCategoria &&
        matchTamanho &&
        matchTecnologia &&
        matchOrigem &&
        matchMaterial &&
        matchUso &&
        matchPreco
      );
    });
  };

  const produtosFiltrados = aplicarFiltros();

  // 🔽 ORDENAR os produtos filtrados antes da paginação
  const produtosOrdenados = [...produtosFiltrados];

  if (ordenacao === "preco-crescente") {
    produtosOrdenados.sort((a, b) => a.Preco - b.Preco);
  } else if (ordenacao === "preco-decrescente") {
    produtosOrdenados.sort((a, b) => b.Preco - a.Preco);
  } else if (ordenacao === "novidades") {
    produtosOrdenados.sort(
      (a, b) =>
        new Date(b.Data_Criacao || 0) - new Date(a.Data_Criacao || 0)
    );
  }
  // "mais-vendidos" não ordena aqui (depende de info externa)

  const totalPaginas = Math.ceil(produtosOrdenados.length / produtosPorPagina);
  const produtosPaginados = produtosOrdenados.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <FiltrosSidebar
          filtros={filtros}
          setFiltros={setFiltros}
          produtos={produtos}
        />

        <main className={styles.resultados}>
          <PesquisaHeader
            termo={termo}
            totalResultados={produtosFiltrados.length}
            sugestoes={sugestoesDinamicas}
            ordenacao={ordenacao}
            setOrdenacao={setOrdenacao}
          />

          <div className={styles.gridProdutos}>
            {termo && produtosPaginados.length === 0 ? (
              <p>Nenhum produto encontrado.</p>
            ) : (
              produtosPaginados.map((produto) => (
                <ProdutoCard
                  key={produto.ID_produto}
                  produto={produto}
                  mostrarFavorito={false}
                  onClick={() =>
                    router.push(`/produto/${produto.ID_produto}`)
                  }
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
