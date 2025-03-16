import React from "react";
import styles from "../styles/FeaturedProducts.module.css";

const FeaturedProducts = () => {
  const categories = [
    {
      title: "Treino em Casa",
      links: ["Halteres & Pesos", "Bandas Elásticas", "Tapetes de Yoga"],
    },
    {
      title: "Dias de chuva",
      links: ["Impermeáveis", "Galochas", "Casacos corta-vento"],
    },
    {
      title: "Calçados",
      links: ["Botas de Caminhada", "Sapatos de Treino", "Sapatilhas Casuais"],
    },
    {
      title: "Acessórios",
      links: ["Relógios Desportivos", "Luvas e Bonés", "Garrafas Térmicas"],
    },
    {
      title: "Running",
      links: ["Sapatilhas de Corrida", "Roupas de Corrida", "Meias de Compressão"],
    },
    {
      title: "Montanhismo",
      links: ["Mochilas de Caminhada", "Bastões de Caminhada", "Calças de Trekking"],
    },
    {
      title: "Ciclismo",
      links: ["Bicicletas BTT", "Capacetes", "Óculos de Ciclismo"],
    },
    {
      title: "Desportos Coletivos",
      links: ["Equipamento de Futebol", "Roupa Térmica", "Chuteiras & Bolas"],
    },
  ];

  return (
    <div className={styles.featuredProducts}>
      <h1 className={styles.destaque}>Categorias Populares</h1>
      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <div key={index} className={styles.category}>
            <h2>{category.title}</h2>
            <div className={styles.content}>
              <div className={styles.retanguloPreto}></div> {/* Retângulo Preto */}
              <ul>
                {category.links.map((link, idx) => (
                  <li key={idx}>
                    <a href="#">{link}</a>
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
