import { useEffect, useState, useRef } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import styles from "../../styles/gestaoCategorias.module.css";

export default function GestaoCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState({ tipoProduto: "", tipoCategoria: "" });
  const [modoEdicao, setModoEdicao] = useState(null);
  const [edicao, setEdicao] = useState({ tipoProduto: "", tipoCategoria: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [idApagar, setIdApagar] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const tipoProdutoInputRef = useRef(null);

  useEffect(() => { fetchCategorias(); }, []);
  useEffect(() => {
    if (modoEdicao !== null) {
      const input = document.getElementById("input-edicao-tipoProduto");
      if (input) input.focus();
    }
  }, [modoEdicao]);

  async function fetchCategorias() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/categorias");
      const data = await res.json();
      setCategorias(data);
    } catch {
      setErrorMsg("Erro ao buscar categorias.");
    }
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setNovaCategoria((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdicaoChange(e) {
    const { name, value } = e.target;
    setEdicao((prev) => ({ ...prev, [name]: value }));
  }

  async function adicionarCategoria(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!novaCategoria.tipoProduto.trim() || !novaCategoria.tipoCategoria.trim()) {
      setErrorMsg("Preenche todos os campos antes de adicionar.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCategoria),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Erro ao adicionar categoria.");
      } else {
        setSuccessMsg("Categoria adicionada com sucesso!");
        setNovaCategoria({ tipoProduto: "", tipoCategoria: "" });
        await fetchCategorias();
        const totalPaginas = Math.ceil((categorias.length + 1) / itensPorPagina);
        setPaginaAtual(totalPaginas);
        tipoProdutoInputRef.current?.focus();
      }
    } catch {
      setErrorMsg("Erro ao adicionar categoria.");
    }
    setLoading(false);
  }

  function ativarEdicao(id) {
    const cat = categorias.find((c) => c.ID_categoria === id);
    setModoEdicao(id);
    setEdicao({
      tipoProduto: cat.Tipo_de_Produto,
      tipoCategoria: cat.Tipo_de_Categoria,
    });
  }

  async function editarCategoria(id) {
    setErrorMsg("");
    setSuccessMsg("");
    if (!edicao.tipoProduto.trim() || !edicao.tipoCategoria.trim()) {
      setErrorMsg("Preenche todos os campos antes de salvar.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/categorias", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...edicao }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Erro ao editar categoria.");
      } else {
        setSuccessMsg("Categoria atualizada com sucesso!");
        setModoEdicao(null);
        setEdicao({ tipoProduto: "", tipoCategoria: "" });
        await fetchCategorias();
      }
    } catch {
      setErrorMsg("Erro ao editar categoria.");
    }
    setLoading(false);
  }

  function abrirModal(id) {
    setIdApagar(id);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setIdApagar(null);
  }

  async function apagarCategoria() {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/categorias?id=${idApagar}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.produtos?.length > 0) {
          const nomes = data.produtos.join(", ");
          setErrorMsg(`Não é possível apagar: existem produtos associados (${nomes}).`);
        } else {
          setErrorMsg(data.message || "Erro ao apagar categoria.");
        }
      } else {
        setSuccessMsg("Categoria apagada com sucesso!");
        await fetchCategorias();
        const maxPaginas = Math.ceil((categorias.length - 1) / itensPorPagina);
        if (paginaAtual > maxPaginas && paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
      }
    } catch {
      setErrorMsg("Erro ao apagar categoria.");
    }
    setLoading(false);
    fecharModal();
  }

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const categoriasPagina = categorias.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(categorias.length / itensPorPagina);

  function mudarPagina(n) {
    if (n < 1 || n > totalPaginas) return;
    setPaginaAtual(n);
  }

  return (
    <div className={styles.dashboardContent}>
      <h2 className={styles.titulo}>Gestão de Categorias</h2>

      <form onSubmit={adicionarCategoria} className={styles.form}>
        <h3>Adicionar Categoria</h3>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}
        {successMsg && <div className={styles.success}>{successMsg}</div>}

        <input
          ref={tipoProdutoInputRef}
          type="text"
          name="tipoProduto"
          placeholder="Tipo de Produto"
          value={novaCategoria.tipoProduto}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          type="text"
          name="tipoCategoria"
          placeholder="Tipo de Categoria"
          value={novaCategoria.tipoCategoria}
          onChange={handleChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Aguarde..." : "Adicionar Categoria"}
        </button>
      </form>

      <h3>Lista de Categorias</h3>

      {loading && categorias.length === 0 ? (
        <p>Carregando categorias...</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo de Produto</th>
                <th>Tipo de Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categoriasPagina.map((cat) => (
                <tr key={cat.ID_categoria}>
                  <td>{cat.ID_categoria}</td>
                  <td>
                    {modoEdicao === cat.ID_categoria ? (
                      <input
                        id="input-edicao-tipoProduto"
                        name="tipoProduto"
                        value={edicao.tipoProduto}
                        onChange={handleEdicaoChange}
                        disabled={loading}
                        className={styles.inputEditar}
                      />
                    ) : (
                      cat.Tipo_de_Produto
                    )}
                  </td>
                  <td>
                    {modoEdicao === cat.ID_categoria ? (
                      <input
                        name="tipoCategoria"
                        value={edicao.tipoCategoria}
                        onChange={handleEdicaoChange}
                        disabled={loading}
                        className={styles.inputEditar}
                      />
                    ) : (
                      cat.Tipo_de_Categoria
                    )}
                  </td>
                  <td className={styles.acoes}>
                    {modoEdicao === cat.ID_categoria ? (
                      <>
                        <button className={styles.btnSalvar} onClick={() => editarCategoria(cat.ID_categoria)} disabled={loading}>
                          <FiCheck />
                        </button>
                        <button className={styles.btnCancelar} onClick={() => setModoEdicao(null)} disabled={loading}>
                          <FiX />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className={styles.btnEditar} onClick={() => ativarEdicao(cat.ID_categoria)} disabled={loading}>
                          <FiEdit2 />
                        </button>
                        <button className={styles.btnApagar} onClick={() => abrirModal(cat.ID_categoria)} disabled={loading}>
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className={styles.paginacao}>
              <button disabled={paginaAtual === 1} onClick={() => mudarPagina(paginaAtual - 1)}>
                &lt; Anterior
              </button>
              {[...Array(totalPaginas)].map((_, i) => (
                <button
                  key={i + 1}
                  className={paginaAtual === i + 1 ? styles.paginaAtual : ""}
                  onClick={() => mudarPagina(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={paginaAtual === totalPaginas} onClick={() => mudarPagina(paginaAtual + 1)}>
                Próximo &gt;
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className={styles.modalFundo}>
          <div className={styles.modal}>
            <p>Tem certeza que deseja apagar esta categoria?</p>
            <div className={styles.modalAcoes}>
              <button onClick={apagarCategoria} disabled={loading} className={styles.btnApagar}>
                Sim, apagar
              </button>
              <button onClick={fecharModal} disabled={loading} className={styles.btnCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
