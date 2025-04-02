import { useEffect, useState } from "react";
import styles from "@/styles/verCompras.module.css";

export default function VerCompras() {
  const [compras, setCompras] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [detalheAtivo, setDetalheAtivo] = useState(null);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    const res = await fetch("/api/admin/compras");
    const data = await res.json();
    setCompras(data);
  };

  const comprasFiltradas = compras.filter((c) =>
    c.Nome_Cliente.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2>Ver Compras</h2>

      <input
        type="text"
        placeholder="Filtrar por nome do cliente..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className={styles.filtro}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Total (€)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {comprasFiltradas.map((c) => (
            <>
              <tr key={c.ID_compra}>
                <td>{c.ID_compra}</td>
                <td>{c.Nome_Cliente}</td>
                <td>{new Date(c.Data_compra).toLocaleString()}</td>
                <td>{Number(c.Total_Valor).toFixed(2)} €</td>
                <td>
                  <button onClick={() => setDetalheAtivo(detalheAtivo === c.ID_compra ? null : c.ID_compra)}>
                    {detalheAtivo === c.ID_compra ? "Ocultar" : "Ver Detalhes"}
                  </button>
                </td>
              </tr>
              {detalheAtivo === c.ID_compra && (
                <tr>
                  <td colSpan="5">
                    <div className={styles.produtos}>
                      {c.produtos.map((p, i) => (
                        <div key={i} className={styles.produtoItem}>
                          <img src={p.Foto} alt={p.Nome_Produtos} />
                          <div>
                            <strong>{p.Nome_Produtos}</strong>
                            <p>Preço: {p.Preco} €</p>
                            <p>Quantidade: {p.Quantidade}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
