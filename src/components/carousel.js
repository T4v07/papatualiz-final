import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container my-5">
      <h2 className="text-left mb-4">Em destaque:</h2>

      <Slider {...settings}>
        {/* Slide 1 */}
        <div>
          <div className="d-flex bg-gray-200 p-4 rounded">
            <div className="w-50 p-3">
              <h3>Novidades de Corrida</h3>
              <p>Descobre as nossas novidades e dá ritmo às tuas corridas!</p>
              <button className="btn btn-outline-dark">Ver produtos</button>
            </div>
            <div
              className="w-50 bg-dark rounded"
              style={{ backgroundImage: "url('caminho/para/imagem.jpg')", backgroundSize: "cover" }}
            ></div>
          </div>
        </div>

        {/* Slide 2 */}
        <div>
          <div className="d-flex bg-gray-200 p-4 rounded">
            <div className="w-50 p-3">
              <h3>Eleva o teu treino</h3>
              <p>Descobre treinos avançados e equipamentos para maximizar o teu rendimento.</p>
              <button className="btn btn-outline-dark">Sabe mais</button>
            </div>
            <div
              className="w-50 bg-dark rounded"
              style={{ backgroundImage: "url('caminho/para/imagem.jpg')", backgroundSize: "cover" }}
            ></div>
          </div>
        </div>

        {/* Slide 3 */}
        <div>
          <div className="d-flex bg-gray-200 p-4 rounded">
            <div className="w-50 p-3">
              <h3>Explora a Natureza</h3>
              <p>Encontra o equipamento que te ajude a encarar cada desafio.</p>
              <button className="btn btn-outline-dark">Descobrir</button>
            </div>
            <div
              className="w-50 bg-dark rounded"
              style={{ backgroundImage: "url('caminho/para/imagem.jpg')", backgroundSize: "cover" }}
            ></div>
          </div>
        </div>

        {/* Slide 4 */}
        <div>
          <div className="d-flex bg-gray-200 p-4 rounded">
            <div className="w-50 p-3">
              <h3>Prepara-te para a Meia Maratona</h3>
              <p>Descobre o percurso de treinos para chegares lá em grande!</p>
              <button className="btn btn-outline-dark">Ver produtos</button>
            </div>
            <div
              className="w-50 bg-dark rounded"
              style={{ backgroundImage: "url('caminho/para/imagem.jpg')", backgroundSize: "cover" }}
            ></div>
          </div>
        </div>
      </Slider>
    </div>
  );
}