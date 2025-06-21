// pages/register.js
import { useState } from "react";
import { User, Lock, Mail, Phone, UserRound, Eye, EyeOff } from "lucide-react";
import Navbar from "../components/navbar";
import styles from "../styles/auth.module.css";
import { useRouter } from "next/router";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nome: "",
    email: "",
    telefone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.nome || !formData.email || !formData.telefone) {
      setError("Preencha todos os campos.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Insira um email válido.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Código enviado para o seu e-mail!");
        router.push(`/verifcemail?email=${formData.email}`);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Erro ao registrar. Tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.splitContainer}>
        <div
          className={styles.imageSide}
          style={{
            backgroundImage: 'url("https://res.cloudinary.com/dk56q7rsl/image/upload/v1750469380/login-banner2_urs36o.jpg")',
          }}
        ></div>

        <div className={styles.formSide}>
          <div className={styles.authCard}>
            <h1 className={styles.brand}>SPORT’S ET</h1>
            <h2 className={styles.title}>Criar conta</h2>
            <p className={styles.subtitle}>Preencha os campos abaixo</p>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <span className={styles.icon}><User size={18} /></span>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.icon}><Lock size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Senha"
                  onChange={handleChange}
                  required
                />
                <span className={styles.toggleIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.icon}><UserRound size={18} /></span>
                <input type="text" name="nome" placeholder="Nome Completo" onChange={handleChange} required />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.icon}><Mail size={18} /></span>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
              </div>

              <div className={styles.inputGroup}>
                <span className={styles.icon}><Phone size={18} /></span>
                <input type="text" name="telefone" placeholder="Telefone" onChange={handleChange} required />
              </div>

              <button type="submit" className={styles.submitButton}>
                REGISTRAR
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
