    import React, { useState, useEffect } from "react";
    import styles from "@/styles/gestaoProdutos.module.css";
    import CampoDinamico from "@/components/CampoDinamico";
    import MultiCheckboxTamanhos from "@/components/MultiCheckboxTamanhos";
    import axios from "axios";
    import { ToastContainer, toast } from "react-toastify";
    import "react-toastify/dist/ReactToastify.css";


    const GestaoProdutos = () => {
      const [nome, setNome] = useState("");
      const [modelo, setModelo] = useState("");
      const [marca, setMarca] = useState("");
      const [marcaOutro, setMarcaOutro] = useState("");
      const [genero, setGenero] = useState("");
      const [generoOutro, setGeneroOutro] = useState("");
      const [idade, setIdade] = useState("");
      const [idadeOutro, setIdadeOutro] = useState("");
      const [cor, setCor] = useState("");
      const [corOutro, setCorOutro] = useState("");
      const [descricao, setDescricao] = useState("");
      const [fichaTecnica, setFichaTecnica] = useState("");
      const [preco, setPreco] = useState("");
      const [peso, setPeso] = useState("");
      const [stock, setStock] = useState("");
      const [foto, setFoto] = useState(null);
      const [material, setMaterial] = useState("");
      const [materialOutro, setMaterialOutro] = useState("");
      const [usoRecomendado, setUsoRecomendado] = useState("");
      const [previewFoto, setPreviewFoto] = useState("");
      const [garantia, setGarantia] = useState("");
      const [tecnologia, setTecnologia] = useState("");
      const [tecnologiaOutro, setTecnologiaOutro] = useState("");
      const [origem, setOrigem] = useState("");
      const [origemOutro, setOrigemOutro] = useState("");
      const [desconto, setDesconto] = useState("");
      const [novo, setNovo] = useState("Não");
      const [tipoCategoria, setTipoCategoria] = useState("");
      const [categorias, setCategorias] = useState([]);
      const [produtoEditando, setProdutoEditando] = useState(null);

      const [grupoTamanho, setGrupoTamanho] = useState("");
      const [tamanhosRoupa, setTamanhosRoupa] = useState([]);
      const [tamanhosCalcado, setTamanhosCalcado] = useState([]);
      const [tamanhosObjeto, setTamanhosObjeto] = useState([]);

      const gruposTamanho = [
        {
          value: "roupa",
          opcoes: ["Bebé", "Criança", "Júnior", "Adolescente", "Adulto", "XS", "S", "M", "L", "XL", "XXL"],
        },
        {
          value: "calcado",
          opcoes: ["Bebé", "Criança", "Júnior", "Adolescente", "Adulto", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"],
        },
        {
          value: "objeto",
          opcoes: ["Pequeno", "Médio", "Grande"],
        },
      ];
      const [produtos, setProdutos] = useState([]);

      useEffect(() => {
        const fetchCategorias = async () => {
          try {
            const res = await axios.get("/api/categorias");
            setCategorias(res.data);
          } catch (error) {
            console.error("Erro ao buscar categorias:", error);
          }
        };

        const fetchProdutos = async () => {
          try {
            const res = await axios.get("/api/admin/produtos");
            setProdutos(res.data);
          } catch (error) {
            console.error("Erro ao buscar produtos:", error);
          }
        };

        fetchCategorias();

        fetchProdutos();
      }, []);

    const limparCampos = () => {
      setProdutoEditando(null);
      setNome("");
      setModelo("");
      setMarca("");
      setMarcaOutro("");
      setGenero("");
      setGeneroOutro("");
      setIdade("");
      setIdadeOutro("");
      setCor("");
      setCorOutro("");
      setDescricao("");
      setFichaTecnica("");
      setPreco("");
      setPeso("");
      setStock("");
      setMaterial("");
      setMaterialOutro("");
      setUsoRecomendado("");
      setGarantia("");
      setTecnologia("");
      setTecnologiaOutro("");
      setOrigem("");
      setOrigemOutro("");
      setDesconto("");
      setNovo("Não");
      setTipoCategoria("");
      setGrupoTamanho("");
      setTamanhosRoupa([]);
      setTamanhosCalcado([]);
      setTamanhosObjeto([]);
      setFoto(null);
      setPreviewFoto(""); // Agora limpa a pré-visualização da foto ao cancelar

      };

      const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();

  formData.append("nome", nome);
  formData.append("modelo", modelo);
  formData.append("marca", marca === "Outro" ? marcaOutro : marca);
  formData.append("marcaOutro", marcaOutro);
  formData.append("genero", genero === "Outro" ? generoOutro : genero);
  formData.append("generoOutro", generoOutro);
  formData.append("idade", idade === "Outro" ? idadeOutro : idade);
  formData.append("idadeOutro", idadeOutro);
  formData.append("cor", cor === "Outro" ? corOutro : cor);
  formData.append("corOutro", corOutro);
  formData.append("descricao", descricao);
  formData.append("fichaTecnica", fichaTecnica);
  formData.append("preco", preco);
  formData.append("peso", peso);
  formData.append("stock", stock);
  formData.append("material", material === "Outro" ? materialOutro : material);
  formData.append("materialOutro", materialOutro);
  formData.append("usoRecomendado", usoRecomendado);
  formData.append("garantia", garantia);
  formData.append("tecnologia", tecnologia === "Outro" ? tecnologiaOutro : tecnologia);
  formData.append("tecnologiaOutro", tecnologiaOutro);
  formData.append("origem", origem === "Outro" ? origemOutro : origem);
  formData.append("origemOutro", origemOutro);
  formData.append("desconto", desconto);
  formData.append("novo", novo);
  formData.append("tipoCategoria", parseInt(tipoCategoria));
  formData.append("tamanhoRoupa", grupoTamanho === "roupa" ? tamanhosRoupa.join(",") : "");
  formData.append("tamanhoCalcado", grupoTamanho === "calcado" ? tamanhosCalcado.join(",") : "");
  formData.append("tamanhoObjeto", grupoTamanho === "objeto" ? tamanhosObjeto.join(",") : "");

  if (foto) {
    formData.append("foto", foto);
  }

  try {
    if (produtoEditando) {
      formData.append("id", produtoEditando);
      await axios.put("/api/admin/produtos", formData);
      toast.success("Produto atualizado com sucesso!");
    } else {
      await axios.post("/api/admin/produtos", formData);
      toast.success("Produto adicionado com sucesso!");
    }

    limparCampos();
    const res = await axios.get("/api/admin/produtos");
    setProdutos(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Erro ao guardar o produto.");
  }
};


      const handleEditar = async (e) => {
  e.preventDefault();
  const formData = new FormData();

  formData.append("nome", nome);
  formData.append("modelo", modelo);
  formData.append("marca", marca === "Outro" ? marcaOutro : marca);
  formData.append("marcaOutro", marcaOutro);
  formData.append("genero", genero === "Outro" ? generoOutro : genero);
  formData.append("generoOutro", generoOutro);
  formData.append("idade", idade === "Outro" ? idadeOutro : idade);
  formData.append("idadeOutro", idadeOutro);
  formData.append("cor", cor === "Outro" ? corOutro : cor);
  formData.append("corOutro", corOutro);
  formData.append("descricao", descricao);
  formData.append("fichaTecnica", fichaTecnica);
  formData.append("preco", parseFloat(preco) || 0);
  formData.append("peso", peso);
  formData.append("stock", parseInt(stock) || 0);
  formData.append("material", material === "Outro" ? materialOutro : material);
  formData.append("materialOutro", materialOutro);
  formData.append("usoRecomendado", usoRecomendado);
  formData.append("garantia", garantia);
  formData.append("tecnologia", tecnologia === "Outro" ? tecnologiaOutro : tecnologia);
  formData.append("tecnologiaOutro", tecnologiaOutro);
  formData.append("origem", origem === "Outro" ? origemOutro : origem);
  formData.append("origemOutro", origemOutro);
  formData.append("desconto", parseFloat(desconto) || 0);
  formData.append("novo", novo);
  formData.append("tipoCategoria", tipoCategoria ? parseInt(tipoCategoria) : null);
  formData.append("tamanhoRoupa", grupoTamanho === "roupa" ? tamanhosRoupa.join(",") : "");
  formData.append("tamanhoCalcado", grupoTamanho === "calcado" ? tamanhosCalcado.join(",") : "");
  formData.append("tamanhoObjeto", grupoTamanho === "objeto" ? tamanhosObjeto.join(",") : "");

  if (foto) formData.append("foto", foto);

  try {
    await axios.put(`/api/admin/produtos/${produtoEditando}`, formData);
    toast.success("Produto atualizado com sucesso!");
    limparCampos();
    const res = await axios.get("/api/admin/produtos");
    setProdutos(res.data);
  } catch (err) {
    if (err.response) {
      console.error("Erro da API:", err.response.data);
      toast.error("Erro ao atualizar produto: " + (err.response.data.message || "Ver consola"));
    } else {
      console.error("Erro inesperado:", err);
      toast.error("Erro inesperado ao atualizar produto. Ver consola.");
    }
  }
};


      const handleEliminar = async (id) => {
  const confirmar = confirm("Tem a certeza que deseja eliminar este produto?");
  if (!confirmar) return;

  try {
    await axios.delete(`/api/admin/produtos/${id}`);
    toast.success("Produto eliminado com sucesso!");
    const res = await axios.get("/api/admin/produtos");
    setProdutos(res.data);
  } catch (error) {
    console.error("Erro ao eliminar produto:", error);
    toast.error("Erro ao eliminar produto.");
  }
};

    const opcoesPadrao = {
  marca: ["Nike", "Adidas", "Puma"],
  genero: ["Masculino", "Feminino", "Unissexo"],
  idade: ["Bebé", "Criança", "Júnior", "Adolescente", "Adulto"],
  cor: ["Preto", "Branco", "Azul", "Vermelho"],
  material: ["Algodão", "Poliéster", "Nylon"],
  tecnologia: ["DryFit", "AirCool"],
  origem: ["Portugal", "China", "Espanha"],
};

const carregarProdutoParaEdicao = (produto) => {
  setProdutoEditando(produto.ID_produto);

  setNome(produto.Nome_Produtos || "");
  setModelo(produto.Modelo || "");
  setPreco(produto.Preco || "");
  setPeso(produto.Peso || "");
  setDescricao(produto.Descricao || "");
  setStock(produto.Stock || "");
  setFichaTecnica(produto.Ficha_Tecnica || "");
  setNovo(produto.Novo === 1 ? "Sim" : "Não");
  setTipoCategoria(produto.ID_categoria ? String(produto.ID_categoria) : "");
  setUsoRecomendado(produto.Uso_Recomendado || "");
  setGarantia(produto.Garantia || "");
  setDesconto(produto.Desconto || "");
  setPreviewFoto(produto.Foto || "");

  // Campos com lógica "Outro"
  const verificarCampo = (valor, outroValor, opcoes, setPrincipal, setOutro) => {
    if (outroValor && outroValor.trim() !== "") {
      setPrincipal("Outro");
      setOutro(outroValor);
    } else if (valor && !opcoes.includes(valor)) {
      setPrincipal("Outro");
      setOutro(valor);
    } else if (valor) {
      setPrincipal(valor);
      setOutro("");
    } else {
      setPrincipal("");
      setOutro("");
    }
  };

  verificarCampo(produto.Marca, produto.MarcaOutro, opcoesPadrao.marca, setMarca, setMarcaOutro);
  verificarCampo(produto.Genero, produto.GeneroOutro, opcoesPadrao.genero, setGenero, setGeneroOutro);
  verificarCampo(produto.Idade, produto.IdadeOutro, opcoesPadrao.idade, setIdade, setIdadeOutro);
  verificarCampo(produto.Cor, produto.CorOutro, opcoesPadrao.cor, setCor, setCorOutro);
  verificarCampo(produto.Material, produto.MaterialOutro, opcoesPadrao.material, setMaterial, setMaterialOutro);
  verificarCampo(produto.Tecnologia, produto.TecnologiaOutro, opcoesPadrao.tecnologia, setTecnologia, setTecnologiaOutro);
  verificarCampo(produto.Origem, produto.OrigemOutro, opcoesPadrao.origem, setOrigem, setOrigemOutro);

  // Tamanhos
  if (produto.Tamanho_Roupa) {
    setGrupoTamanho("roupa");
    setTamanhosRoupa(produto.Tamanho_Roupa.split(","));
  } else if (produto.Tamanho_Calcado) {
    setGrupoTamanho("calcado");
    setTamanhosCalcado(produto.Tamanho_Calcado.split(","));
  } else if (produto.Tamanho_Objeto) {
    setGrupoTamanho("objeto");
    setTamanhosObjeto(produto.Tamanho_Objeto.split(","));
  } else {
    setGrupoTamanho("");
    setTamanhosRoupa([]);
    setTamanhosCalcado([]);
    setTamanhosObjeto([]);
  }
};

// Valores padrão para mostrar nos campos dinâmicos
const padraoMarca = produtoEditando ? (marca === "Outro" ? marcaOutro : marca) : "";
const padraoGenero = produtoEditando ? (genero === "Outro" ? generoOutro : genero) : "";
const padraoIdade = produtoEditando ? (idade === "Outro" ? idadeOutro : idade) : "";
const padraoCor = produtoEditando ? (cor === "Outro" ? corOutro : cor) : "";
const padraoMaterial = produtoEditando ? (material === "Outro" ? materialOutro : material) : "";
const padraoTecnologia = produtoEditando ? (tecnologia === "Outro" ? tecnologiaOutro : tecnologia) : "";
const padraoOrigem = produtoEditando ? (origem === "Outro" ? origemOutro : origem) : "";


      return (
        <div className={styles.container}>
          <h2>{produtoEditando ? "Editar Produto" : "Adicionar Produto"}</h2>

          <form onSubmit={produtoEditando ? handleEditar : handleSubmit} className={styles.form}>
            <h3>Informações Básicas</h3>
            <hr />
            <input type="text" placeholder="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />

            <CampoDinamico
              label="Marca"
              name="marca"
              value={marca}
              outroValue={marcaOutro}
              onChange={(e) => setMarca(e.target.value)}
              onOutroChange={(e) => setMarcaOutro(e.target.value)}
              opcoes={["Nike", "Adidas", "Puma"]}
              padrao={padraoMarca}
            />

            <CampoDinamico
              label="Género"
              name="genero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              outroValue={generoOutro}
              onOutroChange={(e) => setGeneroOutro(e.target.value)}
              opcoes={["Masculino", "Feminino", "Unissexo"]}
              incluirTodos={true}
              padrao={padraoGenero}
            />

            <CampoDinamico
              label="Idade"
              name="idade"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              outroValue={idadeOutro}
              onOutroChange={(e) => setIdadeOutro(e.target.value)}
              opcoes={["Bebé", "Criança", "Júnior", "Adolescente", "Adulto"]}
              padrao={padraoIdade}
            />

            <CampoDinamico
              label="Cor"
              name="cor"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              outroValue={corOutro}
              onOutroChange={(e) => setCorOutro(e.target.value)}
              opcoes={["Preto", "Branco", "Azul", "Vermelho"]}
              padrao={padraoCor}
            />

            <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
<textarea placeholder="Ficha Técnica" value={fichaTecnica} onChange={(e) => setFichaTecnica(e.target.value)} />

<input
  type="number"
  placeholder="Preço (€)"
  value={preco}
  onChange={(e) => setPreco(e.target.value)}
/>

<input
  type="text"
  placeholder="Peso (ex: 1.5 kg ou 500 g)"
  value={peso}
  onChange={(e) => setPeso(e.target.value)}
/>

<input
  type="number"
  placeholder="Stock"
  value={stock}
  onChange={(e) => setStock(e.target.value)}
/>

<h3>Características Técnicas</h3>
<hr />

<CampoDinamico
  label="Material"
  name="material"
  value={material}
  onChange={(e) => setMaterial(e.target.value)}
  outroValue={materialOutro}
  onOutroChange={(e) => setMaterialOutro(e.target.value)}
  opcoes={["Algodão", "Poliéster", "Nylon"]}
  padrao={padraoMaterial}
/>

<CampoDinamico
  label="Tecnologia"
  name="tecnologia"
  value={tecnologia}
  onChange={(e) => setTecnologia(e.target.value)}
  outroValue={tecnologiaOutro}
  onOutroChange={(e) => setTecnologiaOutro(e.target.value)}
  opcoes={["DryFit", "AirCool"]}
  padrao={padraoTecnologia}
/>

<CampoDinamico
  label="Origem"
  name="origem"
  value={origem}
  onChange={(e) => setOrigem(e.target.value)}
  outroValue={origemOutro}
  onOutroChange={(e) => setOrigemOutro(e.target.value)}
  opcoes={["Portugal", "China", "Espanha"]}
  padrao={padraoOrigem}
/>


            <input type="text" placeholder="Uso Recomendado" value={usoRecomendado} onChange={(e) => setUsoRecomendado(e.target.value)} />
            <input type="text" placeholder="Garantia (ex: 2 anos)" value={garantia} onChange={(e) => setGarantia(e.target.value)} />
            <input type="number" placeholder="Desconto (%)" value={desconto} onChange={(e) => setDesconto(e.target.value)} />

            <h3>Outras Informações</h3>
            <hr />
            <label>Produto Novo?</label>
            <select value={novo} onChange={(e) => setNovo(e.target.value)}>
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>

            <label>Foto:</label>
            <input type="file" onChange={(e) => setFoto(e.target.files[0])} />
            {previewFoto && (
      <div style={{ marginTop: "10px" }}>
        <p>Foto Atual:</p>
        <img
          src={previewFoto}
          alt="Foto atual"
          style={{ maxWidth: "200px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
        />
      </div>
    )}

            <label>Categoria:</label>
            <select value={tipoCategoria} onChange={(e) => setTipoCategoria(e.target.value)}>
              <option value="">Selecione...</option>
              {categorias.map((cat) => (
                <option key={cat.ID_categoria} value={cat.ID_categoria}>
                  {cat.Tipo_de_Produto} - {cat.Tipo_de_Categoria}
                </option>
              ))}
            </select>

            <h3>Grupo de Tamanhos</h3>
            <hr />
            <select
              value={grupoTamanho}
              onChange={(e) => {
                const val = e.target.value;
                setGrupoTamanho(val);
                setTamanhosRoupa([]);
                setTamanhosCalcado([]);
                setTamanhosObjeto([]);
              }}
            >
              <option value="">Selecione...</option>
              <option value="roupa">Roupa</option>
              <option value="calcado">Calçado</option>
              <option value="objeto">Objeto</option>
            </select>

            <MultiCheckboxTamanhos
              grupoSelecionado={grupoTamanho}
              grupos={gruposTamanho}
              selecionados={
                grupoTamanho === "roupa"
                  ? tamanhosRoupa
                  : grupoTamanho === "calcado"
                  ? tamanhosCalcado
                  : tamanhosObjeto
              }
              setSelecionados={
                grupoTamanho === "roupa"
                  ? setTamanhosRoupa
                  : grupoTamanho === "calcado"
                  ? setTamanhosCalcado
                  : setTamanhosObjeto
              }
              visivel={grupoTamanho !== ""}
            />

            <div style={{ display: "flex", gap: "1rem", marginTop: "20px" }}>
              <button type="submit" className={styles.addButton}>
                {produtoEditando ? "Atualizar Produto" : "Guardar Produto"}
              </button>
              {produtoEditando && (
                <button
                  type="button"
                  onClick={limparCampos}
                  className={styles.addButton}
                  style={{ backgroundColor: "#ccc", color: "#000" }}
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>

          <h3 style={{ marginTop: "3rem" }}>Produtos Existentes</h3>
          <hr />
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Preço</th>
                <th>Stock</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr
                  key={produto.ID_produto}
                  style={{
                    backgroundColor:
                      produtoEditando === produto.ID_produto ? "#fffae6" : "transparent",
                    border:
                      produtoEditando === produto.ID_produto ? "2px solid #ffa500" : "none",
                  }}
                >
                  <td>{produto.Nome_Produtos}</td>
                  <td>{produto.Modelo}</td>
                  <td>{produto.Marca}</td>
                  <td>{produto.Preco}€</td>
                  <td>{produto.Stock}</td>
                  <td>{produto.Tipo_de_Produto} - {produto.Tipo_de_Categoria}</td>
                  <td>
                    <button onClick={() => carregarProdutoParaEdicao(produto)}>Editar</button>
                    <button
                      onClick={() => handleEliminar(produto.ID_produto)}
                      style={{ marginLeft: "0.5rem", backgroundColor: "#f44336", color: "#fff" }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
      );
    };

    export default GestaoProdutos;
