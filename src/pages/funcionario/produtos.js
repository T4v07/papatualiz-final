// src/pages/funcionario/produtos.js
  import React, { useState, useEffect } from "react";
  import styles from "@/styles/adicprodutoadm.module.css";
  import CampoDinamico from "@/components/CampoDinamico";
  import VariacoesProduto from "@/components/admin/VariacoesProduto";
  import axios from "axios";
  import Select from "react-select";
  import { ToastContainer, toast } from "react-toastify";
  import SidebarAdmin from "../../components/funcionario/SidebarFuncionario";
  import "react-toastify/dist/ReactToastify.css";

  const opcoesPadrao = {
    marca: ["Nike", "Adidas", "Puma"],
    genero: ["Masculino", "Feminino", "Unissexo"],
    idade: ["Bebé", "Criança", "Júnior", "Adolescente", "Adulto", "Todos"],
    material: ["Algodão", "Poliéster", "Nylon"],
    tecnologia: ["DryFit", "AirCool"],
    origem: ["Portugal", "China", "Espanha"],
  };

  export default function AdicProdutoAdm() {
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    // Passo 1 - Informações Básicas
    const [nome, setNome] = useState("");
    const [modelo, setModelo] = useState("");
    const [marca, setMarca] = useState("");
    const [marcaOutro, setMarcaOutro] = useState("");
    const [genero, setGenero] = useState("");
    const [generoOutro, setGeneroOutro] = useState("");
    const [idade, setIdade] = useState("");
    const [idadeOutro, setIdadeOutro] = useState("");

    // Passo 1 Categoria (React Select)
    const [tipoCategoria, setTipoCategoria] = useState(null);
    const [categorias, setCategorias] = useState([]);

    // Passo 2 - Características Técnicas
    const [material, setMaterial] = useState("");
    const [materialOutro, setMaterialOutro] = useState("");
    const [tecnologia, setTecnologia] = useState("");
    const [tecnologiaOutro, setTecnologiaOutro] = useState("");
    const [origem, setOrigem] = useState("");
    const [origemOutro, setOrigemOutro] = useState("");
    const [descricao, setDescricao] = useState("");
    const [fichaTecnica, setFichaTecnica] = useState("");

    // Passo 3 - Variações (cores, tamanhos e stock)
    const [variacoes, setVariacoes] = useState([]);

    // Passo 4 - Fotos
    const [fotos, setFotos] = useState([]);

    // Outras propriedades opcionais (do backend)
    const [preco, setPreco] = useState("");
    const [peso, setPeso] = useState("");
    const [usoRecomendado, setUsoRecomendado] = useState("");
    const [garantia, setGarantia] = useState("");
    const [desconto, setDesconto] = useState("");
    const [novo, setNovo] = useState(false);

    const [errors, setErrors] = useState({});

    useEffect(() => {
      async function fetchCategorias() {
        try {
          const res = await axios.get("/api/categorias");
          setCategorias(res.data);
        } catch (err) {
          console.error("Erro ao buscar categorias", err);
        }
      }
      fetchCategorias();
    }, []);

    // Validações (resumidas para simplicidade)
    const validarPasso1 = () => {
      let tempErrors = {};
      if (!nome || nome.trim().length < 3) tempErrors.nome = "Nome deve ter no mínimo 3 caracteres.";
      if (!modelo || modelo.trim().length < 2) tempErrors.modelo = "Modelo deve ter no mínimo 2 caracteres.";
      if (!marca) tempErrors.marca = "Marca é obrigatória.";
      if (marca === "Outro" && !marcaOutro.trim()) tempErrors.marcaOutro = "Informe a marca.";
      if (!genero) tempErrors.genero = "Género é obrigatório.";
      if (genero === "Outro" && !generoOutro.trim()) tempErrors.generoOutro = "Informe o género.";
      if (!idade) tempErrors.idade = "Idade é obrigatória.";
      if (idade === "Outro" && !idadeOutro.trim()) tempErrors.idadeOutro = "Informe a idade.";
      if (!tipoCategoria) tempErrors.tipoCategoria = "Categoria é obrigatória.";
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    };

    const validarPasso2 = () => {
      let tempErrors = {};
      if (!material) tempErrors.material = "Material é obrigatório.";
      if (material === "Outro" && !materialOutro.trim()) tempErrors.materialOutro = "Informe o material.";
      if (!tecnologia) tempErrors.tecnologia = "Tecnologia é obrigatória.";
      if (tecnologia === "Outro" && !tecnologiaOutro.trim()) tempErrors.tecnologiaOutro = "Informe a tecnologia.";
      if (!origem) tempErrors.origem = "Origem é obrigatória.";
      if (origem === "Outro" && !origemOutro.trim()) tempErrors.origemOutro = "Informe a origem.";
      if (!descricao || descricao.trim().length < 10) tempErrors.descricao = "Descrição deve ter no mínimo 10 caracteres.";
      if (!fichaTecnica || fichaTecnica.trim().length < 10) tempErrors.fichaTecnica = "Ficha Técnica deve ter no mínimo 10 caracteres.";
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    };

    const validarPasso3 = () => {
      let tempErrors = {};
      if (variacoes.length === 0) tempErrors.variacoes = "Adicione pelo menos uma variação.";
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    };

    const validarPasso4 = () => {
      let tempErrors = {};
      if (fotos.length === 0) tempErrors.fotos = "Adicione pelo menos uma foto.";
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    };

    const nextStep = () => {
      if (step === 1 && !validarPasso1()) return;
      if (step === 2 && !validarPasso2()) return;
      if (step === 3 && !validarPasso3()) return;
      if (step === 4 && !validarPasso4()) return;
      setErrors({});
      setStep(step + 1);
    };

    const prevStep = () => {
      if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
      try {
        const formData = new FormData();

        // Informações básicas
        formData.append("nome", nome);
        formData.append("modelo", modelo);
        formData.append("marca", marca);
        formData.append("MarcaOutro", marcaOutro);
        formData.append("genero", genero);
        formData.append("GeneroOutro", generoOutro);
        formData.append("idade", idade);
        formData.append("Idade_Outro", idadeOutro);
        formData.append("tipoCategoria", tipoCategoria?.value || "");

        // Características técnicas e outros campos
        formData.append("preco", parseFloat(preco).toFixed(2));
        formData.append("peso", peso);
        formData.append("descricao", descricao);
        formData.append("Ficha_Tecnica", fichaTecnica);
        formData.append("material", material);
        formData.append("Material_Outro", materialOutro);
        formData.append("usoRecomendado", usoRecomendado);
        formData.append("garantia", garantia);
        formData.append("tecnologia", tecnologia);
        formData.append("Tecnologia_Outro", tecnologiaOutro);
        formData.append("origem", origem);
        formData.append("Origem_Outro", origemOutro);
        formData.append("desconto", desconto);
        formData.append("novo", novo ? "Sim" : "Não");

        // Variações
        formData.append("variacoes", JSON.stringify(variacoes));

        // Fotos
        fotos.forEach((foto) => {
          formData.append("fotos", foto);
        });

        const res = await axios.post("/api/admin/produtos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 201) {
          toast.success("Produto adicionado com sucesso!");

          // Resetar estados para limpar o formulário e voltar ao passo 1
          setStep(1);
          setNome("");
          setModelo("");
          setMarca("");
          setMarcaOutro("");
          setGenero("");
          setGeneroOutro("");
          setIdade("");
          setIdadeOutro("");
          setTipoCategoria(null);
          setPreco("");
          setPeso("");
          setDescricao("");
          setFichaTecnica("");
          setMaterial("");
          setMaterialOutro("");
          setUsoRecomendado("");
          setGarantia("");
          setTecnologia("");
          setTecnologiaOutro("");
          setOrigem("");
          setOrigemOutro("");
          setDesconto("");
          setNovo(false);
          setVariacoes([]);
          setFotos([]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erro ao adicionar produto.");
      }
    };

    return (
      <div className={styles.containerFull}>
        <SidebarAdmin />

        <main className={styles.mainFormContainer}>
          {step === 1 && (
            <form className={styles.formWrapper}>
              <h3 className={styles.subtitulo}>Informações Básicas</h3>

              {/* Barra de progresso */}
              <div className={styles.progressBarFixedContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                  aria-valuenow={step}
                  aria-valuemin={1}
                  aria-valuemax={totalSteps}
                  role="progressbar"
                />
              </div>

              <hr className={styles.separador} />

              <input
                type="text"
                className={`${styles.inputText} ${errors.nome ? styles.inputError : ""}`}
                placeholder="Nome do Produto"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              {errors.nome && <p className={styles.error}>{errors.nome}</p>}

              <input
                type="text"
                className={`${styles.inputText} ${errors.modelo ? styles.inputError : ""}`}
                placeholder="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
              {errors.modelo && <p className={styles.error}>{errors.modelo}</p>}

              <CampoDinamico
                label="Marca"
                name="marca"
                value={marca}
                outroValue={marcaOutro}
                onChange={(e) => setMarca(e.target.value)}
                onOutroChange={(e) => setMarcaOutro(e.target.value)}
                opcoes={opcoesPadrao.marca}
              />
              {errors.marca && <p className={styles.error}>{errors.marca}</p>}
              {marca === "Outro" && errors.marcaOutro && <p className={styles.error}>{errors.marcaOutro}</p>}

              <CampoDinamico
                label="Género"
                name="genero"
                value={genero}
                outroValue={generoOutro}
                onChange={(e) => setGenero(e.target.value)}
                onOutroChange={(e) => setGeneroOutro(e.target.value)}
                opcoes={opcoesPadrao.genero}
              />
              {errors.genero && <p className={styles.error}>{errors.genero}</p>}
              {genero === "Outro" && errors.generoOutro && <p className={styles.error}>{errors.generoOutro}</p>}

              <CampoDinamico
                label="Idade"
                name="idade"
                value={idade}
                outroValue={idadeOutro}
                onChange={(e) => setIdade(e.target.value)}
                onOutroChange={(e) => setIdadeOutro(e.target.value)}
                opcoes={opcoesPadrao.idade}
              />
              {errors.idade && <p className={styles.error}>{errors.idade}</p>}
              {idade === "Outro" && errors.idadeOutro && <p className={styles.error}>{errors.idadeOutro}</p>}

              <label className={styles.label}>Categoria</label>
              <Select
                options={categorias.map(cat => ({
                  value: cat.ID_categoria,
                  label: `${cat.Tipo_de_Produto} - ${cat.Tipo_de_Categoria}`
                }))}
                value={tipoCategoria}
                onChange={setTipoCategoria}
                placeholder="Selecione..."
                classNamePrefix={errors.tipoCategoria ? "react-select-error" : "react-select"}
              />
              {errors.tipoCategoria && <p className={styles.error}>{errors.tipoCategoria}</p>}
            </form>
          )}

          {step === 2 && (
            <form className={styles.formWrapper}>
              <h3 className={styles.subtitulo}>Características Técnicas</h3>

              {/* Barra de progresso */}
              <div className={styles.progressBarFixedContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                  aria-valuenow={step}
                  aria-valuemin={1}
                  aria-valuemax={totalSteps}
                  role="progressbar"
                />
              </div>

              <hr className={styles.separador} />

              <CampoDinamico
                label="Material"
                name="material"
                value={material}
                outroValue={materialOutro}
                onChange={(e) => setMaterial(e.target.value)}
                onOutroChange={(e) => setMaterialOutro(e.target.value)}
                opcoes={opcoesPadrao.material}
              />
              {errors.material && <p className={styles.error}>{errors.material}</p>}
              {material === "Outro" && errors.materialOutro && <p className={styles.error}>{errors.materialOutro}</p>}

              <CampoDinamico
                label="Tecnologia"
                name="tecnologia"
                value={tecnologia}
                outroValue={tecnologiaOutro}
                onChange={(e) => setTecnologia(e.target.value)}
                onOutroChange={(e) => setTecnologiaOutro(e.target.value)}
                opcoes={opcoesPadrao.tecnologia}
              />
              {errors.tecnologia && <p className={styles.error}>{errors.tecnologia}</p>}
              {tecnologia === "Outro" && errors.tecnologiaOutro && <p className={styles.error}>{errors.tecnologiaOutro}</p>}

              <CampoDinamico
                label="Origem"
                name="origem"
                value={origem}
                outroValue={origemOutro}
                onChange={(e) => setOrigem(e.target.value)}
                onOutroChange={(e) => setOrigemOutro(e.target.value)}
                opcoes={opcoesPadrao.origem}
              />
              {errors.origem && <p className={styles.error}>{errors.origem}</p>}
              {origem === "Outro" && errors.origemOutro && <p className={styles.error}>{errors.origemOutro}</p>}

              <textarea
                className={styles.textarea}
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              {errors.descricao && <p className={styles.error}>{errors.descricao}</p>}

              <textarea
                className={styles.textarea}
                placeholder="Ficha Técnica"
                value={fichaTecnica}
                onChange={(e) => setFichaTecnica(e.target.value)}
              />
              {errors.fichaTecnica && <p className={styles.error}>{errors.fichaTecnica}</p>}

              {/* Campos adicionais */}
              <input
                type="text"
                className={styles.inputText}
                placeholder="Uso Recomendado"
                value={usoRecomendado}
                onChange={(e) => setUsoRecomendado(e.target.value)}
              />

              <input
                type="text"
                className={styles.inputText}
                placeholder="Garantia"
                value={garantia}
                onChange={(e) => setGarantia(e.target.value)}
              />

              <input
                type="number"
                className={styles.inputText}
                placeholder="Desconto (%)"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
              />
              <input
                type="number"
                className={styles.inputText}
                placeholder="Preço (€)"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                step="0.01"
              />
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={novo}
                  onChange={(e) => setNovo(e.target.checked)}
                  style={{ marginRight: "8px" }}
                />
                Produto Novo
              </label>
            </form>
          )}

          {step === 3 && (
            <form className={styles.formWrapper}>
              <h3 className={styles.subtitulo}>Variações (Cores, Tamanhos, Stock)</h3>

              {/* Barra de progresso */}
              <div className={styles.progressBarFixedContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                  aria-valuenow={step}
                  aria-valuemin={1}
                  aria-valuemax={totalSteps}
                  role="progressbar"
                />
              </div>

              <hr className={styles.separador} />

              {errors.variacoes && <p className={styles.error}>{errors.variacoes}</p>}

              <VariacoesProduto variacoes={variacoes} setVariacoes={setVariacoes} />
            </form>
          )}

          {step === 4 && (
            <form className={styles.formWrapper}>
              <h3 className={styles.subtitulo}>Fotos do Produto</h3>

              {/* Barra de progresso */}
              <div className={styles.progressBarFixedContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                  aria-valuenow={step}
                  aria-valuemin={1}
                  aria-valuemax={totalSteps}
                  role="progressbar"
                />
              </div>

              <hr className={styles.separador} />

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFotos(Array.from(e.target.files))}
                className={styles.inputFile}
              />
              {errors.fotos && <p className={styles.error}>{errors.fotos}</p>}

              {fotos.length > 0 && (
                <div className={styles.previewFotos}>
                  {fotos.map((foto, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(foto)}
                      alt={`Foto ${idx + 1}`}
                      className={styles.previewImg}
                    />
                  ))}
                </div>
              )}
            </form>
          )}

          {/* Botões de navegação */}
          <div className={styles.buttonsContainer}>
            {step > 1 && (
              <button className={styles.addButtonSecondary} onClick={prevStep} type="button">
                Anterior
              </button>
            )}
            {step < totalSteps && (
              <button className={styles.addButton} onClick={nextStep} type="button">
                Próximo
              </button>
            )}
            {step === totalSteps && (
              <button className={styles.addButton} onClick={handleSubmit} type="button">
                Finalizar
              </button>
            )}
          </div>

          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </main>
      </div>
    );
  }
