import React from "react";
import styles from "../styles/RectangleBox.module.css";

const RectangleBox = () => {
  const categories = [
    {
      category: "Running Deals!",
      description: "Descobre as melhores promoções em artigos de corrida.",
      buttonText: "Ver oferta",
      products: [
        { name: "Tênis de Corrida", imageUrl: "caminho/para/tenis.jpg" },
        { name: "Meias esportivas", imageUrl: "caminho/para/meias.jpg" },
        { name: "Calção esportivo", imageUrl: "caminho/para/calcao.jpg" },
        { name: "Camiseta", imageUrl: "caminho/para/camiseta.jpg" },
        { name: "Suporte para celular", imageUrl: "caminho/para/suporte.jpg" },
        { name: "Garrafa térmica", imageUrl: "caminho/para/garrafa.jpg" },
      ],
      isLeft: true,
      categoryImageUrl: "caminho/para/categoria-running.jpg", // Imagem da categoria
    },
    {
      category: "Cycling Deals!",
      description: "Descobre as melhores promoções nas bicicletas.",
      buttonText: "Ver oferta",
      products: [
        { name: "Capacete", imageUrl: "caminho/para/capacete.jpg" },
        { name: "Luvas para ciclismo", imageUrl: "caminho/para/luvas.jpg" },
        { name: "Bicicleta", imageUrl: "caminho/para/bicicleta.jpg" },
        { name: "Óculos de proteção", imageUrl: "caminho/para/oculos.jpg" },
        { name: "Cadeado para bike", imageUrl: "caminho/para/cadeado.jpg" },
        { name: "Mochila de hidratação", imageUrl: "caminho/para/mochila.jpg" },
      ],
      isLeft: false,
      categoryImageUrl: "caminho/para/categoria-cycling.jpg", // Imagem da categoria
    },
    {
      category: "Mountain Deals!",
      description: "Descobre as melhores promoções em artigos de montanha.",
      buttonText: "Ver oferta",
      products: [
        { name: "Botas de montanha", imageUrl: "caminho/para/botas.jpg" },
        { name: "Jaqueta impermeável", imageUrl: "caminho/para/jaqueta.jpg" },
        { name: "Bastões de caminhada", imageUrl: "caminho/para/bastoes.jpg" },
        { name: "Lanterna LED", imageUrl: "caminho/para/lanterna.jpg" },
        { name: "Kit primeiros socorros", imageUrl: "caminho/para/kit.jpg" },
        { name: "Mapa topográfico", imageUrl: "caminho/para/mapa.jpg" },
      ],
      isLeft: true,
      categoryImageUrl: "caminho/para/categoria-mountain.jpg", // Imagem da categoria
    },
    {
      category: "Camping Deals!",
      description: "Descobre as melhores promoções em artigos de acampamento.",
      buttonText: "Ver oferta",
      products: [
        { name: "Barraca", imageUrl: "caminho/para/barraca.jpg" },
        { name: "Saco de dormir", imageUrl: "caminho/para/saco.jpg" },
        { name: "Fogareiro portátil", imageUrl: "caminho/para/fogareiro.jpg" },
        { name: "Isolante térmico", imageUrl: "caminho/para/isolante.jpg" },
        { name: "Lanterna de cabeça", imageUrl: "caminho/para/lanterna-cabeca.jpg" },
        { name: "Cadeira dobrável", imageUrl: "caminho/para/cadeira.jpg" },
      ],
      isLeft: false,
      categoryImageUrl: "caminho/para/categoria-camping.jpg", // Imagem da categoria
    },
  ];

  return (
    <div className={styles.container}>
      {categories.map((category, index) => (
        <div key={index} className={`${styles.section} ${category.isLeft ? styles.left : styles.right}`}>
          {/* Retângulo grande */}
          <div
            className={styles.largeRectangle}
            style={{ backgroundImage: `url('${category.categoryImageUrl}')` }} // Imagem da categoria
          >
            <div className={styles.textContainer}>
              <h2>{category.category}</h2>
              <p>{category.description}</p>
              <button>{category.buttonText}</button>
            </div>
          </div>

          {/* Grid de produtos */}
          <div className={styles.productsGrid}>
            {category.products.map((product, idx) => (
              <div key={idx} className={styles.productCard}>
                <div
                  className={styles.productImage}
                  style={{ backgroundImage: `url('${product.imageUrl}')` }} // Imagem do produto
                ></div>
                <p>{product.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RectangleBox;