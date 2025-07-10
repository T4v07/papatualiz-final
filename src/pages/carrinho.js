import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import CarrinhoVazio from "@/components/CarrinhoVazio";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/carrinho.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Carrinho() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [cupom, setCupom] = useState("");
  const [cupomAtivo, setCupomAtivo] = useState(false);
  const [desconto, setDesconto] = useState(0);

  const freteGratisAcimaDe = 50;
  const valorFrete = 5.99;

  const atualizarCarrinho = async () => {
    setLoading(true);
    setErro("");
    try {
      const usuarioId = user?.ID_utilizador || localStorage.getItem("usuarioId");
      if (!usuarioId) {
        setProdutos([]);
        setLoading(false);
        return;
      }

      const response = await axios.get("/api/carrinho", {
        headers: { "x-usuario-id": usuarioId },
      });

      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      setErro("Erro ao buscar carrinho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    atualizarCarrinho();
  }, [user]);

  const atualizarQuantidade = async (id, novaQtd) => {
    if (novaQtd < 1) return;
    const usuarioId = user?.ID_utilizador || localStorage.getItem("usuarioId");
    try {
      const response = await axios.put(
        "/api/carrinho",
        { id_carrinho: id, quantidade: novaQtd },
        { headers: { "x-usuario-id": usuarioId } }
      );

      if (response.data.carrinho) {
        setProdutos(response.data.carrinho);
      } else {
        setProdutos((produtos) =>
          produtos.map((p) =>
            p.ID_carrinho === id ? { ...p, Quantidade: novaQtd } : p
          )
        );
      }
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
    }
  };

  const removerItem = async (id) => {
    if (!confirm("Tem certeza que deseja remover este item do carrinho?")) return;
    const usuarioId = user?.ID_utilizador || localStorage.getItem("usuarioId");
    try {
      const response = await axios.delete("/api/carrinho", {
        data: { id_carrinho: id },
        headers: { "x-usuario-id": usuarioId },
      });

      if (response.data.carrinho) {
        setProdutos(response.data.carrinho);
      } else {
        setProdutos((produtos) => produtos.filter((p) => p.ID_carrinho !== id));
      }
    } catch (err) {
      console.error("Erro ao remover item:", err);
    }
  };

  const subtotal = produtos.reduce(
    (acc, item) => acc + (Number(item.Preco) || 0) * item.Quantidade,
    0
  );
  const frete = subtotal >= freteGratisAcimaDe ? 0 : valorFrete;
  const totalSemDesconto = subtotal + frete;
  const totalComDesconto = totalSemDesconto - desconto;

  const aplicarCupom = () => {
    if (cupom.trim().toUpperCase() === "SPORT10") {
      setDesconto(10);
      setCupomAtivo(true);
      alert("Cupom aplicado! 10€ de desconto.");
    } else {
      setDesconto(0);
      setCupomAtivo(false);
      alert("Cupom inválido.");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p>A carregar...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className={styles.container}>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* TOPO CORRIGIDO COM GRID */}
      <header className={styles.header}>
        <Link href="/" className={styles.linkHeader}>
          &larr; Continuar a comprar
        </Link>

        <div className={styles.logoContainer}>
          <Image
            src="/logo3.png"
            alt="Logo SportSet"
            width={180}
            height={48}
            className={styles.logo}
            priority
          />
        </div>

        <span className={styles.user}>
          {user?.nome ? `Olá, ${user.nome}` : ""}
        </span>
      </header>

      {/* BARRA DE PROGRESSO */}
      <div className={styles.progressBar}>
        <div className={styles.steps}>
          {["Carrinho", "Entrega", "Pagamento"].map((etapa, index) => (
            <div key={etapa} className={styles.step}>
              <div
                className={`${styles.stepNumber} ${
                  index === 0 ? styles.stepActive : styles.stepInactive
                }`}
              >
                {index + 1}
              </div>
              {etapa}
            </div>
          ))}
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className={styles.main}>
        {produtos.length === 0 ? (
          <CarrinhoVazio modo="box" />
        ) : (
          <section className={styles.leftBox}>
            {produtos.map((item) => (
              <div key={item.ID_carrinho} className={styles.item}>
                <img
                  src={item.Foto || "/sem-imagem.jpg"}
                  alt={item.Nome_Produtos}
                  className={styles.imagem}
                />
                <div className={styles.detalhes}>
                  <h3>{item.Nome_Produtos}</h3>
                  <p>{item.Marca}</p>
                  <p>
                    {item.Cor} | Tamanho:{" "}
                    {item.Tamanho ? item.Tamanho.split(",")[0].trim() : ""}
                  </p>
                  <p>
                    Preço unitário: €{(Number(item.Preco) || 0).toFixed(2).replace(".", ",")}
                  </p>
                  <div className={styles.quantidadeBox}>
                    <label>Quantidade:</label>
                    <button
                      className={styles.qtdBtn}
                      onClick={() => atualizarQuantidade(item.ID_carrinho, item.Quantidade - 1)}
                      disabled={item.Quantidade <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.Quantidade}
                      min={1}
                      onChange={(e) =>
                        atualizarQuantidade(item.ID_carrinho, parseInt(e.target.value) || 1)
                      }
                    />
                    <button
                      className={styles.qtdBtn}
                      onClick={() => atualizarQuantidade(item.ID_carrinho, item.Quantidade + 1)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => removerItem(item.ID_carrinho)}
                      className={styles.removerBtn}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* RESUMO */}
        <aside className={styles.rightBox}>
          <h3>Resumo da encomenda</h3>

          <div className={styles.resumoLinha}>
            <span>
              Subtotal ({produtos.length} {produtos.length === 1 ? "artigo" : "artigos"})
            </span>
            <span>€{subtotal.toFixed(2).replace(".", ",")}</span>
          </div>

          <div className={styles.resumoLinha}>
            <span>Taxa de entrega</span>
            <span>{frete === 0 ? "Grátis" : `€${frete.toFixed(2).replace(".", ",")}`}</span>
          </div>

          <div className={styles.cupomBox}>
            <input
              type="text"
              placeholder="Tem cupom? Insira aqui"
              value={cupom}
              onChange={(e) => setCupom(e.target.value)}
              className={styles.cupomInput}
              disabled={cupomAtivo}
            />
            <button
              onClick={aplicarCupom}
              disabled={cupomAtivo || cupom.trim() === ""}
              className={styles.cupomBtn}
            >
              {cupomAtivo ? "Cupom aplicado" : "Aplicar"}
            </button>
          </div>

          {cupomAtivo && (
            <div className={styles.resumoLinha}>
              <span>Desconto</span>
              <span>-€{desconto.toFixed(2).replace(".", ",")}</span>
            </div>
          )}

          <div className={styles.resumoTotal}>
            <span>Total</span>
            <span>€{totalComDesconto.toFixed(2).replace(".", ",")}</span>
          </div>

          <button
            className={styles.pagarBtn}
            onClick={() => router.push("/moradaenvio")}
          >
            Finalizar Compra
          </button>
        </aside>
      </main>
    </div>
  );
}
