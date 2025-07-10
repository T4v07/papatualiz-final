import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/MoradaEnvio.module.css";
import Link from "next/link";
import Image from "next/image";

export default function MoradaEnvio() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    nome: "",
    apelido: "",
    morada: "",
    numero: "",
    codpostal: "",
    localidade: "",
    telefone: "",
    email: "",
    observacoes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function buscarCarrinho() {
      if (!user?.ID_utilizador) {
        setProdutos([]);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/api/carrinho", {
          headers: { "x-usuario-id": user.ID_utilizador },
        });
        setProdutos(res.data);
      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
        setErro("Erro ao buscar carrinho.");
      } finally {
        setLoading(false);
      }
    }
    buscarCarrinho();
  }, [user?.ID_utilizador]);

  function validarCampos() {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Nome obrigatório";
    if (!form.apelido.trim()) novosErros.apelido = "Apelido obrigatório";
    if (!form.morada.trim()) novosErros.morada = "Morada obrigatória";

    if (!form.codpostal.trim()) {
      novosErros.codpostal = "Código Postal obrigatório";
    } else if (!/^\d{4}-\d{3}$/.test(form.codpostal)) {
      novosErros.codpostal = "Formato inválido. Exemplo: 1234-567";
    }

    if (!form.localidade.trim()) novosErros.localidade = "Localidade obrigatória";

    if (!form.telefone.trim()) {
      novosErros.telefone = "Telefone obrigatório";
    } else {
      const telefoneSomenteNumeros = form.telefone.replace(/\D/g, "");
      if (!/^\d{9}$/.test(telefoneSomenteNumeros)) {
        novosErros.telefone = "Telefone inválido (deve conter 9 dígitos)";
      }
    }

    if (!form.email.trim()) {
      novosErros.email = "Email obrigatório";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      novosErros.email = "Email inválido";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const freteGratisAcimaDe = 50;
  const valorFrete = 5.99;
  const subtotal = produtos.reduce(
    (acc, item) => acc + (Number(item.Preco) || 0) * item.Quantidade,
    0
  );
  const frete = subtotal >= freteGratisAcimaDe ? 0 : valorFrete;
  const total = subtotal + frete;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validarCampos()) return;

    if (!user?.ID_utilizador) {
      alert("Utilizador não autenticado.");
      return;
    }

    try {
      const res = await axios.post("/api/encomendas/criar", {
        usuario_id: user.ID_utilizador,
        nome: form.nome,
        apelido: form.apelido,
        morada: form.morada,
        numero: form.numero,
        codpostal: form.codpostal,
        localidade: form.localidade,
        telefone: form.telefone,
        email: form.email,
        observacoes: form.observacoes,
        subtotal,
        frete,
      });

      const { ID_compra } = res.data;

      localStorage.setItem("compraId", ID_compra);
      router.push("/pagamento");
    } catch (error) {
      console.error("Erro ao criar encomenda:", error);
      alert("Erro ao criar encomenda. Tente novamente.");
    }
  }

  return (
    <div className={styles.container}>
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

      <div className={styles.progressBar}>
        <div className={styles.steps}>
          {["Carrinho", "Entrega", "Pagamento"].map((etapa, index) => (
            <div key={etapa} className={styles.step}>
              <div
                className={`${styles.stepNumber} ${
                  index === 1 ? styles.stepActive : styles.stepInactive
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
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Morada de envio</h2>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="nome">Nome *</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={errors.nome ? styles.errorInput : ""}
                  onBlur={validarCampos}
                />
                {errors.nome && (
                  <span className={styles.errorMsg}>{errors.nome}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="apelido">Apelido *</label>
                <input
                  type="text"
                  id="apelido"
                  name="apelido"
                  value={form.apelido}
                  onChange={handleChange}
                  className={errors.apelido ? styles.errorInput : ""}
                  onBlur={validarCampos}
                />
                {errors.apelido && (
                  <span className={styles.errorMsg}>{errors.apelido}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="morada">Morada (Rua) *</label>
              <input
                type="text"
                id="morada"
                name="morada"
                value={form.morada}
                onChange={handleChange}
                className={errors.morada ? styles.errorInput : ""}
                onBlur={validarCampos}
              />
              {errors.morada && (
                <span className={styles.errorMsg}>{errors.morada}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="numero">Número</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={form.numero}
                onChange={handleChange}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="codpostal">Código Postal *</label>
                <input
                  type="text"
                  id="codpostal"
                  name="codpostal"
                  value={form.codpostal}
                  onChange={handleChange}
                  placeholder="1234-567"
                  className={errors.codpostal ? styles.errorInput : ""}
                  onBlur={validarCampos}
                />
                {errors.codpostal && (
                  <span className={styles.errorMsg}>{errors.codpostal}</span>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="localidade">Localidade *</label>
                <input
                  type="text"
                  id="localidade"
                  name="localidade"
                  value={form.localidade}
                  onChange={handleChange}
                  className={errors.localidade ? styles.errorInput : ""}
                  onBlur={validarCampos}
                />
                {errors.localidade && (
                  <span className={styles.errorMsg}>{errors.localidade}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                placeholder="Só números"
                className={errors.telefone ? styles.errorInput : ""}
                onBlur={validarCampos}
              />
              {errors.telefone && (
                <span className={styles.errorMsg}>{errors.telefone}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? styles.errorInput : ""}
                onBlur={validarCampos}
              />
              {errors.email && (
                <span className={styles.errorMsg}>{errors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="observacoes">Observações</label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Continuar
            </button>
          </form>
        </section>

        <aside className={styles.rightBox}>
          <h3>Resumo da encomenda</h3>
          {loading ? (
            <p>A carregar...</p>
          ) : erro ? (
            <p>{erro}</p>
          ) : (
            <>
              <div className={styles.resumoLinha}>
                <span>
                  Subtotal ({produtos.length}{" "}
                  {produtos.length === 1 ? "artigo" : "artigos"})
                </span>
                <span>€{subtotal.toFixed(2).replace(".", ",")}</span>
              </div>

              <div className={styles.resumoLinha}>
                <span>Taxa de entrega</span>
                <span>
                  {frete === 0 ? "Grátis" : `€${frete.toFixed(2).replace(".", ",")}`}
                </span>
              </div>

              <div className={styles.resumoTotal}>
                <span>Total</span>
                <span>€{total.toFixed(2).replace(".", ",")}</span>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
