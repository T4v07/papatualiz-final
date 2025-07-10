import React from "react";
import styles from "./ProdutoCarrinho.module.css";

export default function ProdutoCarrinho({ produto, onUpdateQuantidade, onRemover }) {
  const {
    ID_carrinho,
    Nome_Produtos,
    Marca,
    Preco,
    Quantidade,
    Foto,
    Tamanho,
    Cor
  } = produto;

  const nome = Nome_Produtos || produto.nome || "";
  const marca = Marca || produto.marca || "";
  const preco = Preco || produto.preco || 0;
  const quantidade = Quantidade || 1;
  const foto = Foto || "/placeholder.jpg";

  const variacao = [Tamanho && `Tamanho: ${Tamanho}`, Cor && `Cor: ${Cor}`]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className={styles.container}>
      <div className={styles.imagemWrapper}>
        <img src={foto} alt={nome} className={styles.imagem} loading="lazy" />
      </div>

      <div className={styles.info}>
        <h3 className={styles.nome}>{nome}</h3>
        <p className={styles.marca}>{marca}</p>
        {variacao && <p className={styles.variacao}>{variacao}</p>}

        <div className={styles.controles}>
          <div className={styles.quantidadeControl}>
            <button
              className={styles.btnQuantidade}
              onClick={() => onUpdateQuantidade(ID_carrinho, quantidade - 1)}
              disabled={quantidade <= 1}
            >
              −
            </button>
            <span className={styles.quantidade}>{quantidade}</span>
            <button
              className={styles.btnQuantidade}
              onClick={() => onUpdateQuantidade(ID_carrinho, quantidade + 1)}
            >
              +
            </button>
          </div>

          <button
            className={styles.botaoRemover}
            onClick={() => onRemover(ID_carrinho)}
          >
            Remover
          </button>
        </div>
      </div>

      <div className={styles.preco}>
        {preco.toLocaleString("pt-PT", { style: "currency", currency: "EUR" })}
      </div>
    </div>
  );
}
