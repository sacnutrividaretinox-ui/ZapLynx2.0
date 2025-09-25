import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// 📂 Pasta do build do Vite
const distPath = join(__dirname, "dist");

// Servir arquivos estáticos
app.use(express.static(distPath));

// Redirecionar todas as rotas para o index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

// Porta fornecida pelo Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
