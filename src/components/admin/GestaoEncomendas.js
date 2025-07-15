import { useEffect, useState } from "react";
import styles from "@/styles/gestaoEncomendas.module.css";

export default function GestaoEncomendas() {
  const [encomendas, setEncomendas] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [estado, setEstado] = useState("");
  const [search, setSearch] = useState("");
  const [arquivadoFiltro, setArquivadoFiltro] = useState("false");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [valorMin, setValorMin] = useState("");
  const [valorMax, setValorMax] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEncomendas = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", 10);
    if (estado) params.append("estado", estado);
    if (search) params.append("busca", search);
    if (arquivadoFiltro) params.append("arquivado", arquivadoFiltro);
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);
    if (valorMin) params.append("valorMin", valorMin);
    if (valorMax) params.append("valorMax", valorMax);

    const res = await fetch(`/api/encomendas/listar?${params.toString()}`);
    const data = await res.json();

    setEncomendas(data.encomendas || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchEncomendas();
  }, [page, estado, search, arquivadoFiltro, dataInicio, dataFim, valorMin, valorMax]);

  const atualizarEstado = async (id, novoEstado) => {
    const res = await fetch("/api/encomendas/atualizar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, novoEstado }),
    });

    if (res.ok) {
      setEncomendas((prev) =>
        prev.map((e) =>
          e.ID_encomenda === id ? { ...e, Estado: novoEstado } : e
        )
      );
    }
  };

  const atualizarArquivado = async (id, arquivar) => {
    const res = await fetch("/api/encomendas/arquivar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, arquivar }),
    });

    if (res.ok) {
      fetchEncomendas();
    }
  };

  const limparFiltros = () => {
    setEstado("");
    setSearch("");
    setArquivadoFiltro("false");
    setDataInicio("");
    setDataFim("");
    setValorMin("");
    setValorMax("");
    setPage(1);
  };

  return (
    <div className={styles.pagina}>
      <h2 className={styles.titulo}>📦 Gestão de Encomendas</h2>

      <div className={styles.controles}>
        <input
          type="text"
          placeholder="Pesquisar por nome, email ou ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={styles.inputBusca}
        />

        <select
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value);
            setPage(1);
          }}
          className={styles.selectEstadoFiltro}
        >
          <option value="">Todos os estados</option>
          <option value="pendente">Pendente</option>
          <option value="em preparação">Em preparação</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
        </select>

        <select
          value={arquivadoFiltro}
          onChange={(e) => {
            setArquivadoFiltro(e.target.value);
            setPage(1);
          }}
          className={styles.selectEstadoFiltro}
        >
          <option value="false">Não arquivados</option>
          <option value="true">Arquivados</option>
          <option value="">Todos</option>
        </select>

        <input
          type="date"
          value={dataInicio}
          onChange={(e) => {
            setDataInicio(e.target.value);
            setPage(1);
          }}
          className={styles.inputData}
        />

        <input
          type="date"
          value={dataFim}
          onChange={(e) => {
            setDataFim(e.target.value);
            setPage(1);
          }}
          className={styles.inputData}
        />

        <input
          type="number"
          placeholder="Valor mín. €"
          value={valorMin}
          onChange={(e) => {
            setValorMin(e.target.value);
            setPage(1);
          }}
          className={styles.inputPreco}
          min={0}
        />

        <input
          type="number"
          placeholder="Valor máx. €"
          value={valorMax}
          onChange={(e) => {
            setValorMax(e.target.value);
            setPage(1);
          }}
          className={styles.inputPreco}
          min={0}
        />

        <button onClick={limparFiltros} className={styles.botaoLimpar}>
          Limpar Filtros
        </button>
      </div>

      {loading ? (
        <p>Carregando encomendas...</p>
      ) : encomendas.length > 0 ? (
        encomendas.map((e) => (
          <div key={e.ID_encomenda} className={styles.cardEncomenda}>
            <div className={styles.topoCard}>
              <div>
                <strong>Cliente:</strong> {e.nome} {e.apelido} <br />
                <strong>Email:</strong> {e.email} <br />
                <strong>Telefone:</strong> {e.telefone}
              </div>
              <div>
                <strong>Data:</strong>{" "}
                {new Date(e.Data_criacao).toLocaleDateString()} <br />
                <strong>ID Encomenda:</strong> #{e.ID_encomenda} <br />
                <strong>Estado:</strong>{" "}
                <span
                  className={`${styles.estado} ${
                    styles[e.Estado.toLowerCase().replace(" ", "")]
                  }`}
                >
                  {e.Estado}
                </span>
                <br />
                <select
                  className={styles.selectEstado}
                  value={e.Estado}
                  onChange={(ev) =>
                    atualizarEstado(e.ID_encomenda, ev.target.value)
                  }
                >
                  <option value="pendente">Pendente</option>
                  <option value="em preparação">Em preparação</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                </select>
                <br />
                <label>
                  <input
                    type="checkbox"
                    checked={e.Arquivado === 1}
                    onChange={(ev) =>
                      atualizarArquivado(e.ID_encomenda, ev.target.checked)
                    }
                  />{" "}
                  Arquivado
                </label>
              </div>
            </div>

            <div className={styles.morada}>
              <strong>Morada:</strong> {e.Rua}, Nº {e.Numero} <br />
              {e.Codigo_postal} {e.Cidade}, {e.Pais}
            </div>

            <div className={styles.listaProdutos}>
              {Array.isArray(e.Produtos) && e.Produtos.length > 0 ? (
                e.Produtos.map((p, i) => (
                  <div key={i} className={styles.produtoLinha}>
                    <img
                      src={p.url || "/sem-imagem.jpg"}
                      alt={p.Nome_Produtos}
                    />
                    <div>
                      <strong>{p.Nome_Produtos}</strong> <br />
                      <span>Marca: {p.Marca}</span> <br />
                      <span>Cor: {p.cor || "-"}</span> |{" "}
                      <span>Tamanho: {p.tamanho || "-"}</span> <br />
                      <span>
                        Qtd: {p.Quantidade} x €{p.Preco_unitario}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum produto nesta encomenda.</p>
              )}
            </div>

            <div className={styles.totalLinha}>
              <strong>Total:</strong> €{e.Total_Valor}
            </div>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Nenhuma encomenda encontrada.
        </p>
      )}

      <div className={styles.paginacao}>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className={styles.botaoPagina}
        >
          &lt; Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className={styles.botaoPagina}
        >
          Próximo &gt;
        </button>
      </div>
    </div>
  );
}
