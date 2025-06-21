import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/VistosRecentemente.module.css";

const VistosRecentemente = () => {
  const [vistos, setVistos] = useState([]);

  useEffect(() => {
    const armazenados = localStorage.getItem("produtosVistosRecentemente");
    if (armazenados) {
      setVistos(JSON.parse(armazenados).slice(-4).reverse()); // pega os 4 mais recentes
    }
  }, []);

  if (vistos.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Vistos recentemente</h2>
      <div className={styles.grid}>
        {vistos.map((produto) => (
          <Link key={produto.ID_produto} href={`/produto/${produto.ID_produto}`}>
            <div className={styles.card}>
              <img src={produto.Foto} alt={produto.Nome_Produtos} />
              <p>{produto.Nome_Produtos}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VistosRecentemente;
