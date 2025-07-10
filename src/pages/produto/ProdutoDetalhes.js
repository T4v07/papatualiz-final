import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import styles from "@/styles/detalhesProduto.module.css";
import Link from "next/link";

export default function ProdutoDetalhes() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);

  const [produto, setProduto] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [variações, setVariacoes] = useState([]);
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [stockAtual, setStockAtual] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState(null);
  const [adicionando, setAdicionando] = useState(false);
  const [favorito, setFavorito] = useState(false);
  const [tabAtiva, setTabAtiva] = useState("descricao");

  // Buscar dados do produto, fotos e variações
  useEffect(() => {
    if (!id) return;

    // Busca info básica do produto
    fetch(`/api/verprodutos/${id}`)
      .then(res => res.json())
      .then(data => setProduto(data));

    // Busca fotos do produto
    fetch(`/api/produtos/fotos?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setFotos(data);
        if(data.length) setImagemAtiva(data[0].url);
      });

    // Busca variações do produto
    fetch(`/api/produtos/variacoes?id=${id}`)
      .then(res => res.json())
      .then(data => setVariacoes(data));
  }, [id]);

  // Atualiza o stock sempre que cor ou tamanho mudam
  useEffect(() => {
    if (!corSelecionada || !tamanhoSelecionado) {
      setStockAtual(null);
      return;
    }
    const variacao = variações.find(v => v.cor === corSelecionada && v.tamanho === tamanhoSelecionado);
    setStockAtual(variacao ? variacao.stock : 0);
  }, [corSelecionada, tamanhoSelecionado, variações]);

  // Função para adicionar ao carrinho
  const adicionarCarrinho = async () => {
    if (!user?.ID_utilizador) {
      alert("Faça login para adicionar ao carrinho.");
      router.push("/servicosLogin");
      return;
    }
    if (!corSelecionada || !tamanhoSelecionado) {
      alert("Selecione cor e tamanho.");
      return;
    }
    if (stockAtual === 0) {
      alert("Produto sem estoque nessa variação.");
      return;
    }

    setAdicionando(true);
    try {
      const res = await fetch("/api/carrinho/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID_utilizador: user.ID_utilizador,
          ID_produto: produto.ID_produto,
          quantidade: 1,
          cor: corSelecionada,
          tamanho: tamanhoSelecionado,
        }),
      });

      if (res.ok) alert("Produto adicionado ao carrinho!");
      else alert("Erro ao adicionar ao carrinho.");
    } catch {
      alert("Erro ao adicionar ao carrinho.");
    }
    setAdicionando(false);
  };

  if (!produto) return <p>Carregando...</p>;

  return (
    <>
      <Navbar />

      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> &gt;{" "}
        <Link href={`/pesquisa?categoria=${produto.Tipo_de_Categoria}`}>
          {produto.Tipo_de_Produto}
        </Link> &gt; <span>{produto.Nome_Produtos}</span>
      </div>

      <div className={styles.produtoContainer}>
        {/* Fotos */}
        <div className={styles.fotosContainer}>
          <img
            src={imagemAtiva}
            alt={produto.Nome_Produtos}
            className={styles.imagemPrincipal}
            onMouseMove={e => {
              // Zoom simples ao passar mouse (exemplo)
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
              e.currentTarget.style.transform = "scale(2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transformOrigin = "center";
              e.currentTarget.style.transform = "scale(1)";
            }}
          />

          <div className={styles.miniaturas}>
            {fotos.map(f => (
              <img
                key={f.id}
                src={f.url}
                alt={`Miniatura ${produto.Nome_Produtos}`}
                className={imagemAtiva === f.url ? styles.miniaturaAtiva : ""}
                onClick={() => setImagemAtiva(f.url)}
              />
            ))}
          </div>
        </div>

        {/* Info + variações */}
        <div className={styles.infoContainer}>
          <h1>{produto.Nome_Produtos}</h1>
          <p className={styles.preco}>{parseFloat(produto.Preco).toFixed(2)} €</p>
          <p>{produto.Marca} – {produto.Modelo}</p>
          <p>{produto.Tipo_de_Produto}</p>
          <p>
            {stockAtual !== null
              ? stockAtual > 0
                ? `Disponível: ${stockAtual} unidades`
                : "Sem estoque nessa variação"
              : produto.Stock > 0
              ? `Disponível: ${produto.Stock} unidades`
              : "Indisponível"}
          </p>

          {/* Seleção de Cor */}
          <div className={styles.variacoesContainer}>
            <label>Cor:</label>
            <select
              value={corSelecionada || ""}
              onChange={e => setCorSelecionada(e.target.value)}
            >
              <option value="" disabled>Selecione uma cor</option>
              {[...new Set(variações.map(v => v.cor))].map(cor => (
                <option key={cor} value={cor}>{cor}</option>
              ))}
            </select>
          </div>

          {/* Seleção de Tamanho */}
          <div className={styles.variacoesContainer}>
            <label>Tamanho:</label>
            <select
              value={tamanhoSelecionado || ""}
              onChange={e => setTamanhoSelecionado(e.target.value)}
              disabled={!corSelecionada}
            >
              <option value="" disabled>Selecione um tamanho</option>
              {[...new Set(variações
                .filter(v => v.cor === corSelecionada)
                .map(v => v.tamanho)
              )].map(tamanho => (
                <option key={tamanho} value={tamanho}>{tamanho}</option>
              ))}
            </select>
          </div>

          {/* Botão adicionar */}
          <button
            className={styles.btnAdicionar}
            onClick={adicionarCarrinho}
            disabled={adicionando || !corSelecionada || !tamanhoSelecionado || stockAtual === 0}
          >
            {adicionando ? "Adicionando..." : "🛒 Adicionar ao Carrinho"}
          </button>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={tabAtiva === "descricao" ? styles.ativo : ""}
              onClick={() => setTabAtiva("descricao")}
            >Descrição</button>
            <button
              className={tabAtiva === "ficha" ? styles.ativo : ""}
              onClick={() => setTabAtiva("ficha")}
            >Ficha Técnica</button>
          </div>
          <div className={styles.tabConteudo}>
            {tabAtiva === "descricao" && <p>{produto.Descricao}</p>}
            {tabAtiva === "ficha" && <p>{produto.Ficha_Tecnica}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
