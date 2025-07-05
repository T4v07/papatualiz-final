import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import styles from "@/styles/gestaoProdutos.module.css";
import VariacoesProduto from "@/components/admin/VariacoesProduto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GestaoProdutos({ produto, categorias, onClose, onAtualizar }) {
  const totalSteps = 4;
  const [step, setStep] = useState(1);

  // Estados individuais
  const [nome, setNome] = useState("");
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [marcaOutro, setMarcaOutro] = useState("");
  const [genero, setGenero] = useState("");
  const [generoOutro, setGeneroOutro] = useState("");
  const [idade, setIdade] = useState("");
  const [idadeOutro, setIdadeOutro] = useState("");
  const [tipoCategoria, setTipoCategoria] = useState(null);
  const [preco, setPreco] = useState("");
  const [peso, setPeso] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fichaTecnica, setFichaTecnica] = useState("");
  const [material, setMaterial] = useState("");
  const [materialOutro, setMaterialOutro] = useState("");
  const [usoRecomendado, setUsoRecomendado] = useState("");
  const [garantia, setGarantia] = useState("");
  const [tecnologia, setTecnologia] = useState("");
  const [tecnologiaOutro, setTecnologiaOutro] = useState("");
  const [origem, setOrigem] = useState("");
  const [origemOutro, setOrigemOutro] = useState("");
  const [desconto, setDesconto] = useState("");
  const [novo, setNovo] = useState(false);
  const [variacoes, setVariacoes] = useState([]);
  const [fotos, setFotos] = useState([]); // mistura fotos antigas (objeto com url) e novas (File)

  // Função para parse seguro JSON
  const parseJSONSafe = (val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val || "";
  };

  const getValorPrincipal = (campo, campoOutro) => {
    const valor = parseJSONSafe(campo);
    const outro = parseJSONSafe(campoOutro);

    if (typeof valor === "string" && (valor === "Outro" || valor === '["Outro"]')) {
      return outro || "";
    }
    if (Array.isArray(valor)) {
      if (valor[0] === "Outro" && outro && outro.trim() !== "") {
        return outro;
      }
      return valor.join(", ");
    }
    return valor;
  };

  const mostrarTextoLimpo = (valor) => {
    if (!valor) return "";
    try {
      const parsed = JSON.parse(valor);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
      return valor;
    } catch {
      return valor;
    }
  };

  useEffect(() => {
    if (!produto) return;

    setNome(parseJSONSafe(produto.Nome_Produtos));
    setModelo(parseJSONSafe(produto.Modelo));
    setMarca(getValorPrincipal(produto.Marca, produto.MarcaOutro));
    setMarcaOutro(parseJSONSafe(produto.MarcaOutro));
    setGenero(getValorPrincipal(produto.Genero, produto.GeneroOutro));
    setGeneroOutro(parseJSONSafe(produto.GeneroOutro));
    setIdade(getValorPrincipal(produto.Idade, produto.Idade_Outro));
    setIdadeOutro(parseJSONSafe(produto.Idade_Outro));
    setPreco(produto.Preco || "");
    setPeso(produto.Peso || "");
    setDescricao(mostrarTextoLimpo(produto.Descricao));
    setFichaTecnica(mostrarTextoLimpo(produto.Ficha_Tecnica));
    setMaterial(getValorPrincipal(produto.Material, produto.Material_Outro));
    setMaterialOutro(parseJSONSafe(produto.Material_Outro));
    setUsoRecomendado(produto.Uso_Recomendado || "");
    setGarantia(parseJSONSafe(produto.Garantia));
    setTecnologia(getValorPrincipal(produto.Tecnologia, produto.Tecnologia_Outro));
    setTecnologiaOutro(parseJSONSafe(produto.Tecnologia_Outro));
    setOrigem(getValorPrincipal(produto.Origem, produto.Origem_Outro));
    setOrigemOutro(parseJSONSafe(produto.Origem_Outro));
    setDesconto(produto.Desconto || "");
    setNovo(produto.Novo === 1);

    const cat = categorias.find((c) => c.ID_categoria === produto.Tipo_de_Categoria);
    setTipoCategoria(cat ? { value: produto.Tipo_de_Categoria, label: `${cat.Tipo_de_Produto} - ${cat.Tipo_de_Categoria}` } : null);

    // Buscar variações
    axios.get(`/api/admin/variacoesproduto?produtoId=${produto.ID_produto}`)
      .then(res => setVariacoes(res.data))
      .catch(() => setVariacoes([]));

    // Buscar fotos (do backend, espera array de objetos com url)
    axios.get(`/api/admin/fotosproduto?produtoId=${produto.ID_produto}`)
      .then(res => setFotos(res.data))
      .catch(() => setFotos([]));

    setStep(1);
  }, [produto, categorias]);

  const validarPasso = () => {
    if (step === 1) {
      if (!nome.trim()) {
        toast.error("Nome do produto é obrigatório");
        return false;
      }
      if (!tipoCategoria) {
        toast.error("Categoria é obrigatória");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (preco === "" || isNaN(preco) || Number(preco) < 0) {
        toast.error("Informe um preço válido");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (variacoes.length === 0) {
        toast.error("Adicione pelo menos uma variação");
        return false;
      }
      return true;
    }
    if (step === 4) {
      if (fotos.length === 0) {
        toast.error("Adicione pelo menos uma foto");
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (!validarPasso()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Remove foto antiga da lista
  const removerFotoAntiga = (url) => {
    setFotos(fotos.filter(f => f.url !== url));
  };

  // Remove foto nova (arquivo) da lista
  const removerFotoNova = (file) => {
    setFotos(fotos.filter(f => f !== file));
  };

  const handleSalvar = async () => {
    try {
      const fotosNovas = fotos.filter(f => f instanceof File);
      const fotosAntigas = fotos.filter(f => !(f instanceof File));

      const formData = new FormData();
      formData.append("produtoId", produto.ID_produto);
      formData.append("fotosAntigas", JSON.stringify(fotosAntigas.map(f => f.url || f)));

      fotosNovas.forEach((file) => {
        formData.append("fotos", file);
      });

      // Enviar fotos primeiro
      await axios.put("/api/admin/atualizarfotos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Atualizar dados restantes
      await axios.put("/api/admin/gestaoprodutos", {
        id: produto.ID_produto,
        nome,
        modelo,
        marca,
        marcaOutro,
        genero,
        generoOutro,
        idade,
        idadeOutro,
        preco,
        peso,
        descricao,
        tipoCategoria: tipoCategoria.value,
        fichaTecnica,
        material,
        materialOutro,
        usoRecomendado,
        garantia,
        tecnologia,
        tecnologiaOutro,
        origem,
        origemOutro,
        desconto,
        novo,
        variacoes,
      });

      toast.success("Produto atualizado com sucesso!");
      onAtualizar();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Erro ao salvar produto");
    }
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.modalContent}>
        <h3>Editar Produto</h3>

        {step === 1 && (
          <>
            <label>Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} type="text" />

            <label>Modelo</label>
            <input value={modelo} onChange={(e) => setModelo(e.target.value)} type="text" />

            <label>Marca</label>
            <input value={marca} onChange={(e) => setMarca(e.target.value)} type="text" />

            <label>Gênero</label>
            <input value={genero} onChange={(e) => setGenero(e.target.value)} type="text" />

            <label>Idade</label>
            <input value={idade} onChange={(e) => setIdade(e.target.value)} type="text" />

            <label>Categoria</label>
            <Select
              options={(categorias || []).map((cat) => ({
                value: cat.ID_categoria,
                label: `${cat.Tipo_de_Produto} - ${cat.Tipo_de_Categoria}`,
              }))}
              value={tipoCategoria}
              onChange={setTipoCategoria}
              placeholder="Selecione a categoria"
            />
          </>
        )}

        {step === 2 && (
          <>
            <label>Preço</label>
            <input value={preco} onChange={(e) => setPreco(e.target.value)} type="number" step="0.01" />

            <label>Peso</label>
            <input value={peso} onChange={(e) => setPeso(e.target.value)} type="number" step="0.01" />

            <label>Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />

            <label>Ficha Técnica</label>
            <textarea value={fichaTecnica} onChange={(e) => setFichaTecnica(e.target.value)} />

            <label>Material</label>
            <input value={material} onChange={(e) => setMaterial(e.target.value)} type="text" />

            <label>Uso Recomendado</label>
            <input value={usoRecomendado} onChange={(e) => setUsoRecomendado(e.target.value)} type="text" />

            <label>Garantia</label>
            <input value={garantia} onChange={(e) => setGarantia(e.target.value)} type="text" />

            <label>Tecnologia</label>
            <input value={tecnologia} onChange={(e) => setTecnologia(e.target.value)} type="text" />

            <label>Origem</label>
            <input value={origem} onChange={(e) => setOrigem(e.target.value)} type="text" />

            <label>Desconto (%)</label>
            <input value={desconto} onChange={(e) => setDesconto(e.target.value)} type="number" step="0.01" />

            <label>
              <input type="checkbox" checked={novo} onChange={(e) => setNovo(e.target.checked)} />
              Produto Novo
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <label>Variações (cores, tamanhos e stock)</label>
            <VariacoesProduto variacoes={variacoes} setVariacoes={setVariacoes} />
          </>
        )}

        {step === 4 && (
          <>
            <label>Fotos do Produto</label>

            <div className={styles.previewFotos}>
              {/* Fotos antigas */}
              {fotos.filter(f => !(f instanceof File)).map((foto, idx) => (
                <div key={`antiga-${idx}`} className={styles.fotoItem}>
                  <img src={foto.url} alt={`Foto antiga ${idx + 1}`} />
                  <button type="button" onClick={() => removerFotoAntiga(foto.url)}>Remover</button>
                </div>
              ))}

              {/* Fotos novas */}
              {fotos.filter(f => f instanceof File).map((file, idx) => (
                <div key={`nova-${idx}`} className={styles.fotoItem}>
                  <img src={URL.createObjectURL(file)} alt={`Nova foto ${idx + 1}`} />
                  <button type="button" onClick={() => removerFotoNova(file)}>Remover</button>
                </div>
              ))}
            </div>

            <input
              type="file"
              multiple
              onChange={(e) => setFotos([...fotos, ...Array.from(e.target.files)])}
            />
          </>
        )}

        <div style={{ marginTop: 20 }}>
          {step > 1 && <button onClick={prevStep}>Anterior</button>}
          {step < totalSteps && <button onClick={nextStep}>Próximo</button>}
          {step === totalSteps && <button onClick={handleSalvar}>Salvar</button>}
          <button onClick={onClose} style={{ marginLeft: 10 }}>
            Cancelar
          </button>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
