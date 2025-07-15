import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import styles from "@/styles/Modal.module.css";

export default function ModalHistoricoFuncionario({ funcionario, onClose }) {
  const [historicoCompleto, setHistoricoCompleto] = useState([]);
  const [historicoFiltrado, setHistoricoFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acaoFiltro, setAcaoFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  useEffect(() => {
    if (funcionario?.ID_utilizador) {
      fetch(`/api/admin/historico-funcionario?id=${funcionario.ID_utilizador}`)
        .then((res) => res.json())
        .then((data) => {
          setHistoricoCompleto(data);
          setLoading(false);
        })
        .catch(() => {
          setHistoricoCompleto([]);
          setLoading(false);
        });
    }
  }, [funcionario]);

  useEffect(() => {
    filtrarHistorico();
  }, [acaoFiltro, historicoCompleto]);

  const filtrarHistorico = () => {
    let filtrado = [...historicoCompleto];
    if (acaoFiltro) {
      filtrado = filtrado.filter((log) => log.Acao === acaoFiltro);
    }
    setPagina(1);
    setHistoricoFiltrado(filtrado);
  };

  const formatarData = (data) => {
    return DateTime.fromISO(data).setZone("Europe/Lisbon").toFormat("dd/MM/yyyy, HH:mm:ss");
  };

  const exportarCSV = () => {
    const cabecalho = ["Data", "Ação", "Campo", "De", "Para", "Por"];
    const linhas = historicoFiltrado.map((log) => [
      formatarData(log.DataHora),
      log.Acao,
      log.Campo_alterado || "—",
      log.Campo_alterado === "Ativo"
        ? log.Valor_antigo === "1" ? "Ativo" : "Inativo"
        : log.Valor_antigo || "—",
      log.Campo_alterado === "Ativo"
        ? log.Valor_novo === "1" ? "Ativo" : "Inativo"
        : log.Valor_novo || "—",
      log.Autor_nome?.trim() || "—",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [cabecalho, ...linhas].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `historico_${funcionario.Nome}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPaginas = Math.ceil(historicoFiltrado.length / porPagina);
  const dadosPagina = historicoFiltrado.slice((pagina - 1) * porPagina, pagina * porPagina);
  const opcoesAcao = [...new Set(historicoCompleto.map((log) => log.Acao))];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>📜 Histórico - {funcionario?.Nome}</h3>
        <button onClick={onClose} className={styles.closeButton}>✖</button>

        <div className={styles.filtrosContainer}>
          <select value={acaoFiltro} onChange={(e) => setAcaoFiltro(e.target.value)}>
            <option value="">Todas as ações</option>
            {opcoesAcao.map((acao, i) => (
              <option key={i} value={acao}>{acao}</option>
            ))}
          </select>

          <button className={styles.btnExportar} onClick={exportarCSV}>⬇ Exportar</button>
        </div>

        {loading ? (
          <p>A carregar...</p>
        ) : dadosPagina.length === 0 ? (
          <p>Nenhuma ação registada.</p>
        ) : (
          <table className={styles.historicoTable}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Ação</th>
                <th>Campo</th>
                <th>De</th>
                <th>Para</th>
                <th>Por</th>
              </tr>
            </thead>
            <tbody>
              {dadosPagina.map((log) => (
                <tr key={log.ID_log}>
                  <td>{formatarData(log.DataHora)}</td>
                  <td>{log.Acao}</td>
                  <td>{log.Campo_alterado || "—"}</td>
                  <td>
                    {log.Campo_alterado === "Ativo"
                      ? log.Valor_antigo === "1" ? "Ativo" : "Inativo"
                      : log.Valor_antigo || "—"}
                  </td>
                  <td>
                    {log.Campo_alterado === "Ativo"
                      ? log.Valor_novo === "1" ? "Ativo" : "Inativo"
                      : log.Valor_novo || "—"}
                  </td>
                  <td>{log.Autor_nome?.trim() || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPaginas > 1 && (
          <div className={styles.paginacao}>
            <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>◀</button>
            <span>{pagina} / {totalPaginas}</span>
            <button disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>▶</button>
          </div>
        )}
      </div>
    </div>
  );
}
