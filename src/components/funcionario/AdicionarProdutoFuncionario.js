import React, { useState, useEffect } from "react";
import styles from "@/components/funcionario/AdicionarProdutoFuncionario.module.css";
import CampoDinamico from "@/components/CampoDinamico";
import MultiCheckboxTamanhos from "@/components/MultiCheckboxTamanhos";
import SidebarFuncionario from "@/components/funcionario/SidebarFuncionario";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const opcoesPadrao = {
  marca: ["Nike", "Adidas", "Puma"],
  cor: ["Preto", "Branco", "Azul", "Vermelho"],
  genero: ["Masculino", "Feminino", "Unissexo", "Todos"],
  idade: ["Bebé", "Criança", "Júnior", "Adolescente", "Adulto"],
  material: ["Algodão", "Poliéster", "Nylon"],
  tecnologia: ["DryFit", "AirCool"],
  origem: ["Portugal", "China", "Espanha"],
};

export default function AdicionarProdutoFuncionario() {
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
  const [material, setMaterial] = useState("");
  const [materialOutro, setMaterialOutro] = useState("");
  const [usoRecomendado, setUsoRecomendado] = useState("");
  const [garantia, setGarantia] = useState("");
  const [tecnologia, setTecnologia] = useState("");
  const [tecnologiaOutro, setTecnologiaOutro] = useState("");
  const [origem, setOrigem] = useState("");
  const [origemOutro, setOrigemOutro] = useState("");
  const [desconto, setDesconto] = useState("");
  const [novo, setNovo] = useState("Não");
  const [tipoCategoria, setTipoCategoria] = useState("");
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");

  const [grupoTamanho, setGrupoTamanho] = useState("");
  const [tamanhosRoupa, setTamanhosRoupa] = useState([]);
  const [tamanhosCalcado, setTamanhosCalcado] = useState([]);
  const [tamanhosObjeto, setTamanhosObjeto] = useState([]);

  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const gruposTamanho = [
    { value: "roupa", opcoes: ["Bebé", "Criança", "Júnior", "Adolescente", "Adulto", "XS", "S", "M", "L", "XL", "XXL"] },
    { value: "calcado", opcoes: ["30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"] },
    { value: "objeto", opcoes: ["Pequeno", "Médio", "Grande"] },
  ];

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
        const res = await axios.get("/api/funcionario/produtos");
        setProdutos(res.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchCategorias();
    fetchProdutos();
  }, []);

  const limparCampos = () => {
    setNome(""); setModelo(""); setMarca(""); setMarcaOutro(""); setGenero(""); setGeneroOutro("");
    setIdade(""); setIdadeOutro(""); setCor(""); setCorOutro(""); setDescricao(""); setFichaTecnica("");
    setPreco(""); setPeso(""); setStock(""); setMaterial(""); setMaterialOutro(""); setUsoRecomendado("");
    setGarantia(""); setTecnologia(""); setTecnologiaOutro(""); setOrigem(""); setOrigemOutro("");
    setDesconto(""); setNovo("Não"); setTipoCategoria(""); setGrupoTamanho("");
    setTamanhosRoupa([]); setTamanhosCalcado([]); setTamanhosObjeto([]); setFoto(null); setPreviewFoto("");
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
    if (foto) formData.append("foto", foto);

    try {
      const res = await axios.post("/api/funcionario/produtos", formData);
      if (res.status === 200) {
        toast.success("Produto guardado com sucesso!");
        limparCampos();
        const novaLista = await axios.get("/api/funcionario/produtos");
        setProdutos(novaLista.data);
      } else {
        toast.error("Erro ao guardar o produto.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao guardar o produto.");
    }
  };

  return (
    <div className={styles.container}>
      <SidebarFuncionario />
      <div className={styles.comConteudoComSidebar}>
        <h2 className={styles.tituloPrincipal}>Adicionar Produto</h2>

        
         <form onSubmit={handleSubmit} className={styles.formulario}>
  <h3 className={styles.tituloSecao}>📌 Informações Básicas</h3>
  <hr />
  <input type="text" placeholder="Nome do Produto" value={nome} onChange={(e) => setNome(e.target.value)} />
  <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />

  <CampoDinamico label="Marca" name="marca" value={marca} outroValue={marcaOutro} onChange={(e) => setMarca(e.target.value)} onOutroChange={(e) => setMarcaOutro(e.target.value)} opcoes={opcoesPadrao.marca} />
  <CampoDinamico label="Género" name="genero" value={genero} outroValue={generoOutro} onChange={(e) => setGenero(e.target.value)} onOutroChange={(e) => setGeneroOutro(e.target.value)} opcoes={opcoesPadrao.genero} incluirTodos />
  <CampoDinamico label="Idade" name="idade" value={idade} outroValue={idadeOutro} onChange={(e) => setIdade(e.target.value)} onOutroChange={(e) => setIdadeOutro(e.target.value)} opcoes={opcoesPadrao.idade} />
  <CampoDinamico label="Cor" name="cor" value={cor} outroValue={corOutro} onChange={(e) => setCor(e.target.value)} onOutroChange={(e) => setCorOutro(e.target.value)} opcoes={opcoesPadrao.cor} />

  <input type="number" placeholder="Preço (€)" value={preco} onChange={(e) => setPreco(e.target.value)} />
  <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />

  <label>Categoria:</label>
  <select value={tipoCategoria} onChange={(e) => setTipoCategoria(e.target.value)}>
    <option value="">Selecione...</option>
    {categorias.map((cat) => (
      <option key={cat.ID_categoria} value={cat.ID_categoria}>
        {cat.Tipo_de_Produto} - {cat.Tipo_de_Categoria}
      </option>
    ))}
  </select>

  <h3 className={styles.tituloSecao}>📄 Detalhes Técnicos</h3>
  <hr />
  <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
  <textarea placeholder="Ficha Técnica" value={fichaTecnica} onChange={(e) => setFichaTecnica(e.target.value)} />
  <input type="text" placeholder="Peso (ex: 1.5 kg)" value={peso} onChange={(e) => setPeso(e.target.value)} />
  <input type="text" placeholder="Uso Recomendado" value={usoRecomendado} onChange={(e) => setUsoRecomendado(e.target.value)} />
  <input type="text" placeholder="Garantia" value={garantia} onChange={(e) => setGarantia(e.target.value)} />
  <input type="text" placeholder="Desconto (%)" value={desconto} onChange={(e) => setDesconto(e.target.value)} />

  <CampoDinamico label="Material" name="material" value={material} outroValue={materialOutro} onChange={(e) => setMaterial(e.target.value)} onOutroChange={(e) => setMaterialOutro(e.target.value)} opcoes={opcoesPadrao.material} />
  <CampoDinamico label="Tecnologia" name="tecnologia" value={tecnologia} outroValue={tecnologiaOutro} onChange={(e) => setTecnologia(e.target.value)} onOutroChange={(e) => setTecnologiaOutro(e.target.value)} opcoes={opcoesPadrao.tecnologia} />
  <CampoDinamico label="Origem" name="origem" value={origem} outroValue={origemOutro} onChange={(e) => setOrigem(e.target.value)} onOutroChange={(e) => setOrigemOutro(e.target.value)} opcoes={opcoesPadrao.origem} />

  <label>Produto Novo?</label>
  <select value={novo} onChange={(e) => setNovo(e.target.value)}>
    <option value="Não">Não</option>
    <option value="Sim">Sim</option>
  </select>

  <label>Imagem:</label>
  <input type="file" onChange={(e) => {
    const file = e.target.files[0];
    setFoto(file);
    setPreviewFoto(file ? URL.createObjectURL(file) : "");
  }} />
  {previewFoto && <img src={previewFoto} alt="preview" className={styles.imagemPreview} />}

  <h3 className={styles.tituloSecao}>📏 Grupo de Tamanhos</h3>
  <hr />
  <select value={grupoTamanho} onChange={(e) => {
    const val = e.target.value;
    setGrupoTamanho(val);
    setTamanhosRoupa([]);
    setTamanhosCalcado([]);
    setTamanhosObjeto([]);
  }}>
    <option value="">Selecione...</option>
    <option value="roupa">Roupa</option>
    <option value="calcado">Calçado</option>
    <option value="objeto">Objeto</option>
  </select>

  <MultiCheckboxTamanhos
    grupoSelecionado={grupoTamanho}
    grupos={gruposTamanho}
    selecionados={
      grupoTamanho === "roupa" ? tamanhosRoupa :
      grupoTamanho === "calcado" ? tamanhosCalcado :
      tamanhosObjeto
    }
    setSelecionados={
      grupoTamanho === "roupa" ? setTamanhosRoupa :
      grupoTamanho === "calcado" ? setTamanhosCalcado :
      setTamanhosObjeto
    }
    visivel={grupoTamanho !== ""}
  />

  <button type="submit">Adicionar Produto</button>
</form>

<h3 className={styles.tituloSecao}>📦 Produtos Existentes</h3>
<hr />
<table className={styles.tabelaProdutos}>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Modelo</th>
      <th>Preço</th>
      <th>Stock</th>
      <th>Categoria</th>
    </tr>
  </thead>
  <tbody>
    {produtos.map((produto) => (
      <tr key={produto.ID_produto}>
        <td>{produto.Nome_Produtos}</td>
        <td>{produto.Modelo}</td>
        <td>{parseFloat(produto.Preco).toFixed(2)}€</td>
        <td>{produto.Stock}</td>
        <td>{produto.Tipo_de_Categoria}</td>
      </tr>
    ))}
  </tbody>
</table>

<ToastContainer position="top-right" autoClose={3000} />

      </div>
    </div>
  );
}
