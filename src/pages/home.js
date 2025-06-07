import Navbar from "../components/navbar";
import Carousel from "../components/Carousel";
import RectangleBox from "../components/RectangleBox";
import FeaturedProducts from "../components/FeaturedProducts"; 
import styles from "../styles/home.module.css"; // Importe o CSS do home
import Footer from "../components/Footer";
import Link from "next/link"; // certifica-te que está no topo

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
  {[
    { nome: "Casacos desportivos", imagem: "/imagens/casaco.jpg" },
    { nome: "Calçado desportivo", imagem: "/imagens/calcado.jpg" },
    { nome: "Calça desportiva", imagem: "/imagens/calca.jpg" },
    { nome: "Acessório desportivo", imagem: "/imagens/acessorio.jpg" },
    { nome: "Equipamento desportivo", imagem: "/imagens/equipamento.jpg" },
    { nome: "Acampamento", imagem: "/imagens/acampamento.jpg" },
  ].map((item, index) => (
    <Link key={index} href={`/pesquisa?termo=${encodeURIComponent(item.nome)}`} passHref>
      <div className="card" style={{ width: "170px", cursor: "pointer" }}>
        <img
          src={item.imagem}
          alt={item.nome}
          className="card-img-top"
          style={{
            height: "220px",
            objectFit: "cover",
            borderTopLeftRadius: "0.375rem",
            borderTopRightRadius: "0.375rem"
          }}
        />
        <div className="card-body">
          <p className="card-text text-center">{item.nome}</p>
        </div>
      </div>
    </Link>
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
