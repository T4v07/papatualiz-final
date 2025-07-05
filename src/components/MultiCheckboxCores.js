// components/MultiCheckboxCores.js
import React from "react";
import styles from "@/styles/MultiCheckboxCores.module.css";

export default function MultiCheckboxCores({ selecionados, setSelecionados, opcoes }) {
  const toggleCor = (cor) => {
    if (selecionados.includes(cor)) {
      setSelecionados(selecionados.filter((c) => c !== cor));
    } else {
      setSelecionados([...selecionados, cor]);
    }
  };

  return (
    <div className={styles.container}>
      {opcoes.map((cor) => (
        <label key={cor} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={selecionados.includes(cor)}
            onChange={() => toggleCor(cor)}
          />
          <span className={styles.colorBox} style={{ backgroundColor: cor.toLowerCase() }}></span>
          {cor}
        </label>
      ))}
    </div>
  );
}
