// pages/home.js
import Navbar from "../components/navbar";
import RectangleBox from "../components/RectangleBox";
import FeaturedProducts from "../components/FeaturedProducts";
import Slides from "../components/Slides";
import styles from "../styles/home.module.css";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className={styles.container}>
        {/* Topo: Bloco principal e laterais */}
        <div className={styles.topSection}>
          {/* Retângulo principal com destaque */}
          <div
            className={styles.bigRectangle}
            style={{
              backgroundImage:
                "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url('https://res.cloudinary.com/dk56q7rsl/image/upload/v1750234613/verao1_ni9box.jpg')",
            }}
          >
            <div>
              <h2 style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}>
                O Verão está à porta... <br /> Não fiques de fora!
              </h2>
              <Link href="/pesquisa?q=especial" passHref>
                <button className={styles.offerBtn}>Ver Ofertas</button>
              </Link>
            </div>
          </div>

          {/* Laterais */}
          <div className={styles.rightSide}>
            <div
              className={styles.smallRectangle}
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url('https://res.cloudinary.com/dk56q7rsl/image/upload/v1750239263/verao2_ip2scz.jpg')",
              }}
            >
              <div>
                <h5 style={{ fontSize: "16px", textShadow: "0 1px 2px black" }}>
                  Piscinas para Todos
                </h5>
                <Link href="/pesquisa?q=piscinas" passHref>
                  <button className={styles.offerBtn}>Explorar</button>
                </Link>
              </div>
            </div>

            <div
              className={styles.smallRectangle}
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url('https://res.cloudinary.com/dk56q7rsl/image/upload/v1750239267/verao3_daf20t.jpg')",
              }}
            >
              <div>
                <h5 style={{ fontSize: "16px", textShadow: "0 1px 2px black" }}>
                  Snorkeling e Aventura
                </h5>
                <Link href="/pesquisa?q=snorkeling" passHref>
                  <button className={styles.offerBtn}>Ver Mais</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Produtos em destaque */}
        <h2 className={styles.title}>Os mais procurados!</h2>
        <div className={styles.cardsContainer}>
          {[
            {
              nome: "Roupa de Verão",
              imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259179/roupa-verao_pew3jm.jpg",
              termo: "verao",
              alt: "Imagem de roupa de verão na praia",
            },
            {
              nome: "Ténis de Corrida",
              imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259184/tenis-corrida_kdgomf.jpg",
              termo: "corrida",
              alt: "Imagem de ténis de corrida",
            },
            {
              nome: "Acessórios Fitness",
              imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750262732/acessorios-fitness_ylr5hz.jpg",
              termo: "fitness",
              alt: "Imagem de acessórios de fitness",
            },
            {
              nome: "Ciclismo",
              imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259424/ciclismo_fdtluw.jpg",
              termo: "ciclismo",
              alt: "Pessoa a andar de bicicleta",
            },
            {
              nome: "Treino em Casa",
              imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750262734/treino-casa_isrvit.jpg",
              termo: "treino em casa",
              alt: "Imagem com halteres e garrafa de água",
            },
            {
              nome: "Aventura e Camping",
              imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259175/aventura-camping_hng85i.jpg",
              termo: "campismo",
              alt: "Tenda de campismo numa paisagem de montanha",
            },
          ].map((item, index) => (
            <Link key={index} href={`/pesquisa?q=${encodeURIComponent(item.termo)}`} passHref>
              <div className={styles.card}>
                <img
                  src={item.imagem}
                  alt={item.alt}
                  className={styles.cardImage}
                />
                <p className={styles.cardText}>{item.nome}</p>
              </div>
            </Link>
          ))}
        </div>

        
        <Slides />
        <div className={styles.spacing}></div>
        <RectangleBox />
        <div className={styles.spacing}></div>
        <FeaturedProducts />
      </div>

      {/* Footer fora da .container para evitar bordas brancas */}
      <Footer />
    </>
  );
}
