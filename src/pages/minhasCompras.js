import { useEffect, useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import styles from "@/styles/minhaConta.module.css";
import { useRouter } from "next/router";

export default function MinhasCompras() {
  const { user } = useContext(AuthContext);
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const COMPRAS_POR_PAGINA = 6;
  const router = useRouter();

  useEffect(() => {
    if (!user?.email) return;

    const fetchCompras = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/compras-do-utilizador?email=${user.email}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Erro ao carregar compras");
        const data = await res.json();
        setCompras(data);
      } catch (err) {
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, [user]);

  const statusColors = {
    pendente: "#f39c12",
    enviado: "#2980b9",
    entregue: "#27ae60",
    cancelado: "#c0392b",
  };

  // Paginação
  const totalPaginas = Math.ceil(compras.length / COMPRAS_POR_PAGINA);
  const comprasPaginadas = compras.slice(
    (paginaAtual - 1) * COMPRAS_POR_PAGINA,
    paginaAtual * COMPRAS_POR_PAGINA
  );

  function mudarPagina(novaPagina) {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
      window.scrollTo(0, 0);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="compras" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2 className={styles.tituloPrincipal}>As minhas compras</h2>

            {loading && <p>Carregando compras...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && compras.length === 0 && <p>(Ainda não tens compras registradas)</p>}

            <div className={styles.cardGrid}>
              {comprasPaginadas.map((compra) => (
                <div
                  key={compra.ID_compra}
                  className={styles.cardCompra}
                  style={{ borderLeftColor: statusColors[compra.Estado?.toLowerCase()] || "#002244" }}
                >
                  <div className={styles.cardConteudo}>
                    <div>
                      <h4>Compra #{compra.ID_compra}</h4>
                      <p>
                        <strong>Data:</strong>{" "}
                        {new Date(compra.Data_compra).toLocaleDateString("pt-PT")}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            color: statusColors[compra.Estado?.toLowerCase()] || "#333",
                            fontWeight: "bold",
                          }}
                        >
                          {compra.Estado || "Desconhecido"}
                        </span>
                      </p>

                      {compra.produtos && (
                        <ul className={styles.listaBonita}>
                          {compra.produtos.map((p, i) => (
                            <li key={i}>
                              <img
                                src={p.Imagem || "/images/placeholder.png"}
                                alt={p.Nome}
                              />
                              <div>
                                <strong>{p.Nome}</strong>
                                <br />
                                {p.Quantidade}x — {parseFloat(p.Preco_unitario).toFixed(2)}€
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}

                      <p>
                        <strong>Total:</strong> {parseFloat(compra.Total_Valor).toFixed(2)}€
                      </p>
                    </div>

                    <button
                      onClick={() => router.push(`/minhasCompras/${compra.ID_compra}`)}
                      className={styles.verDetalhes}
                    >
                      🔍 Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPaginas > 1 && (
              <div
                style={{
                  marginTop: 30,
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
                  ⬅️ Anterior
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => mudarPagina(i + 1)}
                    style={{
                      fontWeight: paginaAtual === i + 1 ? "bold" : "normal",
                      background: paginaAtual === i + 1 ? "#004080" : "#eee",
                      color: paginaAtual === i + 1 ? "#fff" : "#000",
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                >
                  Seguinte ➡️
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
