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
import { Smartphone, Wifi, WifiOff, Plus, Settings } from "lucide-react";
import { getStatus, sendMessage, getQRCode } from "@/lib/api";

const Dispositivos = () => {
  const [status, setStatus] = useState<{ connected?: boolean; error?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrcode, setQrcode] = useState<string | null>(null);

  // 🔎 Carregar status quando abrir a página
  useEffect(() => {
    setLoading(true);
    getStatus()
      .then((res) => setStatus(res))
      .catch((err) => {
        console.error(err);
        setStatus({ connected: false, error: "Erro ao buscar status" });
      })
      .finally(() => setLoading(false));
  }, []);

  // ✉️ Testar envio de mensagem
  const handleSendTest = async () => {
    try {
      const res = await sendMessage("5511999999999", "🚀 Teste pela ZapLynx");
      alert("Mensagem enviada: " + JSON.stringify(res));
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar mensagem!");
    }
  };

  // 🔑 Buscar QR Code
  const handleQRCode = async () => {
    try {
      const res = await getQRCode();
      setQrcode(res.qrcode); // backend retorna { qrcode: base64 }
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar QR Code");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispositivos</h1>
          <p className="text-muted-foreground">
            Gerencie seus dispositivos WhatsApp conectados via Z-API
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={handleSendTest}>
            <Plus className="w-4 h-4" />
            Enviar Teste
          </Button>
          <Button variant="outline" onClick={handleQRCode}>
            Conectar Dispositivo
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-lg">WhatsApp</CardTitle>
                <CardDescription>
                  {loading
                    ? "Verificando..."
                    : status?.connected
                    ? "Instância ativa ✅"
                    : "Instância offline ❌"}
                </CardDescription>
              </div>
            </div>
            <Badge variant={status?.connected ? "default" : "secondary"}>
              {status?.connected ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" /> Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" /> Offline
                </>
              )}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
       <CardContent>
  {status?.error && (
    <p className="text-red-500 text-sm">Erro: {status.error}</p>
  )}

  {status?.connected && (
    <p className="text-sm text-green-600">
      ✅ Dispositivo conectado e pronto para enviar mensagens!
    </p>
  )}

  {qrcode && (
    <div className="mt-4 flex flex-col items-center">
      <p className="text-sm mb-2">Escaneie este QR Code no WhatsApp:</p>
      <img
        src={`data:image/png;base64,${qrcode}`}
        alt="QR Code"
        className="border rounded-lg shadow-md"
      />
    </div>
  )}
</CardContent>
      </Card>
    </div>
  );
};

export default Dispositivos;
