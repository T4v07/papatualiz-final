import React from "react";
import styles from "../styles/FeaturedProducts.module.css";
import Link from "next/link";

const categories = [
  {
    title: "Treino em Casa",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444399/Treino_em_Casa_wltbdt.jpg",
    links: [
      "Halteres & Pesos",
      "Bandas Elásticas",
      "Tapetes de Yoga"
    ],
  },
  {
    title: "Dias de chuva",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444440/Dias_de_chuva_m9gn46.jpg",
    links: [
      "Impermeáveis",
      "Galochas",
      "Casacos corta-vento"
    ],
  },
  {
    title: "Calçados",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444442/Cal%C3%A7ados_vgzodq.jpg",
    links: [
      "Botas de Caminhada",
      "Sapatos de Treino",
      "Sapatilhas Casuais"
    ],
  },
  {
    title: "Acessórios",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444434/Acess%C3%B3rios_enwbir.jpg",
    links: [
      "Relógios Desportivos",
      "Luvas e Bonés",
      "Garrafas Térmicas"
    ],
  },
  {
    title: "Running",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444441/Running_uuz8ug.jpg",
    links: [
      "Sapatilhas de Corrida",
      "Roupas de Corrida",
      "Meias de Compressão"
    ],
  },
  {
    title: "Montanhismo",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444657/Montanhismo_aovxqu.jpg",
    links: [
      "Mochilas de Caminhada",
      "Bastões de Caminhada",
      "Calças de Trekking"
    ],
  },
  {
    title: "Ciclismo",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444431/Ciclismo_2_s7wiwt.jpg",
    links: [
      "Bicicletas BTT",
      "Capacetes",
      "Óculos de Ciclismo"
    ],
  },
  {
    title: "Desportos Coletivos",
    imageUrl: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750444429/Desportos_Coletivos_musgio.jpg",
    links: [
      "Equipamento de Futebol",
      "Roupa Térmica",
      "Chuteiras & Bolas"
    ],
  },
];

const gerarTermosPesquisa = (categoria, texto) => {
  const termos = [];

  // Separar por palavras-chave + normalização
  const palavras = texto
    .toLowerCase()
    .replace("&", "")
    .replace(/[^a-zA-Z0-9À-ÿ\s]/g, "") // remove pontuação
    .split(" ")
    .filter(Boolean);

  termos.push(...palavras);

  // Adiciona também a categoria em palavras separadas
  const cat = categoria
    .toLowerCase()
    .replace(/[^a-zA-Z0-9À-ÿ\s]/g, "")
    .split(" ")
    .filter(Boolean);

  termos.push(...cat);

  return termos.join("+");
};

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
                    <Link
                      href={`/pesquisa?termo=${gerarTermosPesquisa(
                        category.title,
                        link
                      )}`}
                    >
                      {link}
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
