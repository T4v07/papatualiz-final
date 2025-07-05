import React from "react";
import Link from "next/link";
import styles from "../styles/RectangleBox.module.css";

const RectangleBox = () => {
  const categories = [
    {
      category: "Running Deals!",
      description: "Descobre as melhores promoções em artigos de corrida.",
      buttonText: "Ver mais",
      searchTerm: "corrida",
      categoryImageUrl:
        "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750422481/jakob-owens-A4579vLezz8-unsplash_lh7k4l.jpg",
      products: [
        {
          id: 26,
          name: "Tênis de Corrida Pro",
          brand: "VelociRun",
          priceOriginal: "89,99€",
          priceFinal: "75,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750413856/produtos/zom1ph3y83mqfo9akwpk.jpg",
        },
        {
          id: 31,
          name: "Calção Esportivo",
          brand: "Kalenji",
          priceFinal: "14,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750418860/produtos/assm1a76pim6zyktlwkd.jpg",
        },
        {
          id: 30,
          name: "Meias Esportivas",
          brand: "Domyos",
          priceFinal: "6,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750418641/produtos/ukn3aigdkb3l7znuri7h.jpg",
        },
        {
          id: 32,
          name: "Camiseta Técnica de Corrida",
          brand: "Kalenji",
          priceOriginal: "12,99€",
          priceFinal: "16,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750419073/produtos/sslcwkzby75agusnoxhs.jpg",
        },
        {
          id: 33,
          name: "Cinto de Hidratação",
          brand: "Kalenji",
          priceFinal: "19,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750419353/produtos/kvbzqto1p6efayixfaar.jpg",
        },
        {
          id: 34,
          name: "Garrafa Térmica Esportiva",
          brand: "Aptonia",
          priceOriginal: "22,90€",
          priceFinal: "14,90€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750419838/produtos/l6khojsvlzlenjuc25zl.jpg",
        },
      ],
      isLeft: true,
    },
    {
      category: "Cycling Deals!",
      description: "Descobre as melhores promoções nas bicicletas.",
      buttonText: "Ver mais",
      searchTerm: "ciclismo",
      categoryImageUrl:
        "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750422477/benson-low-p4vpkXBpxBA-unsplash_zxjlk0.jpg",
      products: [
        {
          id: 35,
          name: "Capacete de Ciclismo",
          brand: "Van Rysel",
          priceFinal: "39,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750420047/produtos/ge1o310ptq9bulsviirh.jpg",
        },
        {
          id: 36,
          name: "Luvas para Ciclismo",
          brand: "Bianchi",
          priceFinal: "15,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750175846/produtos/de51ynjxaxeyao6mgphl.jpg",
        },
        {
          id: 37,
          name: "Bicicleta de Estrada",
          brand: "Triban",
          priceOriginal: "699,99€",
          priceFinal: "696,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750420371/produtos/zrddg3t3mqs9skvv9qym.jpg",
        },
        {
          id: 38,
          name: "Óculos de Proteção para Ciclismo",
          brand: "Van Rysel",
          priceFinal: "24,99€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750420811/produtos/irmzc9ej7dj7ceeqykc6.jpg",
        },
        {
          id: 39,
          name: "Camisola de Ciclismo",
          brand: "Van Rysel",
          priceFinal: "29,90€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750421046/produtos/yotbexjyrfl4io4egwwe.jpg",
        },
        {
          id: 40,
          name: "Mochila de Hidratação",
          brand: "CamelBak",
          priceFinal: "54,90€",
          imageUrl:
            "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750421653/produtos/xl4iwuhsqp8e1ou2eowi.jpg",
        },
      ],
      isLeft: false,
    },
  ];

  return (
    <div className={styles.container}>
      {categories.map((category, index) => (
        <div
          key={index}
          className={`${styles.section} ${category.isLeft ? styles.left : styles.right}`}
        >
          <div
            className={styles.largeRectangle}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1)), url('${category.categoryImageUrl}')`,
            }}
          >
            <div className={styles.textContainerOverlay}>
              <h2>{category.category}</h2>
              <p>{category.description}</p>
              <Link href={`/pesquisa?q=${encodeURIComponent(category.searchTerm)}`}>
                <button className={styles.blueButton}>{category.buttonText}</button>
              </Link>
            </div>
          </div>

          <div className={styles.productsGrid}>
            {category.products.map((product) => (
              <Link key={product.id} href={`/produto/${product.id}`}>
                <div className={styles.productCard}>
                  <div
                    className={styles.productImage}
                    style={{
                      backgroundImage: `url('${product.imageUrl}')`,
                    }}
                  />
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productBrand}>{product.brand}</p>
                  <p>
                    {product.priceOriginal &&
                      product.priceOriginal !== product.priceFinal && (
                        <span className={styles.oldPrice}>{product.priceOriginal}</span>
                      )}
                    <span className={styles.productPrice}>{product.priceFinal}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RectangleBox;
