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
  const [favorito, setFavorito] = useState(false);
  const [sugeridos, setSugeridos] = useState([]);
  const [tabAtiva, setTabAtiva] = useState("descricao");

  useEffect(() => {
    if (id) {
      fetch(`/api/verprodutos/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduto(data);

          try {
            const vistos = JSON.parse(localStorage.getItem("produtosVistosRecentemente")) || [];
            const jaExiste = vistos.some((p) => p.ID_produto === data.ID_produto);
            if (!jaExiste) {
              const novosVistos = [data, ...vistos];
              const limitados = novosVistos.slice(0, 4);
              localStorage.setItem("produtosVistosRecentemente", JSON.stringify(limitados));
            }
          } catch (err) {
            console.error("Erro ao guardar produto:", err);
          }

          const favs = JSON.parse(localStorage.getItem("favoritos")) || [];
          setFavorito(favs.some((p) => p.ID_produto === data.ID_produto));

          // Buscar sugeridos
          fetch(`/api/produtos/sugeridos?categoriaId=${data.Tipo_de_Categoria}&produtoId=${data.ID_produto}`)
            .then((res) => {
              if (!res.ok) throw new Error("Erro ao buscar sugeridos");
              return res.json();
            })
            .then((resData) => setSugeridos(resData))
            .catch((err) => {
              console.warn("Nenhum sugerido encontrado ou erro:", err);
              setSugeridos([]);
            });
        });
    }
  }, [id]);

  const adicionarCarrinho = async () => {
    if (!user?.ID_utilizador) return alert("Faz login primeiro.");
    await fetch("/api/carrinho/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.ID_utilizador,
        id_produto: produto.ID_produto,
        quantidade: 1,
      }),
    });
    alert("Adicionado ao carrinho!");
  };

  const alternarFavorito = () => {
    const favs = JSON.parse(localStorage.getItem("favoritos")) || [];
    const existe = favs.find((p) => p.ID_produto === produto.ID_produto);
    let atualizados;
    if (existe) {
      atualizados = favs.filter((p) => p.ID_produto !== produto.ID_produto);
      setFavorito(false);
    } else {
      atualizados = [produto, ...favs];
      setFavorito(true);
    }
    localStorage.setItem("favoritos", JSON.stringify(atualizados));
  };

  if (!produto) return <p>A carregar...</p>;

  return (
    <>
      <Navbar />

      {/* Breadcrumb completo */}
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link> &gt;{" "}
        <Link href={`/pesquisa?categoria=${produto.Tipo_de_Categoria}`}>
          {produto.Tipo_de_Produto}
        </Link> &gt; <span>{produto.Nome_Produtos}</span>
      </div>

      <div className={styles.produtoContainer}>
        <div className={styles.produtoImagem}>
          <img src={produto.Foto} alt={produto.Nome_Produtos} />
        </div>

        <div className={styles.produtoInfo}>
          <div className={styles.headerInfo}>
            <h1>{produto.Nome_Produtos}</h1>
            <button
              className={styles.favoritoBtn}
              onClick={alternarFavorito}
              title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              {favorito ? "❤️" : "🤍"}
            </button>
          </div>

          <p className={styles.preco}>{parseFloat(produto.Preco).toFixed(2)} €</p>
          <p className={styles.marcaModelo}>
            {produto.Marca} – {produto.Modelo}
          </p>
          <p className={styles.categoria}>{produto.Tipo_de_Produto}</p>
          <p className={styles.stock}>
            {produto.Stock > 0 ? `Disponível (${produto.Stock} unidades)` : "Indisponível"}
          </p>
          <p className={styles.referencia}>Ref: #{produto.ID_produto}</p>

          <button className={styles.btnCarrinho} onClick={adicionarCarrinho}>
            🛒 Adicionar ao Carrinho
          </button>

          <div className={styles.tabsContainer}>
            <div className={styles.tabButtons}>
              <button
                className={tabAtiva === "descricao" ? styles.ativo : ""}
                onClick={() => setTabAtiva("descricao")}
              >
                Descrição
              </button>
              <button
                className={tabAtiva === "ficha" ? styles.ativo : ""}
                onClick={() => setTabAtiva("ficha")}
              >
                Ficha Técnica
              </button>
            </div>

            <div className={styles.tabConteudo}>
              {tabAtiva === "descricao" && <p>{produto.Descricao}</p>}
              {tabAtiva === "ficha" && <p>{produto.Ficha_Tecnica}</p>}
            </div>
          </div>
        </div>
      </div>

      {sugeridos.length > 0 && (
        <div className={styles.sugeridos}>
          <h3>Também podes gostar</h3>
          <div className={styles.listaSugeridos}>
            {sugeridos.map((sug) => (
              <div key={sug.ID_produto} className={styles.cardSugerido}>
                <Link href={`/produto/${sug.ID_produto}`}>
                  <img src={sug.Foto} alt={sug.Nome_Produtos} />
                  <p>{sug.Nome_Produtos}</p>
                  <span>{parseFloat(sug.Preco).toFixed(2)} €</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
