// hash.js
const bcrypt = require('bcryptjs');

const senha = 'admin123'; // ou 'func123' para funcionário

bcrypt.hash(senha, 10, (err, hash) => {
  if (err) throw err;
  console.log("HASH:", hash);
});
