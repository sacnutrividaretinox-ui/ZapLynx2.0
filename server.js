// server.js
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Variáveis do Railway
const { ZAPI_INSTANCE_ID, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;

// ✅ Rota para testar status
app.get("/api/status", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/status`,
      {
        headers: {
          "Client-Token": ZAPI_CLIENT_TOKEN,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      data: error.response?.data,
    });
  }
});

// ✅ Rota para enviar mensagem
app.post("/api/send", async (req, res) => {
  const { phone, message } = req.body;
  try {
    const response = await axios.post(
      `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_TOKEN}/send-messages`,
      { phone, message },
      {
        headers: {
          "Client-Token": ZAPI_CLIENT_TOKEN,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      data: error.response?.data,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server rodando na porta ${PORT}`));
