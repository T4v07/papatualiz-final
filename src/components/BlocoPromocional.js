// components/BlocoPromocional.js
import Link from "next/link";

export default function BlocoPromocional() {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-stretch my-5">
      {/* Bloco com imagem à esquerda */}
      <div
        className="text-white rounded p-4 d-flex flex-column justify-content-end"
        style={{
          width: "48%",
          height: "400px",
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.1)), url('https://res.cloudinary.com/dk56q7rsl/image/upload/v1750259184/tenis-corrida_kdgomf.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h3 className="mb-2" style={{ textShadow: "1px 1px 3px black" }}>
          Running Deals!
        </h3>
        <p style={{ textShadow: "1px 1px 2px black" }}>
          Descobre as melhores promoções em artigos de corrida.
        </p>
        <Link href="/pesquisa?q=corrida" passHref>
          <button className="btn btn-outline-light mt-2">Ver produtos</button>
        </Link>
      </div>

      {/* Lista de produtos simples à direita */}
      <div className="d-flex flex-wrap gap-3" style={{ width: "48%" }}>
        {[
          "Ténis de Corrida",
          "Meias esportivas",
          "Calção esportivo",
          "Camiseta Técnica de Corrida",
          "Cinto de Hidratação",
          "Garrafa Térmica Esportiva",
        ].map((nome, index) => (
          <Link
            key={index}
            href={`/pesquisa?q=${encodeURIComponent(nome)}`}
            passHref
            className="text-decoration-none text-dark"
          >
            <div
              className="p-3 bg-light rounded shadow-sm"
              style={{ minWidth: "180px", flex: "1" }}
            >
              {nome}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
