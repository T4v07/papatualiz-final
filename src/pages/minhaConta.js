import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/navbar";
import SidebarConta from "../components/SidebarConta";
import styles from "../styles/gerirConta.module.css";

const MinhaConta = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    username: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    senhaAtual: "",
    novaSenha: ""
  });
  const [infoExtra, setInfoExtra] = useState({
    tipoConta: "",
    verificado: 0,
    dataRegistro: "",
    ativo: 1
  });
  const [notificacao, setNotificacao] = useState({ tipo: "", mensagem: "" });
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);

  useEffect(() => {
    if (!user?.ID_utilizador) return;
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/getUser?id=${user.ID_utilizador}`);
        const data = await response.json();
        if (response.ok) {
          setFormData({
            id: data.ID_utilizador,
            nome: data.Nome,
            username: data.Username,
            email: data.Email,
            telefone: data.Telefone || "",
            dataNascimento: data.DataNascimento?.split("T")[0] || "",
            senhaAtual: "",
            novaSenha: ""
          });
          setInfoExtra({
            tipoConta: data.Tipo_de_Conta,
            verificado: data.Verificado,
            dataRegistro: data.DataRegistro || "",
            ativo: data.Ativo
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

  const validarSenha = (senha) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(senha);
  };

  const handleSaveChanges = async () => {
    if (!formData.nome || !formData.email || !formData.username) {
      return setNotificacao({ tipo: "erro", mensagem: "Nome, Username e Email são obrigatórios." });
    }

    if (formData.novaSenha && !validarSenha(formData.novaSenha)) {
      return setNotificacao({
        tipo: "erro",
        mensagem:
          "A nova palavra-passe deve ter pelo menos 8 caracteres, incluindo uma maiúscula e um número.",
      });
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

  const formatarData = (data) => {
    if (!data) return "";
    const d = new Date(data);
    if (isNaN(d)) return data;
    return d.toLocaleDateString("pt-PT");
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      {notificacao.mensagem && (
        <div className={`${styles.notificacao} ${styles[notificacao.tipo]}`}>
          <span>{notificacao.mensagem}</span>
          <button onClick={() => setNotificacao({ tipo: "", mensagem: "" })}>✖</button>
        </div>
      )}
      <div className={styles.accountContainer}>
        <SidebarConta active="conta" />
        <main className={styles.mainContent}>
          <section className={styles.section}>
            <h2>Gerir a minha conta</h2>

            <div className={styles.badges}>
              <span>
                <strong>Registado desde:</strong> {formatarData(infoExtra.dataRegistro)}
              </span>
            </div>

            <form className={styles.form} onSubmit={e => e.preventDefault()}>
              <div className={styles.formGroup}>
                <label>Nome:</label>
                <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} />
              </div>

              <div className={styles.formGroup}>
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
              </div>

              <div className={styles.formGroup}>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
              </div>

              <div className={styles.formGroup}>
                <label>Telefone:</label>
                <input type="text" name="telefone" value={formData.telefone} onChange={handleInputChange} />
              </div>

              <div className={styles.formGroup}>
                <label>Data de Nascimento:</label>
                <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleInputChange} />
              </div>

              <div className={styles.formGroup}>
                <label>Palavra-passe Atual:</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={mostrarSenhaAtual ? "text" : "password"}
                    name="senhaAtual"
                    value={formData.senhaAtual}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setMostrarSenhaAtual((prev) => !prev)}
                    aria-label={mostrarSenhaAtual ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {mostrarSenhaAtual ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Nova Palavra-passe:</label>
                <input
                  type="password"
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleInputChange}
                  placeholder="Mín. 8 caracteres, 1 número, 1 maiúscula"
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.buttonGroup}>
                <button type="button" className={styles.saveButton} onClick={handleSaveChanges}>
                  Salvar Alterações
                </button>
                <button type="button" className={styles.cancelButton} onClick={() => window.location.reload()}>
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default MinhaConta;
