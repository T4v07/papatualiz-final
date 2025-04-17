import React, { useState, useEffect } from "react";
import styles from "@/styles/funcionario.module.css";

export default function GestaoEncomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [filtroRastreio, setFiltroRastreio] = useState("");

  useEffect(() => {
    fetchEncomendas();
  }, []);

  const fetchEncomendas = async () => {
    try {
      const res = await fetch("/api/funcionario/encomendas");
      const data = await res.json();
      setEncomendas(data);
    } catch (err) {
      console.error("Erro ao buscar encomendas:", err);
    }
  };

  const handleAtualizarEstado = async (idEncomenda, novoEstado) => {
    try {
      const res = await fetch("/api/funcionario/encomendas/atualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEncomenda, novoEstado }),
      });

      if (res.ok) {
        fetchEncomendas();
      }
    } catch (err) {
      console.error("Erro ao atualizar estado:", err);
    }
  };

  const handleExportarCSV = () => {
    const csv = [
      ["ID", "Compra", "Rastreio", "Estado", "Endereco"],
      ...encomendasFiltradas.map((e) => [
        e.ID_encomenda,
        e.ID_compra,
        e.Codigo_rastreio,
        e.Estado,
        e.Endereco_entrega || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "encomendas.csv";
    a.click();
  };

  const encomendasFiltradas = encomendas.filter((e) =>
    e.Codigo_rastreio.toLowerCase().includes(filtroRastreio.toLowerCase())
  );

  const corEstado = (estado) => {
    switch (estado) {
      case "pendente":
        return { color: "gray" };
      case "em preparação":
        return { color: "orange" };
      case "enviado":
        return { color: "blue" };
      case "entregue":
        return { color: "green" };
      default:
        return {};
    }
  };

  return (
    <div>
      <div className={styles.filtrosContainer}>
        <input
          type="text"
          placeholder="📦 Código de rastreio"
          value={filtroRastreio}
          onChange={(e) => setFiltroRastreio(e.target.value)}
        />
        <button onClick={handleExportarCSV}>📤 Exportar CSV</button>
      </div>

      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Compra</th>
            <th>Rastreio</th>
            <th>Estado</th>
            <th>Entrega</th>
            <th>Morada</th>
          </tr>
        </thead>
        <tbody>
          {encomendasFiltradas.map((e) => (
            <tr key={e.ID_encomenda}>
              <td>{e.ID_encomenda}</td>
              <td>{e.ID_compra}</td>
              <td>{e.Codigo_rastreio}</td>
              <td style={corEstado(e.Estado)}>
                <select
                  value={e.Estado}
                  onChange={(ev) => handleAtualizarEstado(e.ID_encomenda, ev.target.value)}
                >
                  <option value="pendente">pendente</option>
                  <option value="em preparação">em preparação</option>
                  <option value="enviado">enviado</option>
                  <option value="entregue">entregue</option>
                </select>
              </td>
              <td>
                {e.Estado === "enviado" ? (
                  <button onClick={() => handleAtualizarEstado(e.ID_encomenda, "entregue")}>
                    Confirmar entrega
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {e.Endereco_entrega ? (
                  <button
                    onClick={() => alert("📍 " + e.Endereco_entrega)}
                  >
                    Ver
                  </button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
