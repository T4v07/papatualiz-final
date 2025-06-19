// components/Carousel.js
import { useState, useEffect } from "react";
import styles from "../styles/Carousel.module.css";
import Link from "next/link";

const slides = [
  {
    titulo: "Novidades de Corrida",
    texto: "Descobre as nossas novidades e dá ritmo às tuas corridas!",
    imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259184/tenis-corrida_kdgomf.jpg",
    botao: "Ver produtos",
    link: "/pesquisa?q=corrida",
  },
  {
    titulo: "Explora a Natureza",
    texto: "Encontra o equipamento ideal para as tuas aventuras.",
    imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259175/aventura-camping_hng85i.jpg",
    botao: "Descobrir",
    link: "/pesquisa?q=campismo",
  },
  {
    titulo: "Estilo e Conforto",
    texto: "Veste os melhores casacos desportivos da nova coleção.",
    imagem: "/imagens/casaco.jpg",
    botao: "Ver casacos",
    link: "/pesquisa?q=casaco",
  },
  {
    titulo: "Acessórios Essenciais",
    texto: "Completa o teu look com acessórios funcionais e estilosos.",
    imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750262732/acessorios-fitness_ylr5hz.jpg",
    botao: "Ver acessórios",
    link: "/pesquisa?q=acessorios",
  },
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  const anterior = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const proximo = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className={styles.carouselContainer}>
      <h2 className="mb-4">Em destaque:</h2>
      <div className={styles.carousel}>
        <button className={styles.seta} onClick={anterior}>‹</button>

        <div className={styles.slide}>
          <div className={styles.texto}>
            <h3>{slides[index].titulo}</h3>
            <p>{slides[index].texto}</p>
            <Link href={slides[index].link}>
              <button className="btn btn-outline-dark">{slides[index].botao}</button>
            </Link>
          </div>
          <div
            className={styles.imagem}
            style={{
              backgroundImage: `url('${slides[index].imagem}')`,
            }}
          />
        </div>

        <button className={styles.seta} onClick={proximo}>›</button>
      </div>

      <div className={styles.pontos}>
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === index ? styles.ativo : ""}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
