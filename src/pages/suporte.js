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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErro("Tens de estar logado para enviar um pedido.");
      return;
    }

    if (!assunto || !mensagem) {
      setErro("Por favor preencha todos os campos.");
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
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>📩 Fale com o Suporte</h1>

          {sucesso ? (
            <div className={styles.sucesso}>
              ✅ Seu pedido foi enviado com sucesso! <br /> Em breve entraremos em contacto.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.formulario}>
              <label htmlFor="assunto">Assunto:</label>
              <input
                id="assunto"
                type="text"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Assunto do seu pedido"
              />

              <label htmlFor="mensagem">Mensagem:</label>
              <textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva o problema ou dúvida..."
                rows={5}
              />

              {erro && <p className={styles.erro}>{erro}</p>}

              <button type="submit" className={styles.botao}>
                Enviar Pedido
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
