import bcrypt from "bcryptjs";

// Hash da senha que está no banco de dados (pegue o valor exato do MySQL)
const hashArmazenado = "$2b$10$YYUzYngDM25oO9t4/UfZ4eAfojYDiNxRNYyfbhhOFptoKCv8kScea";

// Senha que você está enviando no Postman (coloque a real)
const senhaDigitada = "suaSenhaAqui";

bcrypt.compare(senhaDigitada, hashArmazenado, (err, result) => {
  if (err) {
    console.error("Erro ao comparar senha:", err);
  } else {
    console.log("Senha correta?", result);
  }
});
