import Link from "next/link";
import styles from "../styles/dropdowns.module.css";

const CarrinhoDropdown = () => {
  return (
    <div className={styles.dropdownBox}>
      <div className={styles.seta}></div>
      <div className={styles.dropdownContent}>
        <h4 className={styles.dropdownTitle}>CARRINHO</h4>
        <div className={styles.carrinhoContent}>
          <div className={styles.carrinhoIcon}></div>
          <p className={styles.carrinhoMensagem}>O carrinho está vazio!</p>
          <Link href="/carrinho" className={styles.continuarLink}>
            Continuar a comprar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarrinhoDropdown;
