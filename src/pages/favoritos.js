import { useEffect, useState, useContext } from "react";
import Navbar from "@/components/navbar";
import SidebarConta from "@/components/SidebarConta";
import ProdutoCardFavorito from "@/components/ProdutoCardFavorito";
import styles from "@/styles/minhaConta.module.css";
import AuthContext from "@/context/AuthContext";

export default function Favoritos() {
  const { user } = useContext(AuthContext);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/favoritos/listar?email=${user.email}`)
      .then(res => res.json())
      .then(data => setFavoritos(data));
  }, [user]);

  const handleToggleFavorito = async (produtoId) => {
    const res = await fetch("/api/favoritos/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, produtoId }),
    });
    if (res.ok) {
      setFavoritos((prev) => prev.filter((p) => p.ID_produto !== produtoId));
    }
  };

  const handleAddCarrinho = async (produtoId) => {
    const res = await fetch("/api/carrinho/adicionar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_utilizador: user.id,
        id_produto: produtoId,
        quantidade: 1,
      }),
    });
    if (res.ok) alert("Produto adicionado ao carrinho!");
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.accountContainer}>
        <SidebarConta active="favoritos" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Favoritos</h2>
            {favoritos.length === 0 ? (
              <p style={{ background: "#fff", padding: "20px", borderRadius: "8px", color: "#a00", fontWeight: "bold" }}>
                ❌ Ainda não tens favoritos guardados.
              </p>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "20px"
              }}>
                {favoritos.map(produto => (
                  <ProdutoCardFavorito
                    key={produto.ID_produto}
                    produto={produto}
                    onAddCarrinho={handleAddCarrinho}
                    onToggleFavorito={handleToggleFavorito}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
