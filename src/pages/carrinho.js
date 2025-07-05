import React, { useEffect, useState } from "react";
import ProdutoCarrinho from "@/components/ProdutoCarrinho";
import axios from "axios";

export default function CarrinhoPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const id_utilizador = 1; // ✅ Troca isso mais tarde pelo ID real do utilizador logado

  useEffect(() => {
    const fetchCarrinho = async () => {
      try {
        const res = await axios.get(`/api/carrinho?id_utilizador=${id_utilizador}`);
        setProdutos(res.data);
      } catch (err) {
        console.error("Erro ao buscar carrinho:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarrinho();
  }, []);

  const total = produtos.reduce((acc, item) => acc + item.Preco * item.Quantidade, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Carrinho</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : produtos.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {produtos.map((produto) => (
              <ProdutoCarrinho key={produto.ID_carrinho} produto={produto} />
            ))}
          </div>

          <div className="bg-white p-4 shadow rounded h-fit">
            <h2 className="text-xl font-semibold mb-4">Resumo da Encomenda</h2>
            <p className="mb-2">Total: <span className="font-bold">{total.toFixed(2)} €</span></p>
            <button
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
              onClick={() => window.location.href = "/moradaenvio"}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
