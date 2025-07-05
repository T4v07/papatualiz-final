// src/components/FiltrosSidebar.js
import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUp, Search } from 'lucide-react';
import styles from '@/styles/filtrosSidebar.module.css';

export default function FiltrosSidebar({ filtros, setFiltros, produtos }) {
  // Estados para pesquisa e toggle "ver mais"
  const [filtroGeneroPesquisa, setFiltroGeneroPesquisa] = useState('');
  const [mostrarMaisGenero, setMostrarMaisGenero] = useState(false);

  const [filtroCategoriaPesquisa, setFiltroCategoriaPesquisa] = useState('');
  const [mostrarMaisCategoria, setMostrarMaisCategoria] = useState(false);

  const [filtroTamanhoPesquisa, setFiltroTamanhoPesquisa] = useState('');
  const [mostrarMaisTamanho, setMostrarMaisTamanho] = useState(false);

  const [filtroCorPesquisa, setFiltroCorPesquisa] = useState('');
  const [mostrarMaisCor, setMostrarMaisCor] = useState(false);

  const [filtroMarcaPesquisa, setFiltroMarcaPesquisa] = useState('');
  const [mostrarMaisMarca, setMostrarMaisMarca] = useState(false);

  // Atualiza checkbox
  const atualizarCheckbox = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: prev[campo].includes(valor)
        ? prev[campo].filter((v) => v !== valor)
        : [...prev[campo], valor],
    }));
  };

  // Atualiza switch (checkbox simples)
  const atualizarSwitch = (campo) => {
    setFiltros((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  // Atualiza preço mínimo e máximo
  const atualizarPreco = (campo, valor) => {
    const novoPreco = [...filtros.preco];
    if (campo === 'min') novoPreco[0] = valor === '' ? 0 : Number(valor);
    else novoPreco[1] = valor === '' ? 0 : Number(valor);
    setFiltros((prev) => ({ ...prev, preco: novoPreco }));
  };

  // Contagem produtos por filtro

  // Gênero
  const generoContagem = produtos.reduce((acc, produto) => {
    const genero = produto.Genero || 'Outro';
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {});

  // Categoria
  const categoriaContagem = produtos.reduce((acc, produto) => {
    const categoria = produto.Tipo_de_Categoria || 'Outro';
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {});

  // Marca
  const marcaContagem = produtos.reduce((acc, produto) => {
    const marca = produto.Marca || 'Outro';
    acc[marca] = (acc[marca] || 0) + 1;
    return acc;
  }, {});

  // Cor (baseado nas variações)
  const coresUnicas = [...new Set(produtos.flatMap(p => p.variacoes?.map(v => v.cor) || []))].filter(Boolean);
  const corContagem = {};
  produtos.forEach(p => {
    p.variacoes?.forEach(v => {
      if (v.cor) corContagem[v.cor] = (corContagem[v.cor] || 0) + 1;
    });
  });

  // Tamanho (baseado nas variações)
  const tamanhosUnicos = [...new Set(produtos.flatMap(p => p.variacoes?.map(v => v.tamanho) || []))].filter(Boolean);
  const tamanhoContagem = {};
  produtos.forEach(p => {
    p.variacoes?.forEach(v => {
      if (v.tamanho) tamanhoContagem[v.tamanho] = (tamanhoContagem[v.tamanho] || 0) + 1;
    });
  });

  // Filtra e ordena com base na pesquisa e na contagem
  const filtrarOrdenar = (contagemObj, filtroPesquisa) => {
    return Object.entries(contagemObj)
      .filter(([nome]) => nome.toLowerCase().includes(filtroPesquisa.toLowerCase()))
      .sort((a, b) => b[1] - a[1]);
  };

  // Dados filtrados para cada filtro
  const generosFiltrados = filtrarOrdenar(generoContagem, filtroGeneroPesquisa);
  const categoriasFiltradas = filtrarOrdenar(categoriaContagem, filtroCategoriaPesquisa);
  const marcasFiltradas = filtrarOrdenar(marcaContagem, filtroMarcaPesquisa);

  // Para cor e tamanho: filtra e adiciona contagem
  const coresFiltradas = coresUnicas
    .filter(cor => cor.toLowerCase().includes(filtroCorPesquisa.toLowerCase()))
    .map(cor => [cor, corContagem[cor] || 0])
    .sort((a, b) => b[1] - a[1]);

  const tamanhosFiltrados = tamanhosUnicos
    .filter(tam => tam.toLowerCase().includes(filtroTamanhoPesquisa.toLowerCase()))
    .map(tam => [tam, tamanhoContagem[tam] || 0])
    .sort((a, b) => b[1] - a[1]);

  // Renderizador genérico de filtro
  const renderFiltro = (titulo, aberto, setAberto, filtroPesquisa, setFiltroPesquisa, itens, filtroCampo) => {
    const mostrarMais = aberto;
    const itensParaMostrar = mostrarMais ? itens : itens.slice(0, 5);

    return (
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button
              className={styles.disclosureButton}
              onClick={() => setAberto(!aberto)}
            >
              {titulo}
              <ChevronUp className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
            </Disclosure.Button>
            <Disclosure.Panel className={styles.disclosurePanel}>
              <div className={styles.pesquisaContainer}>
                <input
                  type="text"
                  placeholder="Pesquisar"
                  className={styles.pesquisaInput}
                  value={filtroPesquisa}
                  onChange={e => setFiltroPesquisa(e.target.value)}
                />
                <Search size={16} color="#0070f3" className={styles.pesquisaIcon} />
              </div>
              {itensParaMostrar.map(([nome, contagem], i) => (
                <label key={i} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={nome}
                    checked={filtros[filtroCampo].includes(nome)}
                    onChange={() => atualizarCheckbox(filtroCampo, nome)}
                  />
                  {nome}
                  <span className={styles.contagem}>{contagem}</span>
                </label>
              ))}
              {itens.length > 5 && (
                <button
                  type="button"
                  className={styles.verMaisBtn}
                  onClick={() => setAberto(!aberto)}
                >
                  {mostrarMais ? 'Ver menos filtros' : 'Ver mais filtros'}
                </button>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  };

  // Estados controle toggles "Ver mais"
  const [abertoGenero, setAbertoGenero] = useState(true);
  const [abertoCategoria, setAbertoCategoria] = useState(true);
  const [abertoMarca, setAbertoMarca] = useState(true);
  const [abertoCor, setAbertoCor] = useState(true);
  const [abertoTamanho, setAbertoTamanho] = useState(true);

  return (
    <aside className={styles.sidebar}>
      <h2><Search size={24} color="#0070f3" /> Filtros</h2>

      {renderFiltro(
        "Filtrar por gênero",
        abertoGenero,
        setAbertoGenero,
        filtroGeneroPesquisa,
        setFiltroGeneroPesquisa,
        generosFiltrados,
        "genero"
      )}

      {renderFiltro(
        "Filtrar por categoria",
        abertoCategoria,
        setAbertoCategoria,
        filtroCategoriaPesquisa,
        setFiltroCategoriaPesquisa,
        categoriasFiltradas,
        "categoria"
      )}

      {renderFiltro(
        "Filtrar por marca",
        abertoMarca,
        setAbertoMarca,
        filtroMarcaPesquisa,
        setFiltroMarcaPesquisa,
        marcasFiltradas,
        "marca"
      )}

      {renderFiltro(
        "Filtrar por cor",
        abertoCor,
        setAbertoCor,
        filtroCorPesquisa,
        setFiltroCorPesquisa,
        coresFiltradas,
        "cor"
      )}

      {renderFiltro(
        "Filtrar por tamanho",
        abertoTamanho,
        setAbertoTamanho,
        filtroTamanhoPesquisa,
        setFiltroTamanhoPesquisa,
        tamanhosFiltrados,
        "tamanho"
      )}

      {/* Stock */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className={styles.disclosureButton}>
              Stock
              <ChevronUp className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
            </Disclosure.Button>
            <Disclosure.Panel className={styles.disclosurePanel}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filtros.stock}
                  onChange={() => atualizarSwitch("stock")}
                />
                Apenas com stock
              </label>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Desconto */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className={styles.disclosureButton}>
              Desconto
              <ChevronUp className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
            </Disclosure.Button>
            <Disclosure.Panel className={styles.disclosurePanel}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filtros.desconto}
                  onChange={() => atualizarSwitch("desconto")}
                />
                Apenas com desconto
              </label>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Novidade */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className={styles.disclosureButton}>
              Novidade
              <ChevronUp className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
            </Disclosure.Button>
            <Disclosure.Panel className={styles.disclosurePanel}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={filtros.novidade}
                  onChange={() => atualizarSwitch("novidade")}
                />
                Apenas novidades
              </label>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Preço */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <>
            <Disclosure.Button className={styles.disclosureButton}>
              Preço
              <ChevronUp className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
            </Disclosure.Button>
            <Disclosure.Panel className={styles.disclosurePanel}>
              <div className={styles.precoContainer}>
                <input
                  type="number"
                  min="0"
                  placeholder="Mín."
                  className={styles.precoInput}
                  value={filtros.preco[0]}
                  onChange={(e) => atualizarPreco('min', e.target.value)}
                />
                <span className={styles.precoSeparador}>-</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Máx."
                  className={styles.precoInput}
                  value={filtros.preco[1]}
                  onChange={(e) => atualizarPreco('max', e.target.value)}
                />
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </aside>
  );
}
