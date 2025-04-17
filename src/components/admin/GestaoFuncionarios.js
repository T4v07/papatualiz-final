import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css";

export default function GestaoFuncionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    username: "",
    email: "",
    telefone: "",
    password: "",
  });

  useEffect(() => {
    fetch("/api/admin/funcionarios")
      .then((res) => res.json())
      .then((data) => setFuncionarios(data));
  }, []);

  const adicionarFuncionario = async () => {
    const res = await fetch("/api/admin/funcionarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoFuncionario),
    });

    if (res.ok) {
      const novo = await res.json();
      setFuncionarios((prev) => [...prev, novo]);
      setMostrarFormulario(false);
      setNovoFuncionario({
        nome: "",
        username: "",
        email: "",
        telefone: "",
        password: "",
      });
    } else {
      alert("Erro ao adicionar funcionário.");
    }
  };

  return (
    <div className={styles.pagina}>
      <h2 className={styles.titulo}>👨‍💼 Gestão de Funcionários</h2>

      <button className={styles.botaoPrincipal} onClick={() => setMostrarFormulario(true)}>
        ➕ Adicionar Novo Funcionário
      </button>

      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Username</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ativo</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((f) => (
            <tr key={f.ID_utilizador}>
              <td>{f.Nome}</td>
              <td>{f.Username}</td>
              <td>{f.Email}</td>
              <td>{f.Telefone}</td>
              <td>{f.Ativo ? "✅" : "❌"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarFormulario && (
        <div className={styles.formContainer}>
          <div className={styles.formTitle}>Adicionar Funcionário</div>
          <div className={styles.formRow}>
            <input
              type="text"
              placeholder="Nome"
              value={novoFuncionario.nome}
              onChange={(e) =>
                setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Username"
              value={novoFuncionario.username}
              onChange={(e) =>
                setNovoFuncionario({ ...novoFuncionario, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={novoFuncionario.email}
              onChange={(e) =>
                setNovoFuncionario({ ...novoFuncionario, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Telefone"
              value={novoFuncionario.telefone}
              onChange={(e) =>
                setNovoFuncionario({ ...novoFuncionario, telefone: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Senha"
              value={novoFuncionario.password}
              onChange={(e) =>
                setNovoFuncionario({ ...novoFuncionario, password: e.target.value })
              }
            />
          </div>

          <button className={styles.botaoAcao} onClick={adicionarFuncionario}>
            Adicionar
          </button>
          <button
            className={`${styles.botaoAcao} ${styles.botaoCancelar}`}
            onClick={() => setMostrarFormulario(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
