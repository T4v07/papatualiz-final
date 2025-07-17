import { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import styles from "@/styles/suporte.module.css";
import Navbar from "@/components/navbar";

export default function Suporte() {
  const { user } = useContext(AuthContext);
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      setErro("Tens de estar logado para enviar um pedido.");
      setIsLoading(false);
      return;
    }

    if (!assunto || !mensagem) {
      setErro("Por favor preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    const dados = {
      ID_utilizador: user?.id || user?.ID_utilizador,
      Nome: user?.nome || user?.username || "Cliente",
      Email: user?.email,
      Assunto: assunto,
      Mensagem: mensagem,
    };

    try {
      const res = await fetch("/api/suporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const data = await res.json();

      if (res.ok) {
        setSucesso(true);
        setErro("");
        setAssunto("");
        setMensagem("");
      } else {
        setErro(data.message || "Erro ao enviar pedido.");
      }
    } catch (err) {
      console.error("Erro ao enviar:", err);
      setErro("Erro na comunicação com o servidor.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>📩 Fale com o Suporte</h1>
          <p className={styles.subtitulo}>
            Tem dúvidas ou problemas? Envie-nos uma mensagem e entraremos em contacto.
          </p>

          {sucesso ? (
            <div className={styles.sucesso}>
              <span>✅</span> Pedido enviado com sucesso! <br />
              Em breve entraremos em contacto.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.formulario}>
              <label htmlFor="assunto">Tipo de Pedido:</label>
              <select
                id="assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
              >
                <option value="">-- Selecione uma opção --</option>
                <option value="Dúvida sobre produto">Dúvida sobre produto</option>
                <option value="Problema com encomenda">Problema com encomenda</option>
                <option value="Trocas e devoluções">Trocas e devoluções</option>
                <option value="Outro">Outro</option>
              </select>

              <label htmlFor="mensagem">Mensagem:</label>
              <textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva o problema ou dúvida..."
                rows={5}
              />

              {erro && <div className={styles.erro}>⚠️ {erro}</div>}

              <button type="submit" className={styles.botao} disabled={isLoading}>
                {isLoading ? "A enviar..." : "Enviar Pedido"}
              </button>
            </form>
          )}

          {/* Rodapé e FAQ */}
          <div className={styles.rodapeInfo}>
            <p className={styles.horario}>
              🕒 Atendimento: Segunda a Sexta, das 9h às 18h (dias úteis)
            </p>
            <p className={styles.politica}>
              ℹ️ Precisas de ajuda com trocas?{" "}
              <a href="/politica-devolucoes">Consulta a nossa política</a>
            </p>
          </div>

          <div className={styles.faqSection}>
            <h2>Perguntas Frequentes</h2>

            <details>
              <summary>Como posso acompanhar a minha encomenda?</summary>
              <p>Vai à tua Área Pessoal &gt; Minhas Encomendas para ver o estado atual.</p>
            </details>

            <details>
              <summary>Posso trocar um produto se não servir?</summary>
              <p>Sim! Preenche este formulário e seleciona "Trocas e devoluções".</p>
            </details>

            <details>
              <summary>Em quanto tempo respondem ao meu pedido?</summary>
              <p>Normalmente em até 24h úteis (dias úteis, entre 9h e 18h).</p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
