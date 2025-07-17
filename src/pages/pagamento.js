import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/Pagamento.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Pagamento() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [idCompra, setIdCompra] = useState(null);
  const [encomenda, setEncomenda] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [pagamentoStatus, setPagamentoStatus] = useState("");

  const [formPagamento, setFormPagamento] = useState({
    nomeTitular: "",
    numeroCartao: "",
    validade: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const compraId = localStorage.getItem("compraId");
    if (!compraId) {
      router.push("/carrinho");
      return;
    }
    setIdCompra(compraId);
  }, [router]);

  useEffect(() => {
    if (!idCompra) return;
    async function buscarEncomenda() {
      try {
        const res = await axios.get(`/api/encomendas/${idCompra}`);
        setEncomenda(res.data.encomenda);
        setProdutos(res.data.produtos);
      } catch {
        setErro("Erro ao carregar encomenda.");
      } finally {
        setLoading(false);
      }
    }
    buscarEncomenda();
  }, [idCompra]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormPagamento((prev) => ({ ...prev, [name]: value }));
  }

  function validarCampos() {
    const novosErros = {};
    const nome = formPagamento.nomeTitular.trim();
    const cartao = formPagamento.numeroCartao.replace(/\s/g, "");
    const validade = formPagamento.validade.trim();
    const cvv = formPagamento.cvv.trim();

    if (!nome) {
      novosErros.nomeTitular = "Nome obrigatório";
    } else if (nome.length < 3) {
      novosErros.nomeTitular = "Nome muito curto";
    } else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
      novosErros.nomeTitular = "Apenas letras são permitidas";
    }

    if (!cartao) {
      novosErros.numeroCartao = "Número obrigatório";
    } else if (!/^\d{16}$/.test(cartao)) {
      novosErros.numeroCartao = "Deve conter 16 dígitos";
    }

    if (!validade) {
      novosErros.validade = "Validade obrigatória";
    } else if (!/^\d{2}\/\d{2}$/.test(validade)) {
      novosErros.validade = "Formato inválido (MM/AA)";
    } else {
      const [mesStr, anoStr] = validade.split("/");
      const mes = parseInt(mesStr, 10);
      const ano = parseInt(anoStr, 10);
      const hoje = new Date();
      const validadeData = new Date(2000 + ano, mes - 1);
      const agora = new Date(hoje.getFullYear(), hoje.getMonth());

      if (mes < 1 || mes > 12) {
        novosErros.validade = "Mês inválido";
      } else if (validadeData < agora) {
        novosErros.validade = "Cartão expirado";
      }
    }

    if (!cvv) {
      novosErros.cvv = "CVV obrigatório";
    } else if (!/^\d{3}$/.test(cvv)) {
      novosErros.cvv = "CVV inválido (3 dígitos)";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function confirmarPagamento() {
    if (!validarCampos()) return;
    try {
      setPagamentoStatus("Processando pagamento...");
      await axios.post(`/api/encomendas/${idCompra}/confirmar-pagamento`);
      setPagamentoStatus("Pagamento confirmado!");
      router.push("/confirmacao");
    } catch {
      setPagamentoStatus("Erro no pagamento. Tente novamente.");
    }
  }

  if (loading) return <p>A carregar encomenda...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Link href="/" className={styles.linkHeader}>
            &larr; Continuar a comprar
          </Link>
        </div>

        <div className={styles.logoContainer}>
          <Image src="/logo3.png" alt="Logo SportSet" width={180} height={48} priority />
        </div>

        <div>
          <span className={styles.user}>{user?.nome ? `Olá, ${user.nome}` : ""}</span>
        </div>
      </header>

      <div className={styles.progressBar}>
        <div className={styles.steps}>
          {["Carrinho", "Entrega", "Pagamento"].map((etapa, index) => (
            <div key={etapa} className={styles.step}>
              <div
                className={`${styles.stepNumber} ${
                  index === 2 ? styles.stepActive : styles.stepInactive
                }`}
              >
                {index + 1}
              </div>
              {etapa}
            </div>
          ))}
        </div>
      </div>

      <main className={styles.main}>
        <section className={styles.leftBox}>
          <h2>Detalhes de Pagamento</h2>

          <div className={styles.field}>
            <label htmlFor="nomeTitular">Nome no Cartão *</label>
            <input
              type="text"
              id="nomeTitular"
              name="nomeTitular"
              value={formPagamento.nomeTitular}
              onChange={handleChange}
              className={errors.nomeTitular ? styles.errorInput : ""}
            />
            {errors.nomeTitular && <span className={styles.errorMsg}>{errors.nomeTitular}</span>}
          </div>

          <div className={styles.field}>
            <label htmlFor="numeroCartao">Número do Cartão *</label>
            <input
              type="text"
              id="numeroCartao"
              name="numeroCartao"
              value={formPagamento.numeroCartao}
              onChange={handleChange}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className={errors.numeroCartao ? styles.errorInput : ""}
            />
            {errors.numeroCartao && <span className={styles.errorMsg}>{errors.numeroCartao}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="validade">Validade *</label>
              <input
                type="text"
                id="validade"
                name="validade"
                value={formPagamento.validade}
                onChange={handleChange}
                placeholder="MM/AA"
                className={errors.validade ? styles.errorInput : ""}
              />
              {errors.validade && <span className={styles.errorMsg}>{errors.validade}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="cvv">CVV *</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formPagamento.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength={3}
                className={errors.cvv ? styles.errorInput : ""}
              />
              {errors.cvv && <span className={styles.errorMsg}>{errors.cvv}</span>}
            </div>
          </div>

          <button className={styles.submitBtn} onClick={confirmarPagamento}>
            Confirmar pagamento
          </button>
          <p className={styles.status}>{pagamentoStatus}</p>
        </section>

        <aside className={styles.rightBox}>
          <h3>Resumo da encomenda</h3>

          <div className={styles.resumoLinha}>
            <span>
              Subtotal ({produtos.length} {produtos.length === 1 ? "artigo" : "artigos"})
            </span>
            <span>€{Number(encomenda.Subtotal).toFixed(2).replace(".", ",")}</span>
          </div>

          <div className={styles.resumoLinha}>
            <span>Taxa de entrega</span>
            <span>
              {Number(encomenda.Frete) === 0
                ? "Grátis"
                : `€${Number(encomenda.Frete).toFixed(2).replace(".", ",")}`}
            </span>
          </div>

          <div className={styles.resumoLinha}>
            <span>Desconto</span>
            <span>
              {encomenda.Desconto && encomenda.Desconto > 0
                ? `- €${Number(encomenda.Desconto).toFixed(2).replace(".", ",")}`
                : "-"}
            </span>
          </div>

          <div className={styles.resumoTotal}>
            <span>Total</span>
            <span>€{Number(encomenda.Total_Valor).toFixed(2).replace(".", ",")}</span>
          </div>
        </aside>
      </main>
    </div>
  );
}
