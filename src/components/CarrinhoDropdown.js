import Link from "next/link";
import styles from "../styles/dropdowns.module.css";

const CarrinhoDropdown = () => {
  return (
    <div className={styles.dropdownAtivo}>
      <div className={styles.dropdownBox}>
        <div className={styles.seta}></div>
        <h4 className={styles.dropdownTitle}>CARRINHO</h4>
        <div className={styles.carrinhoContent}>
          <p className={styles.carrinhoMensagem}></p>
          <Link href="/carrinho" className={styles.continuarLink}>
            Ir para o carrinho
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarrinhoDropdown;