import { useState, useEffect } from "react";
import styles from "@/styles/gestaoAdminUtilizadores.module.css";

export default function ModalUtilizadores({ utilizador, onClose, onSave, userLogadoID }) {
  const [tipoConta, setTipoConta] = useState(utilizador.Tipo_de_Conta || "");
  const [ativo, setAtivo] = useState(utilizador.ativo);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    setTipoConta(utilizador.Tipo_de_Conta || "");
    setAtivo(utilizador.ativo);
    setErro(null);
    setSalvando(false);
  }, [utilizador]);

  const isUserLogado = utilizador.ID_utilizador === userLogadoID;

  const handleSalvar = async () => {
    setErro(null);
    setSalvando(true);
    try {
      // Atualizar tipoConta
      if (tipoConta !== utilizador.Tipo_de_Conta) {
        const res = await fetch("/api/admin/utilizadores", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: utilizador.ID_utilizador,
            campo: "Tipo_de_Conta",
            valor: tipoConta,
          }),
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.message || "Erro ao atualizar Tipo_de_Conta");
        }
      }

      // Atualizar ativo
      if (ativo !== utilizador.ativo) {
        const res = await fetch("/api/admin/utilizadores", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: utilizador.ID_utilizador,
            campo: "ativo",
            valor: ativo,
          }),
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.message || "Erro ao atualizar ativo");
        }
      }

      onSave(); // Recarregar lista
      onClose();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const mudouAlgo = tipoConta !== utilizador.Tipo_de_Conta || ativo !== utilizador.ativo;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Editar Utilizador</h3>

        <p>
          <strong>Nome:</strong> {utilizador.Nome}
        </p>
        <p>
          <strong>Email:</strong> {utilizador.Email}
        </p>

        <label>
          Tipo de Conta:
          <select
            value={tipoConta}
            onChange={(e) => setTipoConta(e.target.value)}
            disabled={salvando || isUserLogado}
          >
            <option value="cliente">Cliente</option>
            <option value="funcionario">Funcionário</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <label>
          Ativo:
          <select
            value={ativo}
            onChange={(e) => setAtivo(Number(e.target.value))}
            disabled={salvando || isUserLogado}
          >
            <option value={1}>Ativo ✅</option>
            <option value={0}>Inativo ❌</option>
          </select>
        </label>

        {erro && <p className={styles.erro}>{erro}</p>}

        <div className={styles.botoes}>
          <button onClick={onClose} disabled={salvando}>
            Cancelar
          </button>

          {!isUserLogado && (
            <button onClick={handleSalvar} disabled={salvando || !mudouAlgo}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          )}

          {isUserLogado && <p>Não pode alterar a sua própria conta.</p>}
        </div>
      </div>
    </div>
  );
}
