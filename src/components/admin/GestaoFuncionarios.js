import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ModalAdicionarFuncionario from "@/components/ModalAdicionarFuncionario";
import ModalHistoricoFuncionario from "@/components/ModalHistoricoFuncionario.js";
import styles from "@/styles/GestaoFuncionarios.module.css";

export default function GestaoFuncionarios() {
  const { user } = useContext(AuthContext);
  const [funcionarios, setFuncionarios] = useState([]);
  const [filtros, setFiltros] = useState({
    pesquisa: "",
    ativo: "todos",
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    const res = await fetch("/api/admin/funcionarios");
    const data = await res.json();
    setFuncionarios(data);
  };

  const adicionarFuncionario = async (novoFuncionario) => {
    const res = await fetch("/api/admin/funcionarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...novoFuncionario, autorNome: user?.nome || "Administrador" }),
    });

    if (res.ok) {
      await fetchFuncionarios();
      setMostrarModal(false);
    } else {
      alert("Erro ao adicionar funcionário.");
    }
  };

  const atualizarFuncionario = async (id, campo, valor) => {
    const res = await fetch("/api/admin/funcionarios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, campo, valor, autorNome: user?.nome || "Administrador" }),
    });

    if (res.ok) {
      await fetchFuncionarios();
    } else {
      alert("Erro ao atualizar funcionário.");
    }
  };

  const excluirFuncionario = async (id) => {
    const res = await fetch("/api/admin/funcionarios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, autorNome: user?.nome || "Administrador" }),
    });

    if (res.ok) {
      await fetchFuncionarios();
    } else {
      alert("Erro ao excluir funcionário.");
    }
  };

  const funcionariosFiltrados = funcionarios.filter((f) => {
    const termo = filtros.pesquisa.toLowerCase();
    const correspondePesquisa =
      f.Nome.toLowerCase().includes(termo) ||
      f.Username.toLowerCase().includes(termo) ||
      f.Email.toLowerCase().includes(termo) ||
      f.Telefone.toLowerCase().includes(termo);

    const correspondeAtivo =
      filtros.ativo === "todos" ||
      (filtros.ativo === "ativos" && f.Ativo) ||
      (filtros.ativo === "inativos" && !f.Ativo);

    return correspondePesquisa && correspondeAtivo;
  });

  const totalPaginas = Math.ceil(funcionariosFiltrados.length / porPagina);
  const funcionariosPaginados = funcionariosFiltrados.slice((pagina - 1) * porPagina, pagina * porPagina);

  return (
    <div className={styles.pagina}>
      <h2 className={styles.titulo}>👨‍💼 Gestão de Funcionários</h2>

      <div className={styles.filtrosContainer}>
        <input
          type="text"
          placeholder="🔍 Pesquisar por nome, email..."
          value={filtros.pesquisa}
          onChange={(e) => {
            setFiltros({ ...filtros, pesquisa: e.target.value });
            setPagina(1);
          }}
          className={styles.inputFiltro}
        />

        <select
          value={filtros.ativo}
          onChange={(e) => {
            setFiltros({ ...filtros, ativo: e.target.value });
            setPagina(1);
          }}
          className={styles.selectFiltro}
        >
          <option value="todos">Todos</option>
          <option value="ativos">Apenas Ativos</option>
          <option value="inativos">Apenas Inativos</option>
        </select>

        <button className={styles.botaoPrincipal} onClick={() => setMostrarModal(true)}>
          ➕ Adicionar Novo Funcionário
        </button>
      </div>

      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Username</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionariosPaginados.map((f) => (
            <tr key={f.ID_utilizador}>
              <td>{f.Nome}</td>
              <td>{f.Username}</td>
              <td>{f.Email}</td>
              <td>{f.Telefone}</td>
              <td>{f.Ativo ? "✅" : "❌"}</td>
              <td>
                <button
                  className={styles.botaoHistorico}
                  onClick={() => setFuncionarioSelecionado(f)}
                >
                  📜 Histórico
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPaginas > 1 && (
        <div className={styles.paginacao}>
          <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>◀</button>
          <span>{pagina} / {totalPaginas}</span>
          <button onClick={() => setPagina(pagina + 1)} disabled={pagina === totalPaginas}>▶</button>
        </div>
      )}

      {mostrarModal && (
        <ModalAdicionarFuncionario
          onClose={() => setMostrarModal(false)}
          onAdicionar={adicionarFuncionario}
        />
      )}

      {funcionarioSelecionado && (
        <ModalHistoricoFuncionario
          funcionario={funcionarioSelecionado}
          onClose={() => setFuncionarioSelecionado(null)}
        />
      )}
    </div>
  );
}
