import Link from "next/link";
import styles from "../styles/dropdowns.module.css";

const AjudaDropdown = () => {
  return (
    <div className={styles.dropdownBox}>
      <div className={styles.seta}></div>
      <div className={styles.dropdownContent}>
        <h4 className={styles.dropdownTitle}>AJUDA?</h4>

        <div className={styles.dropdownItem}>
          <span className={styles.icon}></span>
          <div className={styles.textos}>
            <span>Contacte o</span>
            <Link href="/suporte" className={styles.link}>Apoio ao Cliente</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjudaDropdown;
