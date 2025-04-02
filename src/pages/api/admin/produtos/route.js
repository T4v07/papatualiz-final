// src/app/api/admin/produtos/route.js
import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const form = formidable({ multiples: false });

  const data = await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const { fields, files } = data;

  // Verifica campos obrigatórios
  const required = ["nome", "modelo", "marca", "preco", "stock", "tipoCategoria"];
  for (const campo of required) {
    if (!fields[campo] || fields[campo][0].trim() === "") {
      return NextResponse.json(
        { message: "Campos obrigatórios não preenchidos." },
        { status: 400 }
      );
    }
  }

  // Lida com a imagem
  let imageName = "";
  if (files.foto && files.foto[0]) {
    const file = files.foto[0];
    imageName = `${Date.now()}-${file.originalFilename}`;
    const filePath = path.join(process.cwd(), "public/uploads", imageName);
    const data = await file.toBuffer(); // se usar formidable v3+
    await writeFile(filePath, data);
  }

  // Aqui você faz o INSERT no banco de dados (exemplo com fetch para MySQL)
  // Substitua isso com a conexão real ao seu banco
  console.log("Produto salvo com:", {
    ...Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, v[0]])),
    foto: imageName,
  });

  return NextResponse.json({ message: "Produto criado com sucesso!" }, { status: 200 });
}
