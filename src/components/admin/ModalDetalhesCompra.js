import styles from "@/styles/ModalDetalhesCompra.module.css";

export default function ModalDetalhesCompra({ compra, onClose, fetchCompras }) {
  if (!compra) return null;

  const arquivarCompra = async () => {
    try {
      const confirm = window.confirm("Tens a certeza que queres arquivar esta compra?");
      if (!confirm) return;

      const res = await fetch(`/api/admin/arquivar?id=${compra.ID_compra}`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error("Erro ao arquivar");

      alert("Compra arquivada com sucesso.");
      onClose();
      fetchCompras();
    } catch (err) {
      console.error("Erro ao arquivar:", err);
      alert("Erro ao arquivar compra.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.fechar} onClick={onClose}>❌ Fechar</button>

        <h3>Detalhes da Compra #{compra.ID_compra}</h3>

        <div className={styles.detalhesCompra}>
          <p><strong>Cliente:</strong> {compra.Nome_Cliente}</p>
          <p><strong>Data:</strong> {new Date(compra.Data_criacao).toLocaleString("pt-PT")}</p>
          <p><strong>Total:</strong> {Number(compra.Total_Valor).toFixed(2)} €</p>
        </div>

        <button className={styles.btnArquivar} onClick={arquivarCompra}>
          🗂️ Arquivar Compra
        </button>

        <div className={styles.produtosContainer}>
          {compra.produtos.map((p, i) => (
            <div key={i} className={styles.produtoCard}>
              <img
                src={p.Foto?.trim() ? p.Foto : "/images/placeholder.png"}
                alt={p.Nome_Produtos}
              />
              <div>
                <strong>{p.Nome_Produtos}</strong>
                <p>Preço: {Number(p.Preco).toFixed(2)} €</p>
                <p>Quantidade: {p.Quantidade}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
