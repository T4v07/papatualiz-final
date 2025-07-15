import { useEffect, useState, useContext } from "react";
import styles from "@/styles/gestaoAdminUtilizadores.module.css";
import ModalUtilizadores from "@/components/ModalUtilizadores";
import AuthContext from "@/context/AuthContext";

export default function GestaoUtilizadores() {
  const { user } = useContext(AuthContext);

  const [utilizadores, setUtilizadores] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordem, setOrdem] = useState({ coluna: null, direcao: "asc" });
  const [modalAberta, setModalAberta] = useState(false);
  const [utilizadorSelecionado, setUtilizadorSelecionado] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const [loading, setLoading] = useState(false);
  const [erroFetch, setErroFetch] = useState(null);

  useEffect(() => {
    fetchUtilizadores();
  }, [user]);

  const fetchUtilizadores = async () => {
    if (!user) return;

    setLoading(true);
    setErroFetch(null);
    try {
      const res = await fetch("/api/admin/utilizadores");
      if (!res.ok) throw new Error("Erro ao carregar utilizadores");
      let data = await res.json();

      // Remover o utilizador atual da lista
      data = data.filter((u) => u.ID_utilizador !== user.ID_utilizador);
      setUtilizadores(data);
      setPaginaAtual(1);
    } catch (error) {
      setErroFetch(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTipoChange = (e) => setFiltroTipo(e.target.value);
  const handleTextoChange = (e) => setFiltroTexto(e.target.value);

  const utilizadoresFiltrados = utilizadores
    .filter((u) => {
      if (filtroTipo === "todos") return true;
      return (u.Tipo_de_Conta || "").toLowerCase() === filtroTipo.toLowerCase();
    })
    .filter((u) => {
      const termo = filtroTexto.toLowerCase();
      return (
        u.Nome.toLowerCase().includes(termo) ||
        u.Username.toLowerCase().includes(termo) ||
        u.Email.toLowerCase().includes(termo)
      );
    });

  const utilizadoresOrdenados = [...utilizadoresFiltrados].sort((a, b) => {
    if (!ordem.coluna) return 0;
    let valA = a[ordem.coluna] ?? "";
    let valB = b[ordem.coluna] ?? "";
    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();
    return ordem.direcao === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const totalPaginas = Math.ceil(utilizadoresOrdenados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const utilizadoresPag = utilizadoresOrdenados.slice(indiceInicio, indiceInicio + itensPorPagina);

  const exportarCSV = () => {
    const cabecalho = ["ID", "Nome", "Username", "Email", "Telefone", "Tipo", "Ativo"];
    const linhas = utilizadoresOrdenados.map((u) => [
      u.ID_utilizador, u.Nome, u.Username, u.Email, u.Telefone,
      u.Tipo_de_Conta, u.ativo === 1 ? "Ativo" : "Inativo"
    ]);
    const conteudo = [cabecalho, ...linhas]
      .map((linha) => linha.map((campo) => `"${campo}"`).join(","))
      .join("\n");
    const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "utilizadores.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const total = utilizadores.length;
  const ativos = utilizadores.filter((u) => u.ativo === 1).length;
  const inativos = total - ativos;

  const mudarOrdenacao = (coluna) => {
    setOrdem((prev) =>
      prev.coluna === coluna
        ? { coluna, direcao: prev.direcao === "asc" ? "desc" : "asc" }
        : { coluna, direcao: "asc" }
    );
  };

  const iconeOrdenacao = (coluna) => {
    if (ordem.coluna !== coluna) return "";
    return ordem.direcao === "asc" ? " ▲" : " ▼";
  };

  const abrirModal = (utilizador) => {
    setUtilizadorSelecionado(utilizador);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setUtilizadorSelecionado(null);
  };

  const atualizarLista = async () => {
    await fetchUtilizadores();
  };

  const mudarPagina = (num) => {
    if (num < 1 || num > totalPaginas) return;
    setPaginaAtual(num);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Gestão de Utilizadores</h2>

      <div className={styles.filtros}>
        <select value={filtroTipo} onChange={handleTipoChange} className={styles.selectAcao}>
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
          className={styles.inputPesquisa}
        />
      </div>

      <div className={styles.topBar}>
        <p className={styles.resumo}>
          Total: {total} | Ativos: {ativos} ✅ | Inativos: {inativos} ❌
        </p>
        <button className={styles.btnExportar} onClick={exportarCSV}>
          Exportar CSV
        </button>
      </div>

      {loading && <p>Carregando utilizadores...</p>}
      {erroFetch && <p style={{ color: "red" }}>{erroFetch}</p>}

      {!loading && !erroFetch && (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => mudarOrdenacao("ID_utilizador")}>ID{iconeOrdenacao("ID_utilizador")}</th>
                <th onClick={() => mudarOrdenacao("Nome")}>Nome{iconeOrdenacao("Nome")}</th>
                <th onClick={() => mudarOrdenacao("Username")}>Username{iconeOrdenacao("Username")}</th>
                <th onClick={() => mudarOrdenacao("Email")}>Email{iconeOrdenacao("Email")}</th>
                <th onClick={() => mudarOrdenacao("Telefone")}>Telefone{iconeOrdenacao("Telefone")}</th>
                <th onClick={() => mudarOrdenacao("Tipo_de_Conta")}>Tipo{iconeOrdenacao("Tipo_de_Conta")}</th>
                <th onClick={() => mudarOrdenacao("ativo")}>Ativo{iconeOrdenacao("ativo")}</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {utilizadoresPag.map((u) => (
                <tr key={u.ID_utilizador}>
                  <td>{u.ID_utilizador}</td>
                  <td>{u.Nome}</td>
                  <td>{u.Username}</td>
                  <td>{u.Email}</td>
                  <td>{u.Telefone}</td>
                  <td>
                    <span className={`${styles.badge} ${styles["badge_" + u.Tipo_de_Conta]}`}>
                      {u.Tipo_de_Conta}
                    </span>
                  </td>
                  <td className={styles.tdAtivo}>{u.ativo === 1 ? "✅" : "❌"}</td>
                  <td>
                    <button onClick={() => abrirModal(u)} className={styles.btnAcao}>
                      Editar / Gerir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.paginacao}>
            <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1} className={styles.btnPagina}>
              &lt; Anterior
            </button>
            {[...Array(totalPaginas).keys()].map((num) => {
              const pagina = num + 1;
              return (
                <button
                  key={pagina}
                  onClick={() => mudarPagina(pagina)}
                  className={`${styles.btnPagina} ${pagina === paginaAtual ? styles.paginaAtiva : ""}`}
                >
                  {pagina}
                </button>
              );
            })}
            <button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas} className={styles.btnPagina}>
              Próximo &gt;
            </button>
          </div>
        </>
      )}

      {modalAberta && (
        <ModalUtilizadores
          utilizador={utilizadorSelecionado}
          onClose={fecharModal}
          onSave={atualizarLista}
          userLogadoID={user.ID_utilizador}  // <- Passa aqui o id do user logado
        />
      )}
    </div>
  );
}
