import Link from "next/link";
import styles from "../styles/dropdowns.module.css";

const AjudaDropdown = () => {
  return (
    <div className={styles.dropdownAtivo}>
      <div className={styles.dropdownBox}>
        <div className={styles.seta}></div>
        <h4 className={styles.dropdownTitle}>AJUDA</h4>
        <div className={styles.textos}>
          <Link href="/suporte" className={styles.link}>
            Apoio ao Cliente
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AjudaDropdown;