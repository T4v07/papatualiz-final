import Link from "next/link";
import styles from "../styles/dropdowns.module.css";

const FavoritosDropdown = () => {
  return (
    <div className={styles.dropdownBox}>
      <div className={styles.seta}></div>
      <div className={styles.dropdownContent}>
        <h4 className={styles.dropdownTitle}>FAVORITOS</h4>
        <p className={styles.infoText}>Ver os teus produtos favoritos.</p>
        <Link href="/favoritos" className={styles.verLink}>
          Ver favoritos 
        </Link>
      </div>
    </div>
  );
};

export default FavoritosDropdown;
