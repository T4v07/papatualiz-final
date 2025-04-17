// corrigirAuthContext.js
const fs = require("fs");
const path = require("path");

const pastaSrc = path.join(__dirname, "src");
const extensaoValida = [".js", ".jsx"];

function percorrerDiretorios(diretorio) {
  const arquivos = fs.readdirSync(diretorio);

  arquivos.forEach((arquivo) => {
    const caminhoCompleto = path.join(diretorio, arquivo);
    const stats = fs.statSync(caminhoCompleto);

    if (stats.isDirectory()) {
      percorrerDiretorios(caminhoCompleto);
    } else if (extensaoValida.includes(path.extname(caminhoCompleto))) {
      corrigirArquivo(caminhoCompleto);
    }
  });
}

function corrigirArquivo(caminho) {
  let conteudo = fs.readFileSync(caminho, "utf8");
  const original = /useContext\s*\(\s*AuthContext\s*\)/g;

  if (original.test(conteudo)) {
    console.log("Corrigindo:", caminho);

    // Garante importação correta
    if (!conteudo.includes('import AuthContext from "@/context/AuthContext"')) {
      conteudo = conteudo.replace(
        /import\s+{([^}]+)}\s+from\s+["']react["'];?/,
        (match, p1) => `import {${p1.trim()} } from "react";\nimport AuthContext from "@/context/AuthContext";`
      );
    }

    // Nada precisa ser mudado no uso do hook se já for useContext(AuthContext)
    fs.writeFileSync(caminho, conteudo, "utf8");
  }
}

// Iniciar correção
percorrerDiretorios(pastaSrc);
console.log("✅ Correção concluída.");
