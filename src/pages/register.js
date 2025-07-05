// pages/register.js
import { useState } from "react";
import { User, Lock, Mail, Phone, UserRound, Eye, EyeOff, ArrowLeft } from "lucide-react";
import styles from "../styles/auth.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nome: "",
    email: "",
    telefone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username é obrigatório.";
    else if (formData.username.includes(" ")) newErrors.username = "Sem espaços no username.";
    else if (formData.username.length < 3) newErrors.username = "Mínimo 3 caracteres.";

    if (!formData.password) newErrors.password = "Senha obrigatória.";
    else if (formData.password.length < 6) newErrors.password = "Mínimo 6 caracteres.";
    else if (!/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) newErrors.password = "Inclua letras e números.";

    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Senhas não coincidem.";

    if (!formData.nome.trim()) newErrors.nome = "Nome obrigatório.";
    else if (!/^[A-Za-zÀ-ÿ\s]+$/.test(formData.nome)) newErrors.nome = "Nome inválido.";

    if (!formData.email.includes("@")) newErrors.email = "Email inválido.";

    if (!/^\d{9}$/.test(formData.telefone)) newErrors.telefone = "Telefone deve ter 9 dígitos.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("✅ Código enviado para o e-mail!");
        setTimeout(() => {
          router.push(`/verifcemail?email=${formData.email}`);
        }, 1800);
      } else {
        toast.error(data.message || "Erro ao registrar.");
      }
    } catch {
      toast.error("Erro no servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.splitContainer}>
        <div
          className={styles.imageSide}
          style={{
            backgroundImage: 'url("https://res.cloudinary.com/dk56q7rsl/image/upload/v1750469380/login-banner2_urs36o.jpg")',
          }}
        >
          <Link href="/" className={styles.backOverlay}>
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>

        <div className={styles.formSide}>
          <div className={styles.authCard}>
            <h2 className={styles.title}>Criar conta</h2>
            <p className={styles.subtitle}>Preencha os campos abaixo</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* USERNAME */}
              <div className={styles.inputGroup}>
                <span className={styles.icon}><User size={18} /></span>
                <input type="text" name="username" placeholder="nome de utilizador" onChange={handleChange} />
              </div>
              {errors.username && <div className={styles.error}>{errors.username}</div>}

              {/* PASSWORD */}
              <div className={styles.inputGroup}>
                <span className={styles.icon}><Lock size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="palavra-passe"
                  onChange={handleChange}
                />
                <span className={styles.toggleIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {errors.password && <div className={styles.error}>{errors.password}</div>}

              {/* CONFIRMAR SENHA */}
              <div className={styles.inputGroup}>
                <span className={styles.icon}><Lock size={18} /></span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmar palavra-passe"
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}

              {/* NOME */}
              <div className={styles.inputGroup}>
                <span className={styles.icon}><UserRound size={18} /></span>
                <input type="text" name="nome" placeholder="Nome Completo" onChange={handleChange} />
              </div>
              {errors.nome && <div className={styles.error}>{errors.nome}</div>}

              {/* EMAIL */}
              <div className={styles.inputGroup}>
                <span className={styles.icon}><Mail size={18} /></span>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} />
              </div>
              {errors.email && <div className={styles.error}>{errors.email}</div>}

              {/* TELEFONE */}
              <div className={styles.inputGroup}>
                <span className={styles.icon}><Phone size={18} /></span>
                <input type="text" name="telefone" placeholder="Telefone (9 dígitos)" onChange={handleChange} />
              </div>
              {errors.telefone && <div className={styles.error}>{errors.telefone}</div>}

              {/* BOTÃO */}
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "Aguarde..." : "REGISTRAR"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
