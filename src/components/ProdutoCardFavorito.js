import styles from "@/styles/minhaConta.module.css";
import Link from "next/link";

export default function ProdutoCardFavorito({
  produto,
  onToggleFavorito,
  onAddCarrinho,
  favoritos = [],
  selecionado,
  onSelecionar,
}) {
  const isFavorito = favoritos.includes(produto.ID_produto);

  return (
    <div className={styles.card}>
      <Link href={`/produto/${produto.ID_produto}`} className={styles.linkSemEstilo}>
        {produto.Foto ? (
          <img src={produto.Foto} alt={produto.Nome_Produtos} style={{ width: "100%", height: "180px", objectFit: "contain", marginBottom: "10px" }} />
        ) : (
          <div style={{ textAlign: "center", marginBottom: "10px" }}>Sem imagem</div>
        )}
        <h4>{produto.Nome_Produtos}</h4>
        <p>{produto.Marca}</p>
        <p style={{ fontWeight: "bold", color: "#002244" }}>{parseFloat(produto.Preco).toFixed(2)} €</p>
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
        <button className={styles.saveButton} onClick={() => onAddCarrinho(produto.ID_produto)}>
          🛒 Carrinho
        </button>
        <button onClick={() => onToggleFavorito(produto.ID_produto)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <img
            src={
              isFavorito
                ? "/images/coracaoadicpreenchido.jpg"
                : "/images/coracaoadic.jpg"
            }
            alt="Favorito"
            style={{ width: "28px", height: "28px" }}
          />
        </button>
      </div>

      <label style={{ fontSize: "0.85rem", color: "#444", marginTop: "8px", display: "block" }}>
        <input
          type="checkbox"
          checked={selecionado}
          onChange={() => onSelecionar(produto.ID_produto)}
        />{" "}
        Selecionar
      </label>
    </div>
  );
}
