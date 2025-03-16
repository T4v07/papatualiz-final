import { AuthProvider } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";  // Importa o Bootstrap
import "../styles/global.css";
import Head from "next/head";
import "../styles/FeaturedProducts.module.css";


function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>My Project</title>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
