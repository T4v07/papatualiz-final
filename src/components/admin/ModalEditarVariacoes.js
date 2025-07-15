import { useEffect, useState } from "react";
import styles from "@/styles/ModalEditarVariacoes.module.css";

export default function ModalEditarVariações({ produtoId, onClose, onAtualizar }) {
  const [variacoes, setVariacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function fetchVariacoes() {
      try {
        const res = await fetch(`/api/admin/variacoes?produto_id=${produtoId}`);
        const data = await res.json();
        setVariacoes(data || []);
      } catch (err) {
        console.error("Erro ao buscar variações:", err);
      } finally {
        setLoading(false);
      }
    }

    if (produtoId) fetchVariacoes();
  }, [produtoId]);

  const handleChange = (index, campo, valor) => {
    const novaLista = [...variacoes];
    novaLista[index][campo] = valor;
    setVariacoes(novaLista);
  };

  const handleAdicionar = () => {
    setVariacoes([...variacoes, { cor: "", tamanho: "", stock: 0 }]);
  };

  const handleRemover = (index) => {
    const novaLista = [...variacoes];
    novaLista.splice(index, 1);
    setVariacoes(novaLista);
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      const res = await fetch("/api/admin/variacoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produto_id: produtoId,
          variacoes,
        }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar variações");
      if (onAtualizar) onAtualizar(); // para atualizar a lista de fora
      onClose();
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar variações.");
    } finally {
      setSalvando(false);
    }
  };

  if (!produtoId) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Editar Variações</h2>

        {loading ? (
          <p>A carregar...</p>
        ) : (
          <div className={styles.variacoesContainer}>
            {variacoes.map((v, idx) => (
              <div className={styles.linha} key={idx}>
                <input
                  type="text"
                  placeholder="Cor"
                  value={v.cor}
                  onChange={(e) => handleChange(idx, "cor", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Tamanho"
                  value={v.tamanho}
                  onChange={(e) => handleChange(idx, "tamanho", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => handleChange(idx, "stock", e.target.value)}
                />
                <button onClick={() => handleRemover(idx)}>Remover</button>
              </div>
            ))}
            <button onClick={handleAdicionar} className={styles.adicionarBtn}>
              ➕ Adicionar Variação
            </button>
          </div>
        )}

        <div className={styles.botoes}>
          <button onClick={onClose} className={styles.cancelar}>Cancelar</button>
          <button onClick={handleSalvar} disabled={salvando} className={styles.salvar}>
            {salvando ? "A guardar..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
