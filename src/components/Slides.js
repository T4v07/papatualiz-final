import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Slides.module.css";

const slides = [
  {
    title: "Começa a Treinar Hoje",
    description:
      "Descobre tudo para começares o teu percurso fitness. Desde roupa desportiva até acessórios essenciais para treinos em casa ou no ginásio.",
    button: "Começar Agora",
    link: "/pesquisa?q=fitness",
    image:
      "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338230/slide-treinar-hoje_qx3onc.jpg",
  },
  {
    title: "Escapadinhas de Fim de Semana",
    description: "O descanso que mereces. Equipamento ideal para aventuras ao ar livre.",
    button: "Explorar",
    link: "/pesquisa?q=aventura",
    image:
      "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338224/slide-escapadinha_c9sjjq.jpg",
  },
  {
    title: "Férias Ativas",
    description:
      "Para quem não para nas férias. Roupa e acessórios para manteres o ritmo.",
    button: "Ver Equipamento",
    link: "/pesquisa?q=verao",
    image:
      "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338223/slide-ferias-ativas_annwib.jpg",
  },
  {
    title: "Relax Total",
    description: "Relaxa. A gente trata do resto.",
    button: "Ver Mais",
    link: "/pesquisa?q=relax",
    image:
      "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338223/slide-relax_bif2gb.jpg",
  },
  {
    title: "Kids em Movimento",
    description: "Roupa e acessórios para os mais novos se manterem ativos com conforto.",
    button: "Ver Infantil",
    link: "/pesquisa?q=infantil",
    image:
      "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750338472/slide-kids_agnyt2.jpg",
  },
];

export default function Slides() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={styles.carouselWrapper}>
      <h2 className={styles.sectionTitle}>Destaques do Verão</h2>
      <div
        className={styles.carousel}
        style={{ backgroundImage: `url(${slides[index].image})` }}
      >
        <div className={styles.overlay}>
          <h3>{slides[index].title}</h3>
          <p>{slides[index].description}</p>
          <Link href={slides[index].link}>
            <button>{slides[index].button}</button>
          </Link>
        </div>

        <button className={styles.prev} onClick={prevSlide}>
          ‹
        </button>
        <button className={styles.next} onClick={nextSlide}>
          ›
        </button>

        <div className={styles.dots}>
          {slides.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
