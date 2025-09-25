import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Railway + server.js já redireciona
});

// ✅ Checar status do dispositivo
export async function getStatus() {
  const { data } = await api.get("/status");
  return data;
}

// ✅ Enviar mensagem
export async function sendMessage(phone: string, message: string) {
  const { data } = await api.post("/send", { phone, message });
  return data;
}

export default api;
