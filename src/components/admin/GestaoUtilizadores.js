import { useEffect, useState } from "react";
import styles from "@/styles/gestaoUtilizadores.module.css";

export default function GestaoUtilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [edicoes, setEdicoes] = useState({});

  useEffect(() => {
    fetchUtilizadores();
  }, []);

  const fetchUtilizadores = async () => {
    const res = await fetch("/api/admin/utilizadores");
    const data = await res.json();
    setUtilizadores(data);
  };

  const handleTipoChange = (e) => setFiltroTipo(e.target.value);
  const handleTextoChange = (e) => setFiltroTexto(e.target.value);

  const handleAtivar = async (id) => {
    await fetch(`/api/admin/utilizadores`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, campo: "ativo", valor: 1 }),
    });
    fetchUtilizadores();
  };

  const handleDesativar = async (id) => {
    await fetch(`/api/admin/utilizadores`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, campo: "ativo", valor: 0 }),
    });
    fetchUtilizadores();
  };

  const handleEditarTipo = (id, novoTipo) => {
    setEdicoes((prev) => ({ ...prev, [id]: novoTipo }));
  };

  const salvarTipo = async (id) => {
    if (!edicoes[id]) return;
    await fetch(`/api/admin/utilizadores`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, campo: "Tipo_de_Conta", valor: edicoes[id] }),
    });
    setEdicoes((prev) => {
      const novo = { ...prev };
      delete novo[id];
      return novo;
    });
    fetchUtilizadores();
  };

  const utilizadoresFiltrados = utilizadores
    .filter((u) => {
      if (filtroTipo === "todos") return true;
      return u.Tipo_de_Conta.toLowerCase() === filtroTipo.toLowerCase();
    })
    .filter((u) => {
      const termo = filtroTexto.toLowerCase();
      return (
        u.Nome.toLowerCase().includes(termo) ||
        u.Username.toLowerCase().includes(termo) ||
        u.Email.toLowerCase().includes(termo)
      );
    });

  return (
    <div className={styles.container}>
      <h2>Gestão de Utilizadores</h2>

      <div className={styles.filtros}>
        <select value={filtroTipo} onChange={handleTipoChange}>
          <option value="todos">Todos</option>
          <option value="cliente">Clientes</option>
          <option value="funcionario">Funcionários</option>
          <option value="admin">Admins</option>
        </select>

        <input
          type="text"
          placeholder="Pesquisar por nome, user, email..."
          value={filtroTexto}
          onChange={handleTextoChange}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Username</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Tipo</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {utilizadoresFiltrados.map((u) => (
            <tr key={u.ID_utilizador}>
              <td>{u.ID_utilizador}</td>
              <td>{u.Nome}</td>
              <td>{u.Username}</td>
              <td>{u.Email}</td>
              <td>{u.Telefone}</td>
              <td>{u.Tipo_de_Conta}</td>
              <td>{u.ativo === 1 ? "✅" : "❌"}</td>
              <td>
                {u.ativo === 1 ? (
                  <button onClick={() => handleDesativar(u.ID_utilizador)}>Desativar</button>
                ) : (
                  <button onClick={() => handleAtivar(u.ID_utilizador)}>Ativar</button>
                )}

                <select
                  value={edicoes[u.ID_utilizador] || ""}
                  onChange={(e) =>
                    handleEditarTipo(u.ID_utilizador, e.target.value)
                  }
                >
                  <option value="">Definir como...</option>
                  <option value="cliente">Cliente</option>
                  <option value="funcionario">Funcionário</option>
                  <option value="admin">Admin</option>
                </select>

                <button onClick={() => salvarTipo(u.ID_utilizador)}>Salvar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
