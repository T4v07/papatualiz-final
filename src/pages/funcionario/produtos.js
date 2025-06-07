// src/pages/funcionario/produtos.js
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/context/AuthContext";
import AdicionarProdutoFuncionario from "@/components/funcionario/AdicionarProdutoFuncionario";

export default function ProdutosFuncionarioPage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user.Tipo_de_Conta !== "funcionario") {
      router.push("/servicosLogin");
    }
  }, [user]);

  return user && user.Tipo_de_Conta === "funcionario" ? (
    <AdicionarProdutoFuncionario />
  ) : null;
}
