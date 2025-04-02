import styles from "@/styles/pesquisa.module.css";

export default function ProdutoCard({ produto, userId }) {
  const adicionarCarrinho = async () => {
    if (!userId) {
      alert("Faz login para adicionar ao carrinho.");
      return;
    }

    try {
      const res = await fetch("/api/carrinho/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_utilizador: userId,
          id_produto: produto.ID_produto,
          quantidade: 1,
        }),
      });

      if (res.ok) {
        alert("Adicionado ao carrinho!");
      } else {
        alert("Erro ao adicionar ao carrinho.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de sistema.");
    }
  };

  return (
    <div className={styles.card}>
      {produto.Foto ? (
        <img src={produto.Foto} alt={produto.Nome_Produtos} />
      ) : (
        <div className={styles.semImagem}>Sem imagem</div>
      )}
      <h3>{produto.Nome_Produtos}</h3>
      <p>{produto.Marca}</p>
      <p>{produto.Preco} €</p>
      <button onClick={adicionarCarrinho}>Adicionar ao carrinho</button>
    </div>
  );
}
