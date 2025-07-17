import React from "react";
import styles from "../styles/FeaturedProducts.module.css";
import Link from "next/link";

const categories = [
  {
    title: "Treino em Casa",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444399/Treino_em_Casa_wltbdt.jpg",
    links: [
      { label: "Halteres & Pesos", query: "halteres pesos" },
      { label: "Bandas Elásticas", query: "bandas elasticas" },
      { label: "Tapetes de Yoga", query: "tapete yoga" },
    ],
  },
  {
    title: "Dias de chuva",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444440/Dias_de_chuva_m9gn46.jpg",
    links: [
      { label: "Impermeáveis", query: "impermeavel" },
      { label: "Galochas", query: "galochas" },
      { label: "Casacos corta-vento", query: "casaco corta vento" },
    ],
  },
  {
    title: "Calçados",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444442/Cal%C3%A7ados_vgzodq.jpg",
    links: [
      { label: "Botas de Caminhada", query: "botas " },
      { label: "Sapatos de Treino", query: " treino" },
      { label: "Sapatilhas Casuais", query: "sapatilhas " },
    ],
  },
  {
    title: "Acessórios",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444434/Acess%C3%B3rios_enwbir.jpg",
    links: [
      { label: "Relógios Desportivos", query: "relogio desportivo" },
      { label: "Luvas e Bonés", query: "luvas bones" },
      { label: "Garrafas Térmicas", query: "garrafa termica" },
    ],
  },
  {
    title: "Running",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444441/Running_uuz8ug.jpg",
    links: [
      { label: "Sapatilhas de Corrida", query: "tenis corrida" },
      { label: "Roupas de Corrida", query: "roupa corrida" },
      { label: "Meias de Compressão", query: "meias " },
    ],
  },
  {
    title: "Montanhismo",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444657/Montanhismo_aovxqu.jpg",
    links: [
      { label: "Mochilas de Caminhada", query: "mochila" },
      { label: "Bastões de Caminhada", query: " caminhada" },
      { label: "Calças de Trekking", query: "calcas " },
    ],
  },
  {
    title: "Ciclismo",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444431/Ciclismo_2_s7wiwt.jpg",
    links: [
      { label: "Bicicletas BTT", query: "bicicleta " },
      { label: "Capacetes", query: "capacete " },
      { label: "Óculos de Ciclismo", query: "oculos " },
    ],
  },
  {
    title: "Desportos Coletivos",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444429/Desportos_Coletivos_musgio.jpg",
    links: [
      { label: "Equipamento de Futebol", query: "futebol" },
      { label: "Roupa Térmica", query: "termica" },
      { label: "Chuteiras & Bolas", query: "chuteira bola" },
    ],
  },
];

const FeaturedProducts = () => {
  return (
    <div className={styles.featuredProducts}>
      <h1 className={styles.destaque}>Categorias Populares</h1>
      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <div key={index} className={styles.category}>
            <h2>{category.title}</h2>
            <div className={styles.content}>
              <img
                src={category.imageUrl}
                alt={category.title}
                className={styles.categoryImage}
              />
              <ul>
                {category.links.map((link, idx) => (
                  <li key={idx}>
                    <Link href={`/pesquisa?q=${encodeURIComponent(link.query)}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
