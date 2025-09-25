import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, WifiOff, Plus } from "lucide-react";

const Dispositivos = () => {
  const [status, setStatus] = useState<"online" | "offline">("offline");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]); // logs em tempo real

  // Função para gerar QR Code manualmente (fallback)
  const fetchQrCode = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.z-api.io/instances/${
          import.meta.env.VITE_ZAPI_INSTANCE_ID
        }/token/${import.meta.env.VITE_ZAPI_TOKEN}/qr-code/image`,
        {
          headers: {
            "Client-Token": import.meta.env.VITE_ZAPI_CLIENT_TOKEN,
          },
        }
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrCode(url);
    } catch (err) {
      console.error("❌ Erro ao gerar QR Code:", err);
    } finally {
      setLoading(false);
    }
  };

  // Conectar ao WebSocket da Z-API
  useEffect(() => {
    const wsUrl = `wss://api.z-api.io/instances/${
      import.meta.env.VITE_ZAPI_INSTANCE_ID
    }/token/${import.meta.env.VITE_ZAPI_TOKEN}/websocket`;
    const socket = new WebSocket(wsUrl, [
      import.meta.env.VITE_ZAPI_CLIENT_TOKEN,
    ]);

    socket.onopen = () => {
      console.log("🔌 WebSocket conectado");
      setLogs((prev) => [
        ...prev,
        "🔌 Conectado ao WebSocket da Z-API",
      ]);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Evento recebido:", data);

        if (data.type === "CONNECTED") {
          setStatus("online");
          setQrCode(null);
          setLogs((prev) => [...prev, "✅ Dispositivo conectado"]);
        } else if (data.type === "DISCONNECTED") {
          setStatus("offline");
          setLogs((prev) => [...prev, "⚠️ Dispositivo desconectado"]);
        } else if (data.type === "QRCODE") {
          setStatus("offline");
          setQrCode(`data:image/png;base64,${data.qrCode}`);
          setLogs((prev) => [...prev, "📷 QR Code gerado, escaneie no celular"]);
        } else if (data.type === "MESSAGE") {
          setLogs((prev) => [
            ...prev,
            `📩 Mensagem recebida de ${data.phone}: ${data.message}`,
          ]);
        } else if (data.type === "SENT_MESSAGE") {
          setLogs((prev) => [
            ...prev,
            `📤 Mensagem enviada para ${data.phone}: ${data.message}`,
          ]);
        } else if (data.type === "DELETED_MESSAGE") {
          setLogs((prev) => [
            ...prev,
            `🗑️ Mensagem apagada: ${data.messageId}`,
          ]);
        }
      } catch (err) {
        console.error("Erro ao processar mensagem WS:", err);
      }
    };

    socket.onclose = () => {
      console.log("❌ WebSocket desconectado");
      setStatus("offline");
      setLogs((prev) => [...prev, "❌ WebSocket desconectado"]);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispositivos</h1>
          <p className="text-muted-foreground">
            Gerencie seus dispositivos WhatsApp conectados
          </p>
        </div>
        {status === "offline" && (
          <Button onClick={fetchQrCode} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {loading ? "Gerando QR..." : "Conectar Dispositivo"}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-lg">WhatsApp Principal</CardTitle>
                <CardDescription>
                  Instância {import.meta.env.VITE_ZAPI_INSTANCE_ID}
                </CardDescription>
              </div>
            </div>
            <Badge variant={status === "online" ? "default" : "secondary"}>
              {status === "online" ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" /> Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" /> Offline
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {status === "offline" && qrCode && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Escaneie o QR Code abaixo no WhatsApp para conectar:
              </p>
              <img
                src={qrCode}
                alt="QR Code"
                className="w-56 h-56 border rounded"
              />
            </div>
          )}
          {status === "online" && (
            <p className="text-sm text-green-600">
              ✅ Dispositivo conectado e pronto para enviar mensagens!
            </p>
          )}
        </CardContent>
      </Card>

      {/* LOG EM TEMPO REAL */}
      <Card>
        <CardHeader>
          <CardTitle>📜 Log em Tempo Real</CardTitle>
          <CardDescription>
            Eventos recebidos do WebSocket da Z-API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-3 rounded-lg h-64 overflow-y-auto text-sm space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum evento ainda...
              </p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="font-mono">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dispositivos;
