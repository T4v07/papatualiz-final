import { useEffect, useState } from "react";
import styles from "../../styles/gestaoProdutos.module.css";

export default function GestaoCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState({
    tipoProduto: "",
    tipoCategoria: "",
  });
  const [modoEdicao, setModoEdicao] = useState(null);
  const [edicao, setEdicao] = useState({});

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    const res = await fetch("/api/admin/categorias");
    const data = await res.json();
    setCategorias(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarCategoria = async (e) => {
    e.preventDefault();
    if (!novaCategoria.tipoProduto || !novaCategoria.tipoCategoria) return;
    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaCategoria),
    });
    if (res.ok) {
      setNovaCategoria({ tipoProduto: "", tipoCategoria: "" });
      fetchCategorias();
    }
  };

  const apagarCategoria = async (id) => {
    const confirmar = confirm("Tens a certeza que queres apagar esta categoria?");
    if (!confirmar) return;
    const res = await fetch(`/api/admin/categorias?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchCategorias();
  };

  const ativarEdicao = (id) => {
    const cat = categorias.find((c) => c.ID_categoria === id);
    setModoEdicao(id);
    setEdicao({
      tipoProduto: cat.Tipo_de_Produto,
      tipoCategoria: cat.Tipo_de_Categoria,
    });
  };

  const editarCategoria = async (id) => {
    const res = await fetch("/api/admin/categorias", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...edicao }),
    });
    if (res.ok) {
      setModoEdicao(null);
      setEdicao({});
      fetchCategorias();
    }
  };

  return (
    <div className={styles.dashboardContent}>
      <h2 className={styles.titulo}>Gestão de Categorias</h2>

      <form onSubmit={adicionarCategoria} className={styles.form}>
        <h3>Adicionar Categoria</h3>
        <input
          type="text"
          name="tipoProduto"
          placeholder="Tipo de Produto"
          value={novaCategoria.tipoProduto}
          onChange={handleChange}
        />
        <input
          type="text"
          name="tipoCategoria"
          placeholder="Tipo de Categoria"
          value={novaCategoria.tipoCategoria}
          onChange={handleChange}
        />
        <button type="submit">Adicionar Categoria</button>
      </form>

      <h3>Lista de Categorias</h3>
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
          {categorias.map((cat) => (
            <tr key={cat.ID_categoria}>
              <td>{cat.ID_categoria}</td>
              <td>
                {modoEdicao === cat.ID_categoria ? (
                  <input
                    value={edicao.tipoProduto}
                    onChange={(e) => setEdicao({ ...edicao, tipoProduto: e.target.value })}
                  />
                ) : (
                  cat.Tipo_de_Produto
                )}
              </td>
              <td>
                {modoEdicao === cat.ID_categoria ? (
                  <input
                    value={edicao.tipoCategoria}
                    onChange={(e) => setEdicao({ ...edicao, tipoCategoria: e.target.value })}
                  />
                ) : (
                  cat.Tipo_de_Categoria
                )}
              </td>
              <td>
                {modoEdicao === cat.ID_categoria ? (
                  <button onClick={() => editarCategoria(cat.ID_categoria)}>Salvar</button>
                ) : (
                  <button onClick={() => ativarEdicao(cat.ID_categoria)}>Editar</button>
                )}
                <button onClick={() => apagarCategoria(cat.ID_categoria)}>Apagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
