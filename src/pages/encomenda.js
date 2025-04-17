import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/encomenda.module.css";
import Navbar from "@/components/navbar";

export default function EncomendaPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    rua: "",
    numero: "",
    codigoPostal: "",
    cidade: "",
    pais: "",
    notas: "",
  });
  const [autorizado, setAutorizado] = useState(null); // null = loading, true = ok, false = bloqueado

  useEffect(() => {
    try {
      const cookies = document.cookie.split(";").map(c => c.trim());
      const confirmed = cookies.find(c => c.startsWith("compra_confirmada="));
      const isValido = confirmed?.split("=")[1] === "true";
      setAutorizado(isValido);
      if (!isValido) {
        setTimeout(() => router.push("/"), 3000); // redireciona após 3s
      }
    } catch (err) {
      console.error("Erro ao verificar cookie:", err);
      setAutorizado(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const endereco = `${form.rua}, Nº ${form.numero}, ${form.codigoPostal} - ${form.cidade}, ${form.pais}`;
    const res = await fetch("/api/encomenda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endereco_entrega: endereco,
        notas: form.notas,
        rua: form.rua,
        numero: form.numero,
        codigoPostal: form.codigoPostal,
        cidade: form.cidade,
        pais: form.pais
      }),
    });

    if (res.ok) {
      document.cookie = "compra_confirmada=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem("compraConfirmada");
      router.push("/sucesso");
    } else {
      alert("Erro ao salvar encomenda.");
    }
  };

  if (autorizado === null) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>🔄 A verificar autorização...</p>;
  }

  if (autorizado === false) {
    return (
      <p style={{ textAlign: "center", marginTop: 50, color: "red" }}>
        ⚠ Não tens permissão para aceder a esta página.<br />
        Serás redirecionado em instantes...
      </p>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.titulo}>Informações de Envio</h2>
        <div className={styles.formulario}>
          {["rua", "numero", "codigoPostal", "cidade", "pais"].map((campo) => (
            <div key={campo} className={styles.grupo}>
              <label className={styles.rotulo}>
                {campo === "codigoPostal" ? "Código Postal" : campo.charAt(0).toUpperCase() + campo.slice(1)}:
              </label>
              <input name={campo} className={styles.campo} value={form[campo]} onChange={handleChange} />
            </div>
          ))}
          <div className={styles.grupo}>
            <label className={styles.rotulo}>Notas Adicionais:</label>
            <textarea
              name="notas"
              className={styles.campo}
              value={form.notas}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <button className={styles.btnSubmeter} onClick={handleSubmit}>
            Finalizar Encomenda
          </button>
        </div>
      </div>
    </>
  );
}
