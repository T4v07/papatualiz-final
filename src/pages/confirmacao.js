import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/Confirmacao.module.css";

export default function Confirmacao() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [encomenda, setEncomenda] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const idCompra = localStorage.getItem("compraId");
    if (!idCompra) {
      router.push("/");
      return;
    }

    async function fetchDados() {
      try {
        const res = await axios.get(`/api/encomendas/${idCompra}`);
        setEncomenda(res.data.encomenda || null);
        setProdutos(res.data.produtos || []);
      } catch (error) {
        setErro("Erro ao carregar confirmação.");
        console.error(error);
      }
    }

    fetchDados();
  }, [router]);

  if (erro) return <p>{erro}</p>;

  const dataFormatada = encomenda?.Data_compra
    ? new Date(encomenda.Data_compra).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image src="/logo3.png" alt="Logo SportSet" width={180} height={48} className={styles.logo} />
        </div>
        <span className={styles.user}>{user?.nome ? `Olá, ${user.nome}` : ""}</span>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>✅ Sucesso</h1>
          <p className={styles.mensagem}>
            Pagamento realizado com sucesso!
            <br />
            Obrigado pela sua compra, <strong>{encomenda?.nome}</strong>!
          </p>

          <div className={styles.detalhes}>
            <p>
              <strong>Número da encomenda:</strong>{" "}
              <span className={styles.codigo}>{encomenda?.ID_compra}</span>
            </p>
            <p>
              <strong>Subtotal:</strong> €{Number(encomenda?.Subtotal || 0).toFixed(2).replace(".", ",")}
            </p>
            <p>
              <strong>Taxa de entrega:</strong>{" "}
              {Number(encomenda?.Frete) === 0
                ? "Grátis"
                : `€${Number(encomenda?.Frete || 0).toFixed(2).replace(".", ",")}`}
            </p>
            <p>
              <strong>Total pago:</strong> €{Number(encomenda?.Total_Valor || 0).toFixed(2).replace(".", ",")}
            </p>
            <p>
              <strong>Data:</strong> {dataFormatada}
            </p>
          </div>

          {/* Produtos comprados */}
          <div className={styles.produtos}>
            <h3>Produtos comprados:</h3>
            <ul className={styles.listaProdutos}>
              {produtos.map((item) => (
                <li key={item.ID_produto} className={styles.produto}>
                  <div className={styles.produtoImg}>
                    <Image
                      src={item.imagem || "/placeholder.png"}
                      alt={item.nome}
                      width={80}
                      height={80}
                    />
                  </div>
                  <div className={styles.produtoInfo}>
                    <span className={styles.produtoNome}>{item.nome}</span>
                    <span className={styles.produtoQtd}>Quantidade: {item.Quantidade}</span>
                    <span className={styles.produtoPreco}>
                      Preço: €{Number(item.Preco_unitario).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.botoes}>
            <Link href="/minhasCompras" className={styles.btn}>
              Ver Encomendas
            </Link>
            <Link href="/" className={styles.btnSecundario}>
              Voltar à Loja
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
