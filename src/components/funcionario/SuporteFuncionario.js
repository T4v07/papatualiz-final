import { useEffect, useState } from "react";
import styles from "@/styles/funcionarioSuporte.module.css";
import jsPDF from "jspdf";

export default function FuncionarioSuporte() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [resposta, setResposta] = useState("");

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const res = await fetch("/api/funcionario/suporte/listar");
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      }
    }
    fetchPedidos();
  }, []);

  const pedidosFiltrados = pedidos
    .filter((p) =>
      (filtro === "todos" || p.Estado === filtro) &&
      ((p.Nome || "").toLowerCase().includes(pesquisa.toLowerCase()) ||
        (p.Assunto || "").toLowerCase().includes(pesquisa.toLowerCase()))
    )
    .sort((a, b) => new Date(b.Data_envio) - new Date(a.Data_envio));

  const handleResponder = async () => {
    if (!resposta.trim()) return;
    try {
      const res = await fetch("/api/funcionario/suporte/responder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID_suporte: selecionado.ID_suporte,
          resposta,
          email: selecionado.Email,
          nome: selecionado.Nome,
          assunto: selecionado.Assunto,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const atualizados = pedidos.map((p) =>
          p.ID_suporte === selecionado.ID_suporte
            ? { ...p, Estado: "respondido", Resposta: resposta }
            : p
        );
        setPedidos(atualizados);
        setSelecionado(null);
        setResposta("");
        alert("Resposta enviada com sucesso!");
      } else {
        alert(data.message || "Erro ao responder.");
      }
    } catch (err) {
      console.error("Erro ao responder:", err);
    }
  };

  const exportarCSV = () => {
    const linhas = ["Nome,Email,Assunto,Mensagem,Estado,Data_envio"];
    pedidosFiltrados.forEach((p) => {
      linhas.push(
        `"${p.Nome}","${p.Email}","${p.Assunto}","${p.Mensagem}","${p.Estado}","${p.Data_envio}"`
      );
    });
    const blob = new Blob([linhas.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pedidos-suporte.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportarPDF = () => {
    if (!selecionado) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Conversa com ${selecionado.Nome}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Assunto: ${selecionado.Assunto}`, 10, 30);
    doc.text(`Mensagem:\n${selecionado.Mensagem}`, 10, 45);
    if (selecionado.Resposta) {
      doc.text(`Resposta anterior:\n${selecionado.Resposta}`, 10, 70);
    }
    doc.save(`Suporte_${selecionado.Nome}_${Date.now()}.pdf`);
  };

  return (
  <div className={styles.container}>
    <div className={styles.pedidosBox}>
      <h2>Pedidos de Suporte</h2>
      <div className={styles.filtros}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou assunto"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className={styles.inputPesquisa}
        />
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className={styles.selectEstado}
        >
          <option value="todos">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="respondido">Respondido</option>
        </select>
        <button onClick={exportarCSV} className={styles.botaoAcao}>
          Exportar CSV
        </button>
      </div>
      <div className={styles.listaPedidos}>
        {pedidosFiltrados.map((p) => (
          <div
            key={p.ID_suporte}
            onClick={() => setSelecionado(p)}
            className={`${styles.itemPedido} ${selecionado?.ID_suporte === p.ID_suporte ? styles.itemSelecionado : p.Estado === "respondido" ? styles.itemRespondido : ""}`}
          >
            <strong>
              {p.Estado === "respondido" ? "✅ " : "🟡 "}
              {p.Assunto}
            </strong>
            <br />
            <small>
              {p.Nome} -{" "}
              <span
                className={
                  p.Estado === "respondido"
                    ? styles["estado-respondido"]
                    : styles["estado-pendente"]
                }
              >
                {p.Estado}
              </span>
            </small>
            <br />
            <small>{new Date(p.Data_envio).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>

    <div className={styles.painelResposta}>
      {selecionado ? (
        <>
          <h3>Responder a {selecionado.Nome}</h3>
          <p><strong>Assunto:</strong> {selecionado.Assunto}</p>
          <p><strong>Mensagem:</strong> {selecionado.Mensagem}</p>
          {selecionado.Estado === "respondido" && (
            <p>
              <strong>Resposta anterior:</strong>
              <br />
              {selecionado.Resposta || "-"}
            </p>
          )}
          <textarea
            rows="6"
            placeholder="Escreva sua resposta aqui..."
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
          ></textarea>
          <div className={styles.botoesResposta}>
            <button onClick={handleResponder} className={styles.botaoAcao}>
              Enviar Resposta
            </button>
            <button onClick={exportarPDF} className={styles.botaoAcao}>
              Exportar PDF
            </button>
          </div>
        </>
      ) : (
        <p>Selecione um pedido para visualizar e responder.</p>
      )}
    </div>
  </div>

);
}
