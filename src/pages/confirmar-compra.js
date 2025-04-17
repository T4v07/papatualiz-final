// /pages/confirmar-compra.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/ConfirmarCompra.module.css";

export default function ConfirmarCompraPage() {
  const router = useRouter();
  const { token } = router.query;
  const [estado, setEstado] = useState("validando");

  useEffect(() => {
    if (!token) return;

    const confirmar = async () => {
      try {
        const res = await fetch(`/api/confirmar-compra?token=${token}`);
        const data = await res.json();

        if (data.success) {
          localStorage.setItem("compraConfirmada", "true");
          setEstado("sucesso");

          // Redireciona após 3 segundos
          setTimeout(() => {
            router.push("/encomenda");
          }, 3000);
        } else {
          setEstado("erro");
        }
      } catch (err) {
        setEstado("erro");
      }
    };

    confirmar();
  }, [token]);

  return (
    <div className={styles.container}>
      {estado === "validando" && <p className={styles.aviso}>🔄 A confirmar a tua compra...</p>}
      {estado === "sucesso" && (
        <>
          <h2 className={styles.sucesso}>✅ Compra confirmada com sucesso!</h2>
          <p>Serás redirecionado para preencher a morada de envio.</p>
        </>
      )}
      {estado === "erro" && (
        <h2 className={styles.erro}>❌ Link inválido ou expirado.</h2>
      )}
    </div>
  );
}
