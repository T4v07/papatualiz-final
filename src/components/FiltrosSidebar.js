// src/components/FiltrosSidebar.js
import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUp, Search } from 'lucide-react';
import styles from '@/styles/filtrosSidebar.module.css';

export default function FiltrosSidebar({ filtros, setFiltros, produtos }) {
  const [filtroGeneroPesquisa, setFiltroGeneroPesquisa] = useState('');
  const [filtroCategoriaPesquisa, setFiltroCategoriaPesquisa] = useState('');
  const [filtroTamanhoPesquisa, setFiltroTamanhoPesquisa] = useState('');
  const [filtroCorPesquisa, setFiltroCorPesquisa] = useState('');
  const [filtroMarcaPesquisa, setFiltroMarcaPesquisa] = useState('');

  // Atualiza checkbox
  const atualizarCheckbox = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: prev[campo].includes(valor)
        ? prev[campo].filter((v) => v !== valor)
        : [...prev[campo], valor],
    }));
  };

  // Atualiza preço mínimo e máximo
  const atualizarPreco = (campo, valor) => {
    const novoPreco = [...filtros.preco];
    if (campo === 'min') novoPreco[0] = valor === '' ? 0 : Number(valor);
    else novoPreco[1] = valor === '' ? 0 : Number(valor);
    setFiltros((prev) => ({ ...prev, preco: novoPreco }));
  };

  // Contagem produtos por filtro
  const generoContagem = produtos.reduce((acc, produto) => {
    const genero = produto.Genero || 'Outro';
    acc[genero] = (acc[genero] || 0) + 1;
    return acc;
  }, {});

  const categoriaContagem = produtos.reduce((acc, produto) => {
    const categoria = produto.NomeCategoria || 'Outro';
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {});

  const marcaContagem = produtos.reduce((acc, produto) => {
    const marca = produto.Marca || 'Outro';
    acc[marca] = (acc[marca] || 0) + 1;
    return acc;
  }, {});

  const coresUnicas = [...new Set(produtos.flatMap(p => p.variacoes?.map(v => v.cor) || []))].filter(Boolean);
  const corContagem = {};
  produtos.forEach(p => {
    p.variacoes?.forEach(v => {
      if (v.cor) corContagem[v.cor] = (corContagem[v.cor] || 0) + 1;
    });
  });

  const tamanhosSeparados = produtos.flatMap(p => 
    p.variacoes?.flatMap(v => 
      v.tamanho ? v.tamanho.split(',').map(t => t.trim()) : []
    ) || []
  ).filter(Boolean);

  const tamanhosUnicos = [...new Set(tamanhosSeparados)];

  const tamanhoContagem = {};
  tamanhosSeparados.forEach(tamanho => {
    tamanhoContagem[tamanho] = (tamanhoContagem[tamanho] || 0) + 1;
  });

  const filtrarOrdenar = (contagemObj, filtroPesquisa) => {
    return Object.entries(contagemObj)
      .filter(([nome]) => nome.toLowerCase().includes(filtroPesquisa.toLowerCase()))
      .sort((a, b) => b[1] - a[1]);
  };

  const generosFiltrados = filtrarOrdenar(generoContagem, filtroGeneroPesquisa);
  const categoriasFiltradas = filtrarOrdenar(categoriaContagem, filtroCategoriaPesquisa);
  const marcasFiltradas = filtrarOrdenar(marcaContagem, filtroMarcaPesquisa);

  const coresFiltradas = coresUnicas
    .filter(cor => cor.toLowerCase().includes(filtroCorPesquisa.toLowerCase()))
    .map(cor => [cor, corContagem[cor] || 0])
    .sort((a, b) => b[1] - a[1]);

  const tamanhosFiltrados = tamanhosUnicos
    .filter(tam => tam.toLowerCase().includes(filtroTamanhoPesquisa.toLowerCase()))
    .map(tam => [tam, tamanhoContagem[tam] || 0])
    .sort((a, b) => b[1] - a[1]);

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

      {/* Filtro preço */}
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
