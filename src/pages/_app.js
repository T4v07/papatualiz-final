import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/global.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "compraConfirmada" && event.newValue === "true") {
        router.push("/encomenda");
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
