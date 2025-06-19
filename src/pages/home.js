import Navbar from "../components/navbar";
import RectangleBox from "../components/RectangleBox";
import FeaturedProducts from "../components/FeaturedProducts";
import styles from "../styles/home.module.css";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <Navbar />

      {/* Bloco principal + laterais */}
      <div className="d-flex gap-3 my-5">
        {/* Bloco principal */}
        <div
          className="flex-grow-1 d-flex align-items-end p-4 rounded text-white"
          style={{
            height: "300px",
            backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url('https://res.cloudinary.com/dk56q7rsl/image/upload/v1750234613/verao1_ni9box.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div>
            <h2 className="mb-3" style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}>
              O Verão está à porta... <br /> Não fiques de fora!
            </h2>
            <Link href="/pesquisa?q=especial" passHref>
              <button className="btn btn-outline-light btn-sm px-3 py-1">Ver Ofertas</button>
            </Link>
          </div>
        </div>

        {/* Blocos laterais */}
        <div className="d-flex flex-column gap-3" style={{ width: "30%" }}>
          <div
            className="d-flex flex-column justify-content-between p-3 rounded text-white"
            style={{
              height: "142.5px",
              backgroundImage:
                "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url('https://res.cloudinary.com/dk56q7rsl/image/upload/v1750239263/verao2_ip2scz.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h5 className="mb-2" style={{ fontSize: "16px", textShadow: "0 1px 2px black" }}>
              Piscinas para Todos
            </h5>
            <Link href="/pesquisa?q=piscinas" passHref>
              <button className="btn btn-outline-light btn-sm px-3 py-1 align-self-start">Explorar</button>
            </Link>
          </div>

          <div
            className="d-flex flex-column justify-content-between p-3 rounded text-white"
            style={{
              height: "142.5px",
              backgroundImage:
                "linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url('https://res.cloudinary.com/dk56q7rsl/image/upload/v1750239267/verao3_daf20t.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h5 className="mb-2" style={{ fontSize: "16px", textShadow: "0 1px 2px black" }}>
              Snorkeling e Aventura
            </h5>
            <Link href="/pesquisa?q=snorkeling" passHref>
              <button className="btn btn-outline-light btn-sm px-3 py-1 align-self-start">Ver Mais</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Produtos em destaque */}
      <h2 className="text-left mb-4">Os mais procurados!</h2>
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        {[
          {
            nome: "Roupa de Verão",
            imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259179/roupa-verao_pew3jm.jpg",
            termo: "verao",
            alt: "Imagem de roupa de verão na praia"
          },
          {
            nome: "Ténis de Corrida",
            imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259184/tenis-corrida_kdgomf.jpg",
            termo: "corrida",
            alt: "Imagem de ténis de corrida"
          },
          {
            nome: "Acessórios Fitness",
            imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750262732/acessorios-fitness_ylr5hz.jpg",
            termo: "fitness",
            alt: "Imagem de acessórios de fitness"
          },
          {
            nome: "Ciclismo",
            imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259424/ciclismo_fdtluw.jpg",
            termo: "ciclismo",
            alt: "Pessoa a andar de bicicleta"
          },
          {
            nome: "Treino em Casa",
            imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750262734/treino-casa_isrvit.jpg",
            termo: "treino em casa",
            alt: "Imagem com halteres e garrafa de água"
          },
          {
            nome: "Aventura e Camping",
            imagem: "https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259175/aventura-camping_hng85i.jpg",
            termo: "campismo",
            alt: "Tenda de campismo numa paisagem de montanha"
          },
        ].map((item, index) => (
          <Link key={index} href={`/pesquisa?q=${encodeURIComponent(item.termo)}`} passHref>
            <div className="card" style={{ width: "170px", height: "300px", cursor: "pointer" }}>
              <img
                src={item.imagem}
                alt={item.alt}
                className="card-img-top"
                style={{
                  height: "220px",
                  width: "100%",
                  objectFit: "cover",
                  borderTopLeftRadius: "0.375rem",
                  borderTopRightRadius: "0.375rem",
                }}
              />
              <div className="card-body">
                <p className="card-text text-center">{item.nome}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>


      <div className={styles.spacing}></div>
      <RectangleBox />
      <div className={styles.spacing}></div>
      <FeaturedProducts />
      <Footer />
    </div>
  );
}
