// ✅ FavoritosDropdown.js
import Link from "next/link";
import styles from "../styles/dropdowns.module.css";

const FavoritosDropdown = () => {
  return (
    <div className={styles.dropdownAtivo}>
      <div className={styles.dropdownBox}>
        <div className={styles.seta}></div>
        <h4 className={styles.dropdownTitle}>FAVORITOS</h4>
        <Link href="/favoritos" className={styles.verLink}>
          Ver favoritos
        </Link>
      </div>
    </div>
  );
};

export default FavoritosDropdown;