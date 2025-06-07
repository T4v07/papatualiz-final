// src/components/CampoDinamico.js
import React, { useEffect, useState } from "react";
import styles from "@/styles/gestaoProdutos.module.css";

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
          type="text"
          name={`${name}Outro`}
          value={outroValue || ""}
          onChange={onOutroChange}
          placeholder={`Especifica outro ${label.toLowerCase()}...`}
          className={styles.input}
        />
      )}
    </div>
  );
};

export default CampoDinamico;
