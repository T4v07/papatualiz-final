import React, { useState } from "react";
import styles from "@/styles/funcionario.module.css";

export default function ComprasClientesFuncionario({ compras = [] }) {
  const [filtro, setFiltro] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(null);

  const handleExportarCSV = () => {
    const csv = [
      ["ID", "Data", "Valor Total", "Cliente", "Estado da Encomenda"],
      ...comprasFiltradas.map((c) => [
        c.ID_compra,
        new Date(c.Data_compra).toLocaleDateString("pt-PT"),
        `${parseFloat(c.Total_Valor).toFixed(2)} €`,
        c.nome_utilizador,
        c.estado_encomenda || "Sem Encomenda",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "compras_clientes.csv";
    a.click();
  };

  const comprasFiltradas = compras.filter((c) => {
    const termo = filtro.toLowerCase();
    const dataCompra = new Date(c.Data_compra);
    const dentroDoIntervalo =
      (!dataInicio || dataCompra >= new Date(dataInicio)) &&
      (!dataFim || dataCompra <= new Date(dataFim));

    return (
      (c.nome_utilizador?.toLowerCase().includes(termo) ||
        String(c.ID_compra).includes(termo)) &&
      dentroDoIntervalo
    );
  });

  const totalVendas = comprasFiltradas.reduce((acc, c) => acc + parseFloat(c.Total_Valor), 0);

  return (
    <div>
      <div className={styles.filtrosContainer}>
        <input
          type="text"
          placeholder="🔍 Nome ou ID"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        <button onClick={handleExportarCSV}>📤 Exportar CSV</button>
      </div>

      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Valor Total</th>
            <th>Cliente</th>
            <th>Estado da Encomenda</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          {comprasFiltradas.map((compra) => (
            <React.Fragment key={compra.ID_compra}>
              <tr>
                <td>{compra.ID_compra}</td>
                <td>{new Date(compra.Data_compra).toLocaleDateString("pt-PT")}</td>
                <td>{parseFloat(compra.Total_Valor).toFixed(2)} €</td>
                <td>{compra.nome_utilizador}</td>
                <td>{compra.estado_encomenda || "Sem Encomenda"}</td>
                <td>
                  <button
                    className={styles.btnDetalhes}
                    onClick={() =>
                      setDetalhesVisiveis(
                        detalhesVisiveis === compra.ID_compra ? null : compra.ID_compra
                      )
                    }
                  >
                    {detalhesVisiveis === compra.ID_compra ? "Ocultar" : "Ver"}
                  </button>
                </td>
              </tr>
              {detalhesVisiveis === compra.ID_compra && (
                <tr>
                  <td colSpan="6">
                    <strong>🛒 Produtos:</strong>
                    <ul className={styles.listaProdutos}>
                      {(compra.produtos || []).map((p, i) => (
                        <li key={i}>
                          ➤ {p.nome} - {p.quantidade}x -{" "}
                          {parseFloat(p.preco).toFixed(2)} €
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="6" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total Geral: {totalVendas.toFixed(2)} €
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
