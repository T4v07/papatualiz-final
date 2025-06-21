import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar"; // IMPORTAR A NAVBAR

import styles from "../styles/verifcemail.module.css";

export default function Verifcemail() {
  const router = useRouter();
  const { email: emailQuery } = router.query;

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");

  useEffect(() => {
    if (emailQuery) setEmail(emailQuery);
  }, [emailQuery]);

  const handleVerificar = () => {
    console.log("Verificando com código:", codigo);
  };

  const handleReenviar = () => {
    console.log("Reenviando código para:", email);
  };

  return (
    <>
      <Navbar /> {/* ADICIONA A NAVBAR AQUI */}

      <div className={styles.container}>
        <div className={styles.imageSide}></div>

        <div className={styles.formSide}>
          <div className={styles.formBox}>
            <h2>Verificar E-mail</h2>

            <input
              type="email"
              className={styles.input}
              value={email}
              readOnly
            />

            <input
              type="text"
              className={styles.input}
              placeholder="Código de Verificação"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />

            <button className={styles.button} onClick={handleVerificar}>
              Verificar
            </button>

            <button className={styles.button} onClick={handleReenviar}>
              Reenviar Código
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
