import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "@/styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "compraConfirmada" && event.newValue === "true") {
        router.push("/moradaenvio"); // <- alterado para o nome correto da nova rota
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthProvider>
      <Head>
        <title>Sports ET</title>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
