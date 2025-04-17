// /components/admin/GestaoEncomendas.js
import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css";

export default function GestaoEncomendas() {
  const [encomendas, setEncomendas] = useState([]);

  useEffect(() => {
    fetch("/api/encomendas/listar")
      .then((res) => res.json())
      .then((data) => setEncomendas(data));
  }, []);

  const atualizarEstado = async (id, novoEstado) => {
    const res = await fetch("/api/encomendas/atualizar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, novoEstado }),
    });

    if (res.ok) {
      setEncomendas((prev) =>
        prev.map((e) =>
          e.ID_encomenda === id ? { ...e, Estado: novoEstado } : e
        )
      );
    }
  };

  return (
    <div className={styles.pagina}>
      <h2 className={styles.titulo}>📦 Gestão de Encomendas</h2>
      <div className={styles.tabelaContainer}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>ID Cliente</th>
              <th>Morada</th>
              <th>Estado</th>
              <th>Código de Rastreio</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {encomendas.map((e) => (
              <tr key={e.ID_encomenda}>
                <td>{e.Nome_Cliente}</td>
                <td className={styles.morada}>{e.Endereco_entrega}</td>
                <td>
                  <span
                    className={`${styles.estado} ${
                      styles[e.Estado.toLowerCase().replace(" ", "")]
                    }`}
                  >
                    {e.Estado}
                  </span>
                </td>
                <td>{e.Codigo_rastreio}</td>
                <td>
                  <select
                    className={styles.selectEstado}
                    value={e.Estado}
                    onChange={(ev) =>
                      atualizarEstado(e.ID_encomenda, ev.target.value)
                    }
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em preparação">Em preparação</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregue">Entregue</option>
                  </select>
                </td>
              </tr>
            ))}
            {encomendas.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Nenhuma encomenda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
