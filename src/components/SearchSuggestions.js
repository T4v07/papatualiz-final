import Link from "next/link";
import Image from "next/image";
import styles from "../styles/SearchSuggestions.module.css";
import { FaSearch } from "react-icons/fa";

export default function SearchSuggestions({ sugestoesPesquisa, produtos, onClose, termoBusca }) {
  return (
    <div className={styles.containerSugestoes}>
      <button className={styles.fecharBtn} onClick={onClose}>✕</button>

      <div className={styles.resultadoContainer}>
        {/* COLUNA 1: Sugestões de pesquisa */}
        <div className={styles.sugestoesColuna}>
          <div className={styles.titulo}>Sugestões de pesquisa</div>

          {sugestoesPesquisa?.length === 0 && <p>Sem sugestões...</p>}

          {sugestoesPesquisa?.map((nome, i) => (
            <Link
              key={`nome-${i}`}
              href={`/pesquisa?q=${encodeURIComponent(nome)}`}
              className={styles.sugestaoItem}
            >
              <FaSearch className={styles.iconLupa} />
              <span className={styles.sugestaoTexto}>
                <strong>{nome.split(" ")[0]}</strong> {nome.split(" ").slice(1).join(" ")}
              </span>
            </Link>
          ))}
        </div>

        {/* COLUNA 2: Produtos */}
        <div className={styles.produtosColuna}>
          <div className={styles.titulo}>Sugestão de produtos</div>

          {produtos.length === 0 && <p>Sem produtos...</p>}

          <div className={styles.produtosGrid}>
            {produtos.map((produto) => {
              const precoOriginal = parseFloat(produto.Preco) || 0;
              const desconto = parseFloat(produto.Desconto) || 0;
              const temDesconto = desconto > 0;
              const precoFinal = (precoOriginal - desconto).toFixed(2);

              return (
                <Link
                  key={produto.ID_produto}
                  href={`/produto/${produto.ID_produto}`}
                  className={styles.produtoCard}
                >
                  <Image
                    src={produto.url || "/no-image.png"}
                    alt={produto.Nome_Produtos}
                    width={140}
                    height={140}
                    className={styles.produtoImagem}
                  />

                  <div className={styles.produtoMarca}>{produto.Marca}</div>

                  <div className={styles.produtoDescricao}>
                    {produto.Nome_Produtos.length > 60
                      ? produto.Nome_Produtos.slice(0, 57) + "..."
                      : produto.Nome_Produtos}
                  </div>

                  <div className={styles.precoContainer}>
                    {temDesconto ? (
                      <>
                        <span className={styles.precoAntigo}>
                          {precoOriginal.toFixed(2)}€
                        </span>
                        <span className={styles.precoFinal}>
                          {precoFinal}€
                        </span>
                      </>
                    ) : (
                      <span className={styles.precoNormal}>
                        {precoOriginal.toFixed(2)}€
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
