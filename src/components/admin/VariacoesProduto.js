import { useState } from "react";
import styles from "@/styles/VariacoesProduto.module.css";

export default function VariacoesProduto({ variacoes, setVariacoes }) {
  const adicionarVariacao = () => {
    setVariacoes([...variacoes, { cor: "", tamanho: "", stock: 0 }]);
  };

  const removerVariacao = (index) => {
    const novaLista = [...variacoes];
    novaLista.splice(index, 1);
    setVariacoes(novaLista);
  };

  const atualizarVariacao = (index, campo, valor) => {
    const novaLista = [...variacoes];
    novaLista[index][campo] = valor;
    setVariacoes(novaLista);
  };

  return (
    <div className={styles.variacoesContainer}>
      <h3>Variações de Produto</h3>

      {variacoes.map((variacao, index) => (
        <div key={index} className={styles.variacaoItem}>
          <input
            type="text"
            placeholder="Cor"
            value={variacao.cor}
            onChange={(e) => atualizarVariacao(index, "cor", e.target.value)}
            className={styles.inputText}
          />

          <input
            type="text"
            placeholder="Tamanho"
            value={variacao.tamanho}
            onChange={(e) => atualizarVariacao(index, "tamanho", e.target.value)}
            className={styles.inputText}
          />

          <input
            type="number"
            placeholder="Stock"
            value={variacao.stock}
            onChange={(e) =>
              atualizarVariacao(index, "stock", parseInt(e.target.value) || 0)
            }
            className={styles.inputNumber}
          />

          <button
            type="button"
            onClick={() => removerVariacao(index)}
            className={styles.removeButton}
          >
            Remover
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={adicionarVariacao}
        className={styles.addButton}
      >
        Adicionar Variação
      </button>
    </div>
  );
}
