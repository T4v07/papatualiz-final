// src/pages/pesquisa.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import ProdutoCard from "@/components/ProdutoCard";
import Navbar from "@/components/navbar";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/pesquisa.module.css";

export default function Pesquisa() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const termo = router.query.q || "";

  const [produtos, setProdutos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 8;

  const [filtros, setFiltros] = useState({
    marca: [],
    cor: [],
    genero: [],
    idade: [],
    categoria: [],
    stock: false,
    desconto: false,
    novidade: false,
    tamanho: [],
    tecnologia: [],
    origem: [],
    material: [],
    uso: [],
    preco: [0, 500],
  });

  const sugestoes = ["camisola", "futebol", "adidas", "mochila", "fitness"];

  useEffect(() => {
    if (termo) {
      fetch(`/api/produtos/pesquisa?q=${termo}`)
        .then((res) => res.json())
        .then((data) => setProdutos(data));
    }
  }, [termo]);

    const aplicarFiltros = () => {
  if (!Array.isArray(produtos)) return [];

  return produtos.filter((produto) => {
    const matchMarca = filtros.marca.length === 0 || filtros.marca.includes(produto.Marca);
    const matchCor = filtros.cor.length === 0 || filtros.cor.includes(produto.Cor);
    const matchGenero = filtros.genero.length === 0 || filtros.genero.includes(produto.Genero);
    const matchIdade = filtros.idade.length === 0 || filtros.idade.includes(produto.Idade);
    const matchCategoria = filtros.categoria.length === 0 || filtros.categoria.includes(produto.Tipo_de_Categoria);
    const matchTamanho =
      filtros.tamanho.length === 0 ||
      (produto.Tamanho_Roupa && produto.Tamanho_Roupa.split(',').some(t => filtros.tamanho.includes(t))) ||
      (produto.Tamanho_Calcado && produto.Tamanho_Calcado.split(',').some(t => filtros.tamanho.includes(t))) ||
      (produto.Tamanho_Objeto && produto.Tamanho_Objeto.split(',').some(t => filtros.tamanho.includes(t)));
    const matchTecnologia = filtros.tecnologia.length === 0 || filtros.tecnologia.includes(produto.Tecnologia);
    const matchOrigem = filtros.origem.length === 0 || filtros.origem.includes(produto.Origem);
    const matchMaterial = filtros.material.length === 0 || filtros.material.includes(produto.Material);
    const matchUso = filtros.uso.length === 0 || filtros.uso.includes(produto.Uso_Recomendado);
    const matchPreco = produto.Preco >= filtros.preco[0] && produto.Preco <= filtros.preco[1];
    const matchStock = !filtros.stock || produto.Stock > 0;
    const matchDesconto = !filtros.desconto || (produto.Desconto && produto.Desconto > 0);
    const matchNovidade = !filtros.novidade || produto.Novidade === 1;

    return (
      matchMarca && matchCor && matchGenero && matchIdade &&
      matchCategoria && matchTamanho && matchTecnologia &&
      matchOrigem && matchMaterial && matchUso &&
      matchPreco && matchStock && matchDesconto && matchNovidade
    );
  });
};



  const produtosFiltrados = aplicarFiltros();
  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
  const produtosPaginados = produtosFiltrados.slice(
    (paginaAtual - 1) * produtosPorPagina,
    paginaAtual * produtosPorPagina
  );

  const atualizarCheckbox = (campo, valor) => {
    setPaginaAtual(1);
    setFiltros((prev) => ({
      ...prev,
      [campo]: prev[campo].includes(valor)
        ? prev[campo].filter((v) => v !== valor)
        : [...prev[campo], valor],
    }));
  };

  const atualizarSwitch = (campo) => {
    setPaginaAtual(1);
    setFiltros((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const atualizarPreco = (e) => {
    setPaginaAtual(1);
    setFiltros((prev) => ({
      ...prev,
      preco: [0, parseInt(e.target.value)],
    }));
  };
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h2>🔍 Filtros</h2>

         <details open>
  <summary>Marca</summary>
  {Array.isArray(produtos) &&
    [...new Set(produtos.map(p => p.Marca))].map((marca, i) => (
      <label key={i}>
        <input
          type="checkbox"
          value={marca}
          checked={filtros.marca.includes(marca)}
          onChange={() => atualizarCheckbox("marca", marca)}
        />
        {marca}
      </label>
    ))}
</details>

<details>
  <summary>Cor</summary>
  {Array.isArray(produtos) &&
    [...new Set(produtos.map(p => p.Cor))].map((cor, i) => (
      <label key={i}>
        <input
          type="checkbox"
          value={cor}
          checked={filtros.cor.includes(cor)}
          onChange={() => atualizarCheckbox("cor", cor)}
        />
        {cor}
      </label>
    ))}
</details>

<details>
  <summary>Género</summary>
  {["Masculino", "Feminino", "Unissexo", "Todos"].map((g, i) => (
    <label key={i}>
      <input
        type="checkbox"
        value={g}
        checked={filtros.genero.includes(g)}
        onChange={() => atualizarCheckbox("genero", g)}
      />
      {g}
    </label>
  ))}
</details>

<details>
  <summary>Idade</summary>
  {["Criança", "Júnior", "Adulto"].map((idade, i) => (
    <label key={i}>
      <input
        type="checkbox"
        value={idade}
        checked={filtros.idade.includes(idade)}
        onChange={() => atualizarCheckbox("idade", idade)}
      />
      {idade}
    </label>
  ))}
</details>

<details>
  <summary>Categoria</summary>
  {Array.isArray(produtos) &&
    [...new Set(produtos.map(p => p.Tipo_de_Categoria))].map((cat, i) => (
      <label key={i}>
        <input
          type="checkbox"
          value={cat}
          checked={filtros.categoria.includes(cat)}
          onChange={() => atualizarCheckbox("categoria", cat)}
        />
        {cat}
      </label>
    ))}
</details>

<details>
  <summary>Tamanho</summary>
  {["XS", "S", "M", "L", "XL","XXL", "35", "36", "37", "38", "39", "40", "41","42","43","44","45","46", "Único"].map((t, i) => (
    <label key={i}>
      <input
        type="checkbox"
        value={t}
        checked={filtros.tamanho.includes(t)}
        onChange={() => atualizarCheckbox("tamanho", t)}
      />
      {t}
    </label>
  ))}
</details>

<details>
  <summary>Stock</summary>
  <label>
    <input
      type="checkbox"
      checked={filtros.stock}
      onChange={() => atualizarSwitch("stock")}
    />
    Apenas com stock
  </label>
</details>

<details>
  <summary>Desconto</summary>
  <label>
    <input
      type="checkbox"
      checked={filtros.desconto}
      onChange={() => atualizarSwitch("desconto")}
    />
    Apenas com desconto
  </label>
</details>

<details>
  <summary>Novidade</summary>
  <label>
    <input
      type="checkbox"
      checked={filtros.novidade}
      onChange={() => atualizarSwitch("novidade")}
    />
    Apenas novidades
  </label>
</details>

<details>
  <summary>Tecnologia</summary>
  {Array.isArray(produtos) &&
    [...new Set(produtos.map(p => p.Tecnologia).filter(Boolean))].map((tec, i) => (
      <label key={i}>
        <input
          type="checkbox"
          value={tec}
          checked={filtros.tecnologia.includes(tec)}
          onChange={() => atualizarCheckbox("tecnologia", tec)}
        />
        {tec}
      </label>
    ))}
</details>

<details>
  <summary>Origem</summary>
  {Array.isArray(produtos) &&
    [...new Set(produtos.map(p => p.Origem).filter(Boolean))].map((origem, i) => (
      <label key={i}>
        <input
          type="checkbox"
          value={origem}
          checked={filtros.origem.includes(origem)}
          onChange={() => atualizarCheckbox("origem", origem)}
        />
        {origem}
      </label>
    ))}
</details>

<details>
  <summary>Material</summary>
  {Array.isArray(produtos) &&
    [...new Set(produtos.map(p => p.Material).filter(Boolean))].map((mat, i) => (
      <label key={i}>
        <input
          type="checkbox"
          value={mat}
          checked={filtros.material.includes(mat)}
          onChange={() => atualizarCheckbox("material", mat)}
        />
        {mat}
      </label>
    ))}
</details>

<details>
  <summary>Uso Recomendado</summary>
  {Array.isArray(produtos) &&
    [...new Set(produtos.map(p => p.Uso_Recomendado).filter(Boolean))].map((uso, i) => (
      <label key={i}>
        <input
          type="checkbox"
          value={uso}
          checked={filtros.uso.includes(uso)}
          onChange={() => atualizarCheckbox("uso", uso)}
        />
        {uso}
      </label>
    ))}
</details>


          <details>
            <summary>Preço</summary>
            <label>
              Até {filtros.preco[1]}€
              <input
                type="range"
                min={0}
                max={500}
                step={5}
                value={filtros.preco[1]}
                onChange={atualizarPreco}
              />
            </label>
          </details>
        </aside>

        <main className={styles.resultados}>
  {termo && termo.trim() !== "" ? (
    <h2>Resultados para: "{termo}"</h2>
  ) : (
    <h2>Nenhum produto encontrado</h2>
  )}

  <div className={styles.sugestoes}>
    <p>Sugestões:</p>
    {sugestoes.map((s, i) => (
      <button
        key={i}
        className={styles.sugestaoBtn}
        onClick={() => router.push(`/pesquisa?q=${s}`)}
      >
        {s}
      </button>
    ))}
  </div>

  <div className={styles.gridProdutos}>
    {termo && produtosPaginados.length === 0 ? (
      <p>Nenhum produto encontrado.</p>
    ) : (
      produtosPaginados.map((produto) => (
        <ProdutoCard
          key={produto.ID_produto}
          produto={produto}
          mostrarFavorito={false}
          onClick={() => router.push(`/produto/${produto.ID_produto}`)}
        />
      ))
    )}
  </div>

  {produtosFiltrados.length > 0 && (
    <div className={styles.paginacao}>
      {Array.from({ length: totalPaginas }, (_, i) => (
        <button
          key={i}
          onClick={() => setPaginaAtual(i + 1)}
          className={paginaAtual === i + 1 ? styles.ativo : ""}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )}
</main>

      </div>
    </>
  );
}
