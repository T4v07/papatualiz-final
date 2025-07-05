import React from "react";

export default function ProdutoCarrinho({ produto }) {
  return (
    <div className="bg-white shadow rounded p-4 flex gap-4 items-center">
      <img
        src={produto.Foto}
        alt={produto.Nome_Produtos}
        className="w-24 h-24 object-contain rounded"
      />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{produto.Nome_Produtos}</h3>
        <p className="text-sm text-gray-600">Marca: {produto.Marca}</p>
        <p className="text-sm">Quantidade: {produto.Quantidade}</p>
        <p className="text-sm font-bold mt-1">
          Preço: {(produto.Preco * produto.Quantidade).toFixed(2)} €
        </p>
      </div>
    </div>
  );
}
