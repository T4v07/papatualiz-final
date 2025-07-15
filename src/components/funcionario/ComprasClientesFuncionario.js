import { useEffect, useState, Fragment } from "react";
import styles from "@/styles/verCompras.module.css";
import ModalDetalhesCompra from "@/components/admin/ModalDetalhesCompra";
import { Download } from "lucide-react";

export default function VerCompras() {
  const [compras, setCompras] = useState([]);
  const [compraSelecionada, setCompraSelecionada] = useState(null);
  const [filtro, setFiltro] = useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [valorMin, setValorMin] = useState("");
  const [valorMax, setValorMax] = useState("");
  const [incluirArquivadas, setIncluirArquivadas] = useState(false);

  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const porPagina = 8;

  useEffect(() => {
    fetchCompras();
  }, [pagina, incluirArquivadas]);

  const fetchCompras = async () => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("pagina", pagina);
      queryParams.append("porPagina", porPagina);

      if (dataInicio) queryParams.append("dataInicio", dataInicio);
      if (dataFim) queryParams.append("dataFim", dataFim);
      if (valorMin) queryParams.append("valorMin", valorMin);
      if (valorMax) queryParams.append("valorMax", valorMax);
      if (incluirArquivadas) queryParams.append("incluirArquivadas", "true");

      const res = await fetch(`/api/admin/compras?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Erro ao buscar compras");
      const data = await res.json();

      setCompras(data.compras || []);
      setTotalPaginas(Math.ceil(data.totalCompras / porPagina));
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  const aplicarFiltros = () => {
    setPagina(1);
    fetchCompras();
  };

  const exportarCSV = () => {
    const linhas = [
      ["ID", "Cliente", "Data", "Total (€)"],
      ...comprasFiltradas.map((c) => [
        c.ID_compra,
        c.Nome_Cliente,
        new Date(c.Data_criacao).toLocaleString("pt-PT"),
        Number(c.Total_Valor).toFixed(2).replace(".", ",") + " €",
      ]),
    ];

    const conteudo = linhas.map((linha) => linha.join(";")).join("\n");
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "compras.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const comprasFiltradas = compras.filter((c) =>
    c.Nome_Cliente?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Ver Compras</h2>

      <input
        type="text"
        placeholder="Filtrar por nome do cliente..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className={styles.filtro}
      />

      <div className={styles.filtrosAvancados}>
        <input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        <input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        <input type="number" placeholder="Valor Mínimo" value={valorMin} onChange={(e) => setValorMin(e.target.value)} />
        <input type="number" placeholder="Valor Máximo" value={valorMax} onChange={(e) => setValorMax(e.target.value)} />

        <label className={styles.checkboxWrapper}>
          <input type="checkbox" checked={incluirArquivadas} onChange={() => setIncluirArquivadas(!incluirArquivadas)} />
          Incluir Arquivadas
        </label>

        <button onClick={aplicarFiltros}>Filtrar</button>
      </div>

      <div className={styles.exportarContainer}>
        <button className={styles.exportarBtn} onClick={exportarCSV}>
          <Download size={16} style={{ marginRight: 6 }} />
          Exportar CSV
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Comprador</th>
            <th>Data</th>
            <th>Total (€)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {comprasFiltradas.map((c) => (
            <Fragment key={c.ID_compra}>
              <tr>
                <td>{c.ID_compra}</td>
                <td>{c.Nome_Cliente}</td>
                <td>{new Date(c.Data_criacao).toLocaleString("pt-PT")}</td>
                <td>{Number(c.Total_Valor).toFixed(2)} €</td>
                <td>
                  <button onClick={() => setCompraSelecionada(c)}>Ver Detalhes</button>
                </td>
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>

      <div className={styles.paginacao}>
        <button onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}>
          ◀ Anterior
        </button>
        <span>Página {pagina} de {totalPaginas}</span>
        <button onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>
          Seguinte ▶
        </button>
      </div>

      {compraSelecionada && (
        <ModalDetalhesCompra
          compra={compraSelecionada}
          onClose={() => setCompraSelecionada(null)}
          fetchCompras={fetchCompras}
        />
      )}
    </div>
  );
}
