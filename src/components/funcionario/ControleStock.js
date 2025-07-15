import { useState, useEffect } from "react";
import styles from "@/styles/estoque.module.css";
import ModalEditarVariacoes from "@/components/admin/ModalEditarVariacoes";

export default function GestaoEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [marcaSelecionada, setMarcaSelecionada] = useState("");
  const [stockMin, setStockMin] = useState("");
  const [stockMax, setStockMax] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [pagina, setPagina] = useState(1);
  const produtosPorPagina = 10;

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    const res = await fetch("/api/admin/estoque");
    const data = await res.json();
    setProdutos(data);
  };

  const stockCritico = (qtd) => qtd < 5;

  const filtrar = produtos.filter((p) => {
    const nomeInclui = p.Nome_Produtos.toLowerCase().includes(busca.toLowerCase());
    const marcaFiltrada = marcaSelecionada
      ? p.Marca.toLowerCase().includes(marcaSelecionada.toLowerCase())
      : true;
    const dentroDoMinimo = stockMin !== "" ? p.stock_total >= Number(stockMin) : true;
    const dentroDoMaximo = stockMax !== "" ? p.stock_total <= Number(stockMax) : true;
    return nomeInclui && marcaFiltrada && dentroDoMinimo && dentroDoMaximo;
  });

  const totalPaginas = Math.ceil(filtrar.length / produtosPorPagina);
  const inicio = (pagina - 1) * produtosPorPagina;
  const fim = inicio + produtosPorPagina;
  const produtosPaginados = filtrar.slice(inicio, fim);

  const exportarCSV = () => {
    const cabecalho = "ID,Produto,Marca,Tamanhos,Stock Total\n";
    const linhas = filtrar
      .map((p) => `${p.ID_produto},"${p.Nome_Produtos}","${p.Marca}","${p.tamanhos}",${p.stock_total}`)
      .join("\n");
    const blob = new Blob([cabecalho + linhas], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "stock_export.csv";
    link.click();
  };

  return (
    <div className={styles.estoqueContainer}>
      <h2 className={styles.titulo}>Controle de Stock</h2>

      <div className={styles.filtroLinha}>
        <input
          type="text"
          placeholder="🔍 Procurar produto..."
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(1);
          }}
          className={styles.inputTexto}
        />

        <input
          type="text"
          list="marcas-lista"
          value={marcaSelecionada}
          onChange={(e) => {
            setMarcaSelecionada(e.target.value);
            setPagina(1);
          }}
          placeholder="Filtrar por marca"
          className={styles.inputTexto}
        />
        <datalist id="marcas-lista">
          {[...new Set(produtos.map((p) => p.Marca))].map((marca, idx) => (
            <option key={idx} value={marca} />
          ))}
        </datalist>

        <input
          type="number"
          placeholder="Stock Mínimo"
          value={stockMin}
          onChange={(e) => setStockMin(e.target.value)}
          className={styles.inputNumero}
        />
        <input
          type="number"
          placeholder="Stock Máximo"
          value={stockMax}
          onChange={(e) => setStockMax(e.target.value)}
          className={styles.inputNumero}
        />

        <button className={styles.exportarBtn} onClick={exportarCSV}>
          ⬇ Exportar CSV
        </button>
      </div>

      <div className={styles.tabelaContainer}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Marca</th>
              <th>Tamanhos</th>
              <th>Stock Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosPaginados.map((p) => (
              <tr key={p.ID_produto} className={stockCritico(p.stock_total) ? styles.critico : ""}>
                <td>{p.ID_produto}</td>
                <td>{p.Nome_Produtos}</td>
                <td>{p.Marca}</td>
                <td>{p.tamanhos}</td>
                <td>{p.stock_total}</td>
                <td>
                  <button className={styles.editarBtn} onClick={() => setProdutoSelecionado(p)}>
                    ✏️ Ver / Editar
                  </button>
                </td>
              </tr>
            ))}
            {produtosPaginados.length === 0 && (
              <tr>
                <td colSpan="6" className={styles.semResultados}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className={styles.paginacao}>
          <button onClick={() => setPagina((prev) => Math.max(prev - 1, 1))} disabled={pagina === 1}>
            ◀ Anterior
          </button>
          <span>
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={pagina === totalPaginas}
          >
            Seguinte ▶
          </button>
        </div>
      )}

      {produtoSelecionado && (
        <ModalEditarVariacoes
          produtoId={produtoSelecionado.ID_produto}
          onClose={() => setProdutoSelecionado(null)}
          onAtualizar={fetchProdutos}
        />
      )}
    </div>
  );
}
