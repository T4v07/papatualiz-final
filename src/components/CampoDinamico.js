// src/components/CampoDinamico.js
import React, { useEffect, useState } from "react";
import styles from "@/styles/adicprodutoadm.module.css";

const CampoDinamico = ({
  label,
  name,
  value,
  onChange,
  outroValue,
  onOutroChange,
  opcoes = [],
  placeholder = "",
  required = false,
  incluirTodos = false,
}) => {
  const [mostrarOutro, setMostrarOutro] = useState(false);

  useEffect(() => {
    const isOutro = value === "Outro" || (!opcoes.includes(value) && value !== "" && value !== undefined);
    setMostrarOutro(isOutro);
  }, [value, opcoes]);

  return (
    <div className={styles.campo}>
      <label htmlFor={name}>{label}</label>

      {opcoes.length > 0 ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={styles.select}
        >
          <option value="">Seleciona...</option>
          {incluirTodos && <option value="Todos">Todos</option>}
          {opcoes.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
          <option value="Outro">Outro</option>
        </select>
      ) : (
        <input
          id={name}
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
          required={required}
        />
      )}

      {mostrarOutro && (
        <input
          id={`${name}Outro`}
          type="text"
          name={`${name}Outro`}
          value={outroValue || ""}
          onChange={onOutroChange}
          placeholder={`Especifica outro ${label.toLowerCase()}...`}
          className={`${styles.input} ${styles.fadeIn}`}
        />
      )}
    </div>
  );
};

export default CampoDinamico;
