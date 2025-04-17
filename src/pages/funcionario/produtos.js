// pages/funcionario/produtos.js
import { useState, useEffect } from "react";
import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import styles from "@/styles/funcionario.module.css";

export default function AdicionarProdutoFuncionario() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    modelo: "",
    marca: "",
    cor: "",
    preco: "",
    stock: "",
    tipoCategoria: "",
    descricao: "",
    foto: null,
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      const res = await fetch("/api/funcionario/categorias");
      const data = await res.json();
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

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
    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) data.append(key, form[key]);
    });

    const res = await fetch("/api/funcionario/produtos", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    if (res.ok) {
      alert("Produto adicionado com sucesso!");
      setForm({
        nome: "",
        modelo: "",
        marca: "",
        cor: "",
        preco: "",
        stock: "",
        tipoCategoria: "",
        descricao: "",
        foto: null,
      });
    } else {
      alert(result.message || "Erro ao adicionar produto.");
    }
  };

  return (
    <div className={styles.funcionarioContainer}>
      <SidebarFuncionario />

      <main className={styles.mainContent}>
        <h2 style={{ color: "#00264d", marginBottom: "20px" }}>
          🛠️ Adicionar Novo Produto
        </h2>

        <form onSubmit={handleSubmit} className={styles.produtoForm}>
          <input type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
          <input type="text" name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} />
          <input type="text" name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} />
          <input type="text" name="cor" placeholder="Cor" value={form.cor} onChange={handleChange} />
          <input type="number" name="preco" placeholder="Preço (€)" value={form.preco} onChange={handleChange} required />
          <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />

          <select name="tipoCategoria" value={form.tipoCategoria} onChange={handleChange} required>
            <option value="">Seleciona uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.ID_categoria} value={cat.ID_categoria}>
                {cat.Tipo_de_Produto} - {cat.Tipo_de_Categoria}
              </option>
            ))}
          </select>

          <textarea name="descricao" placeholder="Descrição" value={form.descricao} onChange={handleChange} rows={4} />
          <input type="file" name="foto" accept="image/*" onChange={handleChange} />

          <button type="submit">Adicionar Produto</button>
        </form>
      </main>
    </div>
  );
}
