import { useState } from "react";
import styles from "../styles/ModalPassword.module.css";
import { Eye, EyeOff } from "lucide-react";

export default function ModalAlterarPassword({ userId, fecharModal, setNotificacao }) {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState({
    atual: false,
    nova: false,
    confirmar: false,
  });

  const validarSenha = (senha) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(senha);

  const calcularForcaSenha = (senha) => {
    let forca = 0;
    if (senha.length >= 8) forca += 1;
    if (/[A-Z]/.test(senha)) forca += 1;
    if (/\d/.test(senha)) forca += 1;
    if (/[^A-Za-z0-9]/.test(senha)) forca += 1;
    return forca;
  };

  const handleAlterar = async () => {
    setErro("");

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      return setErro("Preencha todos os campos.");
    }

    if (novaSenha !== confirmarSenha) {
      return setErro("A nova palavra-passe não coincide com a confirmação.");
    }

    if (!validarSenha(novaSenha)) {
      return setErro("A nova palavra-passe deve ter pelo menos 8 caracteres, 1 número e 1 maiúscula.");
    }

    try {
      const res = await fetch("/api/alterarPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, senhaAtual, novaSenha }),
      });

      const data = await res.json();

      if (!res.ok) return setErro(data.message || "Erro ao alterar palavra-passe.");

      setNotificacao({ tipo: "sucesso", mensagem: data.message });
      fecharModal();
    } catch (err) {
      setErro("Erro de servidor. Tente novamente.");
    }
  };

  const forca = calcularForcaSenha(novaSenha);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>🔒 Alterar Palavra-passe</h3>
        <button className={styles.closeButton} onClick={fecharModal}>✖</button>

        {erro && <p className={styles.erro}>{erro}</p>}

        {/* Campo Senha Atual */}
        <div className={styles.inputGroup}>
          <label>Palavra-passe Atual</label>
          <div className={styles.passwordWrapper}>
            <input
              type={mostrarSenha.atual ? "text" : "password"}
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="••••••••"
            />
            <button type="button" onClick={() =>
              setMostrarSenha(prev => ({ ...prev, atual: !prev.atual }))
            }>
              {mostrarSenha.atual ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Nova Senha */}
        <div className={styles.inputGroup}>
          <label>Nova Palavra-passe</label>
          <div className={styles.passwordWrapper}>
            <input
              type={mostrarSenha.nova ? "text" : "password"}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mín. 8 caracteres, 1 número, 1 maiúscula"
            />
            <button type="button" onClick={() =>
              setMostrarSenha(prev => ({ ...prev, nova: !prev.nova }))
            }>
              {mostrarSenha.nova ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {novaSenha && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthBar} data-strength={forca} />
              <span className={styles.strengthText}>
                {["Fraca", "Média", "Boa", "Forte"][forca - 1] || ""}
              </span>
            </div>
          )}
        </div>

        {/* Confirmar Senha */}
        <div className={styles.inputGroup}>
          <label>Confirmar Nova Palavra-passe</label>
          <div className={styles.passwordWrapper}>
            <input
              type={mostrarSenha.confirmar ? "text" : "password"}
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Repetir nova palavra-passe"
            />
            <button type="button" onClick={() =>
              setMostrarSenha(prev => ({ ...prev, confirmar: !prev.confirmar }))
            }>
              {mostrarSenha.confirmar ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.botoes}>
          <button className={styles.btnCancelar} onClick={fecharModal}>Cancelar</button>
          <button className={styles.btnConfirmar} onClick={handleAlterar}>Alterar</button>
        </div>
      </div>
    </div>
  );
}
