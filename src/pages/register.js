// pages/register.js
import { useState } from "react";
import Navbar from "../components/navbar";
import styles from "../styles/auth.module.css";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nome: "",
    email: "",
    telefone: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Código enviado para o seu e-mail!");
        router.push(`/verifcemail?email=${formData.email}`); // Redireciona para a página de verificação
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erro ao registrar. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2 className={styles.title}>Registrar Conta</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Senha" onChange={handleChange} required />
            <input type="text" name="nome" placeholder="Nome Completo" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="telefone" placeholder="Telefone" onChange={handleChange} required />
            <button type="submit" className={styles.submitButton}>Registrar</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
