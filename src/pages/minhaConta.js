import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/navbar";
import SidebarConta from "../components/SidebarConta";
import styles from "../styles/minhaConta.module.css";

const MinhaConta = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    id: "", nome: "", email: "", telefone: "", endereco: "",
    dataNascimento: "", senhaAtual: "", novaSenha: ""
  });
  const [notificacao, setNotificacao] = useState({ tipo: "", mensagem: "" });

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/getUser?email=${user?.Email}`);
        const data = await response.json();
        if (response.ok) {
          setFormData({
            id: data.ID_utilizador,
            nome: data.Nome,
            email: data.Email,
            telefone: data.Telefone || "",
            endereco: data.Endereco || "",
            dataNascimento: data.DataNascimento?.split("T")[0] || "",
            senhaAtual: "", novaSenha: ""
          });
        } else {
          setNotificacao({ tipo: "erro", mensagem: data.message });
        }
      } catch {
        setNotificacao({ tipo: "erro", mensagem: "Erro ao carregar os dados." });
      }
    };
    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!formData.nome || !formData.email) {
      setNotificacao({ tipo: "erro", mensagem: "Nome e Email são obrigatórios." });
      return;
    }
    try {
      const response = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        login({ ...user, Nome: formData.nome, Email: formData.email });
        setNotificacao({ tipo: "sucesso", mensagem: "Dados atualizados com sucesso!" });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setNotificacao({ tipo: "erro", mensagem: data.message });
      }
    } catch {
      setNotificacao({ tipo: "erro", mensagem: "Erro ao atualizar os dados." });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      {notificacao.mensagem && (
        <div className={`${styles.notificacao} ${styles[notificacao.tipo]}`}>
          <span>{notificacao.tipo === "sucesso" ? "✅" : "❌"} {notificacao.mensagem}</span>
          <button onClick={() => setNotificacao({ tipo: "", mensagem: "" })}>✖</button>
        </div>
      )}
      <div className={styles.accountContainer}>
        <SidebarConta active="conta" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Gerir a minha conta</h2>
            <p>Edite suas informações pessoais aqui.</p>
            <form className={styles.form}>
              <label>Nome:</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} />
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              <label>Telefone:</label>
              <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} />
              <label>Morada:</label>
              <input type="text" name="endereco" value={formData.endereco} onChange={handleInputChange} />
              <label>Data de Nascimento:</label>
              <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} />
              <label>Palavra-passe Atual:</label>
              <input type="password" name="senhaAtual" value={formData.senhaAtual} onChange={handleInputChange} />
              <label>Nova Palavra-passe:</label>
              <input type="password" name="novaSenha" value={formData.novaSenha} onChange={handleInputChange} />
              <div className={styles.buttonGroup}>
                <button type="button" className={styles.saveButton} onClick={handleSaveChanges}>Salvar Alterações</button>
                <button type="button" className={styles.cancelButton} onClick={() => window.location.reload()}>Cancelar</button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MinhaConta;
