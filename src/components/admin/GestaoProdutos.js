import { useEffect, useState } from "react";
import styles from "../../styles/adminDashboard.module.css";
import formStyles from "../../styles/gestaoProdutos.module.css";

export default function GestaoProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    nome: "", modelo: "", marca: "", cor: "",
    preco: "", stock: "", tipoCategoria: "", descricao: "", foto: null,
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, []);

  const fetchProdutos = async () => {
    const res = await fetch("/api/admin/produtos");
    const data = await res.json();
    setProdutos(data);
  };

  const fetchCategorias = async () => {
    const res = await fetch("/api/admin/categorias");
    const data = await res.json();
    setCategorias(data);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setForm((prev) => ({ ...prev, foto: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setCarregando(true);

    const camposObrigatorios = ["nome", "modelo", "marca", "preco", "stock", "tipoCategoria"];
    for (let campo of camposObrigatorios) {
      if (!form[campo]) {
        setErro("Campos obrigatórios não preenchidos.");
        setCarregando(false);
        return;
      }
    }

    const body = new FormData();
    for (const key in form) {
      if (form[key]) body.append(key, form[key]);
    }

    const res = await fetch("/api/admin/produtos", {
      method: "POST",
      body,
    });

    const data = await res.json();
    setCarregando(false);

    if (res.ok) {
      setSucesso("Produto adicionado com sucesso!");
      setForm({
        nome: "", modelo: "", marca: "", cor: "",
        preco: "", stock: "", tipoCategoria: "", descricao: "", foto: null
      });
      fetchProdutos();
    } else {
      setErro(data.message || "Erro ao adicionar produto.");
    }
  };

  const produtosFiltrados = produtos.filter((p) => {
    const termo = filtro.toLowerCase();
    return (
      p.Nome_Produtos.toLowerCase().includes(termo) ||
      p.Marca.toLowerCase().includes(termo) ||
      p.Tipo_de_Categoria.toLowerCase().includes(termo)
    );
  });

  return (
    <div className={styles.dashboardContent}>
      <h2 className={formStyles.titulo}>Gestão de Produtos</h2>

      <form onSubmit={handleSubmit} className={formStyles.form} encType="multipart/form-data">
        <h3>Adicionar Novo Produto</h3>
        {erro && <div className={formStyles.error}>{erro}</div>}
        {sucesso && <div className={formStyles.success}>{sucesso}</div>}

        <input type="text" name="nome" placeholder="Nome do Produto" value={form.nome} onChange={handleChange} />
        <input type="text" name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} />
        <input type="text" name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} />
        <input type="text" name="cor" placeholder="Cor" value={form.cor} onChange={handleChange} />
        <input type="number" name="preco" placeholder="Preço (€)" value={form.preco} onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />

        <select name="tipoCategoria" value={form.tipoCategoria} onChange={handleChange}>
          <option value="">Selecione uma Categoria</option>
          {categorias.map((cat) => (
            <option key={cat.ID_categoria} value={cat.ID_categoria}>
              {cat.Tipo_de_Produto} - {cat.Tipo_de_Categoria}
            </option>
          ))}
        </select>

        <textarea name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} />
        <input type="file" name="foto" onChange={handleChange} />

        <button type="submit" className={formStyles.addButton} disabled={carregando}>
          {carregando ? "Adicionando..." : "Adicionar Produto"}
        </button>
      </form>

      <h3>Lista de Produtos</h3>

      <input
        type="text"
        placeholder="Filtrar por nome, marca ou categoria..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className={formStyles.input}
        style={{ maxWidth: "400px" }}
      />

      <table className={formStyles.table}>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Cor</th>
            <th>Preço</th>
            <th>Stock</th>
            <th>Categoria</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((p) => (
            <tr key={p.ID_produto}>
              <td>
                {p.Foto ? (
                  <img src={p.Foto} alt="produto" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                ) : "Sem Imagem"}
              </td>
              <td>{p.Nome_Produtos}</td>
              <td>{p.Modelo}</td>
              <td>{p.Marca}</td>
              <td>{p.Cor}</td>
              <td>{p.Preco} €</td>
              <td>{p.Stock}</td>
              <td>{p.Tipo_de_Produto} - {p.Tipo_de_Categoria}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
