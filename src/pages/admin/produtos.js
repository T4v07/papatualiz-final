import React, { useState, useEffect, useMemo } from "react";
import SidebarAdmin from "../../components/admin/SidebarAdmin";
import GestaoProdutos from "../../components/admin/GestaoProdutos";
import styles from "@/styles/gestaoProdutos.module.css";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";

export default function ProdutosAdminPage() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Filtros e ordenação
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState(null); // novo filtro ativo/inativo
  const [ordenacao, setOrdenacao] = useState({ value: "Nome_Produtos", label: "Nome (A-Z)" });

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Modal edição
  const [modalAberta, setModalAberta] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  useEffect(() => {
    async function fetchDados() {
      try {
        const [resProdutos, resCategorias] = await Promise.all([
          axios.get("/api/admin/listarprodutos"),
          axios.get("/api/admin/listarcategorias"),
        ]);
        setProdutos(resProdutos.data);
        setCategorias(resCategorias.data);
      } catch (error) {
        console.error("Erro ao carregar produtos ou categorias:", error);
      }
    }
    fetchDados();
  }, []);

  const mostrarValorOuOutro = (valor, outro) => {
    try {
      if (!valor) return "";
      const parsed = JSON.parse(valor);
      if (Array.isArray(parsed)) {
        if (parsed[0] === "Outro" && outro && outro.trim() !== "") {
          return outro;
        }
        return parsed.join(", ");
      }
      return valor;
    } catch {
      if (valor === "Outro" && outro && outro.trim() !== "") {
        return outro;
      }
      return valor;
    }
  };

  // Opções para react-select categorias (label sem ID)
  const opcoesCategorias = categorias.map((cat) => ({
    value: cat.ID_categoria,
    label: `${cat.Tipo_de_Produto} - ${cat.Tipo_de_Categoria}`,
  }));

  // Opções filtro ativo/inativo
  const opcoesFiltroAtivo = [
    { value: null, label: "Todos" },
    { value: true, label: "Ativos" },
    { value: false, label: "Inativos" },
  ];

  // Opções de ordenação
  const opcoesOrdenacao = [
    { value: "Nome_Produtos", label: "Nome (A-Z)" },
    { value: "Preco_asc", label: "Preço (menor para maior)" },
    { value: "Preco_desc", label: "Preço (maior para menor)" },
    { value: "Stock_asc", label: "Stock (menor para maior)" },
    { value: "Stock_desc", label: "Stock (maior para menor)" },
  ];

  // Toggle Ativo/Inativo
  const toggleAtivo = async (produto) => {
    try {
      await axios.put("/api/admin/toggleProdutoAtivo", {
        id: produto.ID_produto,
        ativo: produto.Ativo === 0, // ativa se inativo e vice-versa
      });
      toast.success(`Produto ${produto.Ativo === 0 ? "ativado" : "desativado"} com sucesso`);
      onAtualizar();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar estado do produto");
    }
  };

  // Atualiza lista produtos
  const onAtualizar = async () => {
    try {
      const res = await axios.get("/api/admin/listarprodutos");
      setProdutos(res.data);
    } catch (error) {
      console.error("Erro ao atualizar produtos:", error);
    }
  };

  // Filtrar, ordenar e paginar produtos
  const produtosFiltrados = useMemo(() => {
    let dados = [...produtos];

    if (filtroTexto.trim() !== "") {
      dados = dados.filter(
        (p) =>
          p.Nome_Produtos.toLowerCase().includes(filtroTexto.toLowerCase()) ||
          (typeof p.Marca === "string" && p.Marca.toLowerCase().includes(filtroTexto.toLowerCase()))
      );
    }

    if (filtroCategoria) {
      dados = dados.filter((p) => p.Tipo_de_Categoria === filtroCategoria.value);
    }

    if (filtroAtivo !== null) {
      dados = dados.filter((p) => (filtroAtivo ? p.Ativo === 1 : p.Ativo === 0));
    }

    if (ordenacao) {
      switch (ordenacao.value) {
        case "Preco_asc":
          dados.sort((a, b) => parseFloat(a.Preco) - parseFloat(b.Preco));
          break;
        case "Preco_desc":
          dados.sort((a, b) => parseFloat(b.Preco) - parseFloat(a.Preco));
          break;
        case "Stock_asc":
          dados.sort((a, b) => (a.Stock ?? 0) - (b.Stock ?? 0));
          break;
        case "Stock_desc":
          dados.sort((a, b) => (b.Stock ?? 0) - (a.Stock ?? 0));
          break;
        case "Nome_Produtos":
        default:
          dados.sort((a, b) => a.Nome_Produtos.localeCompare(b.Nome_Produtos));
      }
    }

    return dados;
  }, [produtos, filtroTexto, filtroCategoria, filtroAtivo, ordenacao]);

  const produtosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return produtosFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [produtosFiltrados, paginaAtual]);

  // Abrir modal de edição
  const abrirModalEditar = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setProdutoSelecionado(null);
  };

  return (
    <div className={styles.adminContainer}>
      <SidebarAdmin />
      <main className={styles.mainContent}>
        <h1>Gestão de Produtos</h1>

        {/* Filtros e pesquisa */}
        <div className={styles.filtrosContainer}>
          <input
            type="text"
            placeholder="Pesquisar nome ou marca"
            value={filtroTexto}
            onChange={(e) => {
              setFiltroTexto(e.target.value);
              setPaginaAtual(1);
            }}
          />

          <div>
            <Select
              options={opcoesCategorias}
              value={filtroCategoria}
              onChange={(opt) => {
                setFiltroCategoria(opt);
                setPaginaAtual(1);
              }}
              placeholder="Filtrar por categoria"
              isClearable
            />
          </div>

          <div>
            <Select
              options={opcoesFiltroAtivo}
              value={opcoesFiltroAtivo.find(o => o.value === filtroAtivo)}
              onChange={(opt) => {
                setFiltroAtivo(opt.value);
                setPaginaAtual(1);
              }}
              placeholder="Filtrar por status"
              isClearable={false}
            />
          </div>

          <div>
            <Select
              options={opcoesOrdenacao}
              value={ordenacao}
              onChange={(opt) => {
                setOrdenacao(opt);
                setPaginaAtual(1);
              }}
              placeholder="Ordenar por"
              isClearable={false}
            />
          </div>
        </div>

        {/* Tabela */}
        <div className={styles.tabelaContainer}>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Marca</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtosPaginados.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
              {produtosPaginados.map((prod) => (
                <tr key={prod.ID_produto}>
                  <td>{mostrarValorOuOutro(prod.Nome_Produtos, "")}</td>
                  <td>{mostrarValorOuOutro(prod.Marca, prod.MarcaOutro)}</td>
                  <td>
                    {typeof prod.Preco === "number"
                      ? prod.Preco.toFixed(2)
                      : typeof prod.Preco === "string" && !isNaN(parseFloat(prod.Preco))
                      ? parseFloat(prod.Preco).toFixed(2)
                      : ""}
                  </td>
                  <td>
                    {prod.Tipo_de_Categoria && categorias.find((c) => c.ID_categoria === prod.Tipo_de_Categoria)
                      ? `${categorias.find((c) => c.ID_categoria === prod.Tipo_de_Categoria).Tipo_de_Produto} - ${
                          categorias.find((c) => c.ID_categoria === prod.Tipo_de_Categoria).Tipo_de_Categoria
                        }`
                      : ""}
                  </td>
                  <td style={{ color: prod.Ativo ? "green" : "red", fontWeight: "bold" }}>
                    {prod.Ativo ? "Ativo" : "Inativo"}
                  </td>
                  <td>
                    <button onClick={() => abrirModalEditar(prod)}>Editar</button>
                    <button
                      onClick={() => toggleAtivo(prod)}
                      style={{
                        marginLeft: "8px",
                        backgroundColor: prod.Ativo ? "red" : "green",
                        color: "white",
                        border: "none",
                        padding: "5px 8px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      title={prod.Ativo ? "Desativar Produto" : "Ativar Produto"}
                    >
                      {prod.Ativo ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className={styles.paginacaoContainer}>
          <button onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>
            {"<"}
          </button>
          <span>
            Página {paginaAtual} de {Math.ceil(produtosFiltrados.length / itensPorPagina)}
          </span>
          <button
            onClick={() => setPaginaAtual((p) => Math.min(p + 1, Math.ceil(produtosFiltrados.length / itensPorPagina)))}
            disabled={paginaAtual === Math.ceil(produtosFiltrados.length / itensPorPagina)}
          >
            {">"}
          </button>
        </div>

        {/* Modal de edição */}
        {modalAberta && produtoSelecionado && (
          <GestaoProdutos
            produto={produtoSelecionado}
            categorias={categorias}
            onClose={fecharModal}
            onAtualizar={onAtualizar}
          />
        )}
      </main>
    </div>
  );
}
