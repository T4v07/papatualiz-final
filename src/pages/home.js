import Navbar from "../components/navbar";
import Carousel from "../components/Carousel";
import RectangleBox from "../components/RectangleBox";
import FeaturedProducts from "../components/FeaturedProducts"; 
import styles from "../styles/home.module.css"; // Importe o CSS do home
import Footer from "../components/Footer";


export default function Home() {
  return (
    <div className="container">
      <Navbar />
      <div className="d-flex gap-3 my-5">
        <div className="flex-grow-1 bg-dark d-flex align-items-end p-4 rounded" style={{ height: "300px" }}>
          <button className="btn btn-light">Ver oferta</button>
        </div>
        <div className="d-flex flex-column gap-3" style={{ width: "30%" }}>
          <div className="bg-dark d-flex align-items-end p-3 rounded" style={{ height: "142.5px" }}>
            <button className="btn btn-light">Comprar já</button>
          </div>
          <div className="bg-dark d-flex align-items-end p-3 rounded" style={{ height: "142.5px" }}>
            <button className="btn btn-light">Comprar já</button>
          </div>
        </div>
      </div>
      <h2 className="text-left mb-4">Os mais procurados!</h2>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {["Casacos desportivos", "Calçado desportivo", "Calça desportiva", "Acessório desportivo", "Equipamento desportivo", "Acampamento"].map((item, index) => (
          <div key={index} className="card" style={{ width: "170px" }}>
            <div className="card-img-top bg-dark" style={{ height: "220px" }}></div>
            <div className="card-body">
              <p className="card-text text-center">{item}</p>
            </div>
          </div>
        ))}
      </div>
      <Carousel />
      <div className={styles.spacing}></div> {/* Espaçamento entre Carousel e RectangleBox */}
      <RectangleBox />
      <div className={styles.spacing}></div> {/* Espaçamento entre RectangleBox e FeaturedProducts */}
      <FeaturedProducts /> {/* Adicionado aqui! */}
      
      
      <Footer /> {/* Adicionado aqui */}
    </div>
    
  );
}
