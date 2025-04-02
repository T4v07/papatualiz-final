import styles from "@/styles/pesquisa.module.css";

export default function Filtros({ filtros, setFiltros }) {
  return (
    <div className={styles.filtros}>
      <h4>Filtrar por:</h4>

      <label>Marca:</label>
      <select
        value={filtros.marca}
        onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
      >
        <option value="">Todas</option>
        <option value="Nike">Nike</option>
        <option value="Adidas">Adidas</option>
        <option value="Puma">Puma</option>
      </select>

      <label>Cor:</label>
      <select
        value={filtros.cor}
        onChange={(e) => setFiltros({ ...filtros, cor: e.target.value })}
      >
        <option value="">Todas</option>
        <option value="Preto">Preto</option>
        <option value="Branco">Branco</option>
        <option value="Azul">Azul</option>
      </select>

      <label>Categoria:</label>
      <select
        value={filtros.categoria}
        onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
      >
        <option value="">Todas</option>
        <option value="Futebol">Futebol</option>
        <option value="Corrida">Corrida</option>
        <option value="Fitness">Fitness</option>
      </select>
    </div>
  );
}
