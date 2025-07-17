import { useState, useEffect, useRef } from "react";
import styles from "./produtoCard.module.css";

export default function ProdutoCard({ produto, onClick }) {
  const preco = parseFloat(produto.Preco) || 0;
  const desconto = parseFloat(produto.Desconto) || 0;
  const temDesconto = desconto > 0;
  const precoFinal = (preco - desconto).toFixed(2);

  const fotos = produto.fotos?.length > 0
    ? produto.fotos.map(f => f.url)
    : ["/images/uploads/sem-imagem.png"];

  const [imagemAtiva, setImagemAtiva] = useState(0);
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setImagemAtiva(prev => (prev + 1) % fotos.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [fotos.length]);

  const handleMiniaturaClick = (i) => {
    clearInterval(timerRef.current);
    setImagemAtiva(i);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imagemPrincipalContainer}>
        <img
          src={fotos[imagemAtiva]}
          alt={`${produto.Nome_Produtos} foto ${imagemAtiva + 1}`}
          className={styles.imagemPrincipal}
        />
      </div>

      <div className={styles.miniaturasContainer}>
        {fotos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${produto.Nome_Produtos} miniatura ${i + 1}`}
            className={`${styles.miniatura} ${i === imagemAtiva ? styles.miniaturaAtiva : ""}`}
            onClick={() => handleMiniaturaClick(i)}
          />
        ))}
      </div>

      <div className={styles.info}>
        <p className={styles.marca}>{produto.Marca?.toUpperCase()}</p>

        <h3 className={styles.nome}>
          {produto.Nome_Produtos?.length > 70
            ? produto.Nome_Produtos.slice(0, 67) + "..."
            : produto.Nome_Produtos}
        </h3>

        <div className={styles.precoArea}>
          {temDesconto ? (
            <>
              <span className={styles.precoOriginal}>{preco.toFixed(2)}€</span>
              <span className={styles.precoComDesconto}>{precoFinal}€</span>
              <span className={styles.etiquetaDesconto}>-{desconto.toFixed(2)}€</span>
            </>
          ) : (
            <span className={styles.precoSemDesconto}>{preco.toFixed(2)}€</span>
          )}
        </div>
      </div>
    </div>
  );
}
