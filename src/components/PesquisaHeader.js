// components/PesquisaHeader.js
import { useRouter } from "next/router";
import styles from "@/styles/PesquisaHeader.module.css";

export default function PesquisaHeader({
  termo,
  totalResultados,
  sugestoes = [],
  ordenacao,
  setOrdenacao,
}) {
  const router = useRouter();

  const handleSugestaoClick = (tag) => {
    router.push(`/pesquisa?q=${encodeURIComponent(tag)}`);
  };

  const handleOrdenarChange = (e) => {
    if (setOrdenacao) setOrdenacao(e.target.value);
  };

  return (
    <div className={styles.headerContainer}>
      <p className={styles.resultado}>
        Resultados para: <span>"{termo}"</span>
      </p>

      {sugestoes.length > 0 && (
        <div className={styles.sugestoesContainer}>
          <p className={styles.label}>Sugestões:</p>
          <div className={styles.tags}>
            {sugestoes.map((tag, index) => (
              <button
                key={index}
                className={styles.tag}
                onClick={() => handleSugestaoClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.bottomRow}>
        <p className={styles.total}>{totalResultados} Produtos</p>

        <div className={styles.ordenacao}>
          <label htmlFor="ordenar">Ordenar por</label>
          <select
            id="ordenar"
            value={ordenacao}
            onChange={handleOrdenarChange}
          >
            <option value="mais-vendidos">Mais vendidos</option>
            <option value="preco-crescente">Preço: mais baixo</option>
            <option value="preco-decrescente">Preço: mais alto</option>
            <option value="novidades">Novidades</option>
          </select>
        </div>
      </div>
    </div>
  );
}
