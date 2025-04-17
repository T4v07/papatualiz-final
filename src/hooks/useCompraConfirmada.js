import { useEffect } from "react";
import { useRouter } from "next/router";

export default function useCompraConfirmada() {
  const router = useRouter();

  useEffect(() => {
    const checkConfirmacao = () => {
      const cookies = document.cookie.split(";").map(c => c.trim());
      const confirmed = cookies.find(c => c.startsWith("compra_confirmada="));
      const isValido = confirmed?.split("=")[1] === "true";

      if (!isValido) {
        alert("Precisas confirmar a compra antes de preencher a morada.");
        router.push("/");
      }
    };

    checkConfirmacao();

    const handleStorage = (e) => {
      if (e.key === "compraConfirmada" && e.newValue === "true") {
        router.push("/encomenda");
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
}
