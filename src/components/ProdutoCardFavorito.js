import Image from "next/image";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import styles from "./ProdutoCardFavorito.module.css";

export default function ProdutoCardFavorito({
  produto,
  favoritos,
  onToggleFavorito,
  onAddCarrinho,
}) {
  const isFavorito = favoritos.includes(produto.ID_produto);
  const imagem = produto.Foto || null;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {imagem ? (
          <Image
            src={imagem}
            alt={produto.Nome_Produtos}
            width={280}
            height={180}
            className={styles.image}
            unoptimized // para imagens externas
          />
        ) : (
          <div className={styles.semImagem}>Sem imagem</div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.nome}>{produto.Nome_Produtos}</h3>
        <p className={styles.marca}>{produto.Marca}</p>
        <p className={styles.preco}>€ {parseFloat(produto.Preco).toFixed(2)}</p>
        <div className={styles.buttons}>
          <button onClick={() => onAddCarrinho(produto.ID_produto)} className={styles.buttonCarrinho}>
            <FaShoppingCart /> Carrinho
          </button>
          <button onClick={() => onToggleFavorito(produto.ID_produto)} className={styles.buttonFavorito}>
            {isFavorito ? <FaHeart color="#e63946" size={22} /> : <FaRegHeart color="#e63946" size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
}
