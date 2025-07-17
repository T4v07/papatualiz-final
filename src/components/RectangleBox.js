import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/RectangleBox.module.css";

const RectangleBox = () => {
  const [produtosCorrida, setProdutosCorrida] = useState([]);
  const [produtosCiclismo, setProdutosCiclismo] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const resCorrida = await fetch("/api/produtos/categoria?tipoCategoria=Corrida");
        const corrida = await resCorrida.json();
        setProdutosCorrida(corrida);

        const resCiclismo = await fetch("/api/produtos/categoria?tipoCategoria=Ciclismo");
        const ciclismo = await resCiclismo.json();
        setProdutosCiclismo(ciclismo);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };

    fetchProdutos();
  }, []);

  const categorias = [
    {
      titulo: "Running Deals!",
      descricao: "Descobre as melhores promoções em artigos de corrida.",
      botao: "Ver mais",
      pesquisa: "corrida",
      imagem:
        "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750422481/jakob-owens-A4579vLezz8-unsplash_lh7k4l.jpg",
      produtos: produtosCorrida,
      isLeft: true,
    },
    {
      titulo: "Cycling Deals!",
      descricao: "Descobre as melhores promoções nas bicicletas.",
      botao: "Ver mais",
      pesquisa: "ciclismo",
      imagem:
        "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750422477/benson-low-p4vpkXBpxBA-unsplash_zxjlk0.jpg",
      produtos: produtosCiclismo,
      isLeft: false,
    },
  ];

  return (
    <div className={styles.container}>
      {categorias.map((cat, index) => (
        <div
          key={index}
          className={styles.section}
          style={{
            flexDirection: cat.isLeft ? "row" : "row-reverse",
          }}
        >
          <div
            className={styles.largeRectangle}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1)), url('${cat.imagem}')`,
            }}
          >
            <div className={styles.textContainerOverlay}>
              <h2>{cat.titulo}</h2>
              <p>{cat.descricao}</p>
              <Link href={`/pesquisa?q=${encodeURIComponent(cat.pesquisa)}`}>
                <button className={styles.blueButton}>{cat.botao}</button>
              </Link>
            </div>
          </div>

          <div className={styles.productsGrid}>
            {cat.produtos.map((produto) => (
              <Link key={produto.id} href={`/produto/${produto.id}`}>
                <div className={styles.productCard}>
                  {produto.novo && (
                    <div className={`${styles.productBadge} ${styles.badgeNovo}`}>
                      Novo
                    </div>
                  )}

                  {produto.stock <= 5 && (
                    <div className={`${styles.productBadge} ${styles.badgeStock}`}>
                      Baixo stock
                    </div>
                  )}

                  <div
                    className={styles.productImage}
                    style={{
                      backgroundImage: `url('${produto.imagem}')`,
                    }}
                  />

                  <p className={styles.productBrand}>{produto.marca}</p>
                  <p className={styles.productFullName}>{produto.nome}</p>
                  <p>
                    {produto.precoOriginal &&
                      produto.precoOriginal !== produto.precoFinal && (
                        <span className={styles.oldPrice}>
                          {produto.precoOriginal}
                        </span>
                      )}
                    <span className={styles.productPrice}>{produto.precoFinal}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RectangleBox;
