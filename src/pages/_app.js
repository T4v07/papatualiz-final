import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import Swiper CSS globalmente
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import "@/styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "compraConfirmada" && event.newValue === "true") {
        router.push("/moradaenvio");
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
