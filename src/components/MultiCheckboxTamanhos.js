// src/components/MultiCheckboxTamanhos.js
import React from "react";
import styles from "./checkboxTamanho.module.css";

export default function MultiCheckboxTamanhos({
  grupoSelecionado,
  grupos,
  selecionados,
  setSelecionados,
  visivel
}) {
  if (!visivel || !grupoSelecionado || !grupos) return null;

  const grupoAtual = grupos.find((g) => g.value === grupoSelecionado);
  const opcoes = grupoAtual?.opcoes || [];

  const toggleOpcao = (opcao) => {
    setSelecionados((prev) =>
      prev.includes(opcao)
        ? prev.filter((item) => item !== opcao)
        : [...prev, opcao]
    );
  };

  const toggleTodos = () => {
    if (selecionados.length === opcoes.length) {
      setSelecionados([]);
    } else {
      setSelecionados([...opcoes]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        Tamanhos seleccionados:{" "}
        <strong>
          {selecionados.length > 0 ? selecionados.join(", ") : "Nenhum"}
        </strong>
      </div>
      <div className={styles.lista}>
        <label>
          <input
            type="checkbox"
            checked={selecionados.length === opcoes.length}
            onChange={toggleTodos}
          />
          <span className={styles.opcao}>Todos</span>
        </label>
        {opcoes.map((opcao) => (
          <label key={opcao}>
            <input
              type="checkbox"
              checked={selecionados.includes(opcao)}
              onChange={() => toggleOpcao(opcao)}
            />
            <span className={styles.opcao}>{opcao}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
