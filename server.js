import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// 📌 Ajuste de __dirname (compatível com ESModules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Servir os arquivos do Vite build
app.use(express.static(path.join(__dirname, "dist")));

// 🔑 Variáveis de ambiente (Railway -> Variables)
const ZAPI_INSTANCE_ID = process.env.ZAPI_INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN;

// ============================
// ROTAS API Z-API
// ============================

// ✅ Status da instância
app.get("/api/status", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/status`,
      {
        method: "GET",
        headers: { "Client-Token": ZAPI_CLIENT_TOKEN },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar status:", err);
    res.status(500).json({ error: "Erro ao buscar status da instância" });
  }
});

// ✅ Enviar mensagem
app.post("/api/send-message", async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: "Telefone e mensagem são obrigatórios" });
  }

  try {
    const response = await fetch(
      `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Token": ZAPI_CLIENT_TOKEN,
        },
        body: JSON.stringify([
          {
            phone,
            message,
          },
        ]),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
});

// ============================
// ROTA SPA (Vite React)
// ============================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ============================
// SUBIR SERVIDOR
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
