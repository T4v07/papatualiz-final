import { useState } from "react";
import styles from "@/styles/Modal.module.css";

export default function ModalAdicionarFuncionario({ onClose, onAdicionar }) {
  const [formData, setFormData] = useState({
    nome: "",
    username: "",
    email: "",
    telefone: "",
    password: "",
    confirmar: "",
  });

  const [erro, setErro] = useState("");

  const handleSubmit = async () => {
    const { nome, username, email, telefone, password, confirmar } = formData;

    if (!nome || !username || !email || !password || !confirmar) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      setErro("O email inserido não é válido.");
      return;
    }

    if (password !== confirmar) {
      setErro("As palavras-passe não coincidem.");
      return;
    }

    try {
      const res = await fetch("/api/admin/verificar-utilizador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro desconhecido.");

      if (data.emailExiste) {
        setErro("Já existe uma conta com este email.");
        return;
      }

      if (data.usernameExiste) {
        setErro("Este nome de utilizador já está em uso.");
        return;
      }

      setErro("");
      onAdicionar({ nome, username, email, telefone, password });

    } catch (err) {
      console.error(err);
      setErro("Erro ao verificar dados: " + err.message);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>➕ Novo Funcionário</h3>
        <button onClick={onClose} className={styles.closeButton}>✖</button>

        {erro && <p className={styles.erro}>{erro}</p>}

        <div className={styles.formulario}>
          <input
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
          <input
            type="password"
            placeholder="Palavra-passe"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <input
            type="password"
            placeholder="Confirmar palavra-passe"
            value={formData.confirmar}
            onChange={(e) => setFormData({ ...formData, confirmar: e.target.value })}
          />
        </div>

        <div className={styles.modalBotoes}>
          <button className={styles.btnCancelar} onClick={onClose}>Cancelar</button>
          <button className={styles.btnConfirmar} onClick={handleSubmit}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
