import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import styles from "@/styles/detalhesProduto.module.css";
import Link from "next/link";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';

export default function ProdutoDetalhes() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);

  const [produto, setProduto] = useState(null);
  const [imagemPrincipalIndex, setImagemPrincipalIndex] = useState(0);
  const [corSelecionada, setCorSelecionada] = useState("");
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState("");
  const [stockAtual, setStockAtual] = useState(null);
  const [idVariacaoSelecionada, setIdVariacaoSelecionada] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionando, setAdicionando] = useState(false);
  const [tabAtiva, setTabAtiva] = useState("descricao");
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/verprodutos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduto(data);
        setCorSelecionada("");
        setTamanhoSelecionado("");
        setStockAtual(null);
        setImagemPrincipalIndex(0);
      });
  }, [id]);

  useEffect(() => {
    if (!user?.ID_utilizador || !produto) return;

    const checarFavorito = async () => {
      try {
        const res = await fetch(`/api/favoritos/listar?id_utilizador=${user.ID_utilizador}`);
        if (res.ok) {
          const favoritos = await res.json();
          const idsFavoritos = favoritos.map((f) => f.ID_produto);
          setFavorito(idsFavoritos.includes(produto.ID_produto));
        }
      } catch {
        setFavorito(false);
      }
    };

    checarFavorito();
  }, [user, produto]);

  const variantes = produto?.variantes || [];
  const coresDisponiveis = [...new Set(variantes.map((v) => v.cor))];

  const tamanhosDisponiveis = corSelecionada
    ? variantes
        .filter((v) => v.cor === corSelecionada)
        .map((v) => v.tamanho)
        .filter((value, index, self) => self.indexOf(value) === index)
    : [];

  useEffect(() => {
    if (!corSelecionada || !tamanhoSelecionado) {
      setStockAtual(null);
      setIdVariacaoSelecionada(null);
      setQuantidade(1);
      return;
    }

    const variante = variantes.find(
      (v) => v.cor === corSelecionada && v.tamanho === tamanhoSelecionado
    );

    if (variante) {
      setStockAtual(variante.stock);
      setIdVariacaoSelecionada(variante.ID_produto_variacao);
      setQuantidade(1);
    } else {
      setStockAtual(null);
      setIdVariacaoSelecionada(null);
      setQuantidade(1);
    }
  }, [corSelecionada, tamanhoSelecionado, variantes]);

  const adicionarCarrinho = async () => {
    if (!user?.ID_utilizador) {
      alert("Faça login para adicionar ao carrinho.");
      router.push("/login");
      return;
    }
    if (!corSelecionada || !tamanhoSelecionado) {
      alert("Selecione cor e tamanho.");
      return;
    }
    if (!idVariacaoSelecionada || stockAtual === 0) {
      alert("Produto sem stock nessa variação.");
      return;
    }

    setAdicionando(true);
    try {
      const res = await fetch("/api/carrinho", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-usuario-id": user.ID_utilizador.toString(),
        },
        body: JSON.stringify({
          ID_produto: produto.ID_produto,
          ID_produto_variacao: idVariacaoSelecionada,
          quantidade,
        }),
      });

      if (res.ok) {
        alert("Produto adicionado ao carrinho!");
      } else {
        const erro = await res.json();
        alert(erro.message || "Erro ao adicionar ao carrinho.");
      }
    } catch {
      alert("Erro ao adicionar ao carrinho.");
    }
    setAdicionando(false);
  };

  const toggleFavorito = async () => {
    if (!user?.ID_utilizador) {
      alert("Faça login para gerenciar favoritos.");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/favoritos", {
        method: favorito ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_utilizador: user.ID_utilizador,
          id_produto: produto.ID_produto,
        }),
      });
      if (res.ok) setFavorito(!favorito);
      else alert("Erro ao atualizar favoritos");
    } catch {
      alert("Erro ao gerenciar favoritos");
    }
  };

  if (!produto) return <p>Carregando...</p>;

  return (
    <>
      <Navbar />
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> &gt;{" "}
        <Link href={`/pesquisa?categoria=${encodeURIComponent(produto.Tipo_de_Categoria)}`}>
          {produto.Tipo_de_Produto}
        </Link>{" "}
        &gt; <span>{produto.Nome_Produtos}</span>
      </div>

      <div className={styles.produtoContainer}>
        <div className={styles.fotosContainer}>
          <InnerImageZoom
            src={produto.fotos?.[imagemPrincipalIndex]?.url || ""}
            zoomSrc={produto.fotos?.[imagemPrincipalIndex]?.url || ""}
            zoomType="hover"
            zoomPreload={true}
            className={styles.imagemPrincipal}
          />
          <div className={styles.galeriaMiniaturas}>
            {produto.fotos?.map((foto, index) => (
              <img
                key={index}
                src={foto.url}
                alt={`Miniatura ${index + 1}`}
                className={`${styles.miniatura} ${
                  imagemPrincipalIndex === index ? styles.miniaturaAtiva : ""
                }`}
                onClick={() => setImagemPrincipalIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className={styles.infoContainer}>
          <div className={styles.linhaTituloFavorito}>
            <div className={styles.blocoTituloSelos}>
              <h1 className={styles.titulo}>{produto.Nome_Produtos}</h1>
              <div className={styles.selos}>
                {produto.Novo === 1 && (
                  <span className={styles.seloNovo}>
                    🆕 Novo
                  </span>
                )}
                {stockAtual <= 3 && (
                  <span className={styles.seloBaixoStock}>
                    ⚠️ Baixo stock
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={toggleFavorito}
              className={styles.btnFavorito}
              type="button"
              aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {favorito ? "❤️" : "🤍"}
            </button>
          </div>


          <p className={styles.preco}>{parseFloat(produto.Preco).toFixed(2)} €</p>
          <div className={styles.infoProdutoSecundaria}>
            <p className={styles.marcaModelo}>{produto.Marca} — {produto.Modelo}</p>
            <p className={styles.categoria}>Categoria: {produto.Tipo_de_Categoria}</p>
          </div>
          <p>
            {stockAtual !== null
              ? stockAtual > 0
                ? `Disponível: ${stockAtual} unidade${stockAtual > 1 ? "s" : ""}`
                : "Sem stock nessa variação"
              : "Selecione variação para ver stock"}
          </p>

          <div className={styles.grupoVariacoes}>
            <div className={styles.variacoesContainer}>
              <label htmlFor="selectCor">Cor:</label>
              <select
                id="selectCor"
                value={corSelecionada}
                onChange={(e) => {
                  setCorSelecionada(e.target.value);
                  setTamanhoSelecionado("");
                }}
                className={styles.selectBox}
              >
                <option value="">Selecione</option>
                {coresDisponiveis.map((cor) => (
                  <option key={cor} value={cor}>
                    {cor}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.variacoesContainer}>
              <label htmlFor="selectTamanho">Tamanho:</label>
              <select
                id="selectTamanho"
                value={tamanhoSelecionado}
                onChange={(e) => setTamanhoSelecionado(e.target.value)}
                disabled={!corSelecionada}
                className={styles.selectBox}
              >
                <option value="">Selecione</option>
                {tamanhosDisponiveis.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.variacoesContainer}>
              <label>Quantidade:</label>
              <div className={styles.quantidadeWrapper}>
                <button
                  type="button"
                  className={styles.btnQtd}
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  disabled={!tamanhoSelecionado || quantidade <= 1}
                >
                  -
                </button>
                <span className={styles.quantidadeValor}>{quantidade}</span>
                <button
                  type="button"
                  className={styles.btnQtd}
                  onClick={() => setQuantidade(Math.min((stockAtual || 1), quantidade + 1))}
                  disabled={!tamanhoSelecionado || quantidade >= (stockAtual || 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            className={styles.btnAdicionar}
            onClick={adicionarCarrinho}
            disabled={adicionando || !idVariacaoSelecionada || stockAtual === 0}
          >
            {adicionando ? "Adicionando..." : "🛒 Adicionar ao Carrinho"}
          </button>

          <div className={styles.tabs}>
            <button
              className={tabAtiva === "descricao" ? styles.ativo : ""}
              onClick={() => setTabAtiva("descricao")}
              type="button"
            >
              Descrição
            </button>
            <button
              className={tabAtiva === "ficha" ? styles.ativo : ""}
              onClick={() => setTabAtiva("ficha")}
              type="button"
            >
              Ficha Técnica
            </button>
          </div>

          <div className={styles.tabConteudo}>
  {tabAtiva === "descricao" && (
    <p>{produto.Descricao}</p>
  )}

  {tabAtiva === "ficha" && (
    <div className={styles.fichaTabela}>
      <table>
        <tbody>
          <tr>
            <th>Material</th>
            <td>{produto.Material || produto.Material_Outro || "—"}</td>
          </tr>
          <tr>
            <th>Garantia</th>
            <td>{produto.Garantia || "—"}</td>
          </tr>
          <tr>
            <th>Tecnologia</th>
            <td>{produto.Tecnologia || produto.Tecnologia_Outro || "—"}</td>
          </tr>
          <tr>
            <th>Uso Recomendado</th>
            <td>{produto.Uso_Recomendado || "—"}</td>
          </tr>
          <tr>
            <th>Origem</th>
            <td>{produto.Origem || produto.Origem_Outro || "—"}</td>
          </tr>
          <tr>
            <th>Peso</th>
            <td>{produto.Peso ? `${produto.Peso} kg` : "—"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )}
</div>
</div> {/* fecha infoContainer */}
</div> {/* fecha produtoContainer */}
</>
);
}
