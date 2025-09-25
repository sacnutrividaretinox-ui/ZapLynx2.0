import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, WifiOff, Plus, Settings } from "lucide-react";

interface Dispositivo {
  id: number;
  nome: string;
  numero: string;
  status: string;
  mensagensEnviadas: number;
  ultima_atividade: string;
  qrcode?: string | null;
}

const Dispositivos = () => {
  const [dispositivo, setDispositivo] = useState<Dispositivo | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status");
        const data = await res.json();

        setDispositivo({
          id: 1,
          nome: "WhatsApp Principal",
          numero: "+55 11 99999-9999", // pode vir do backend também
          status: data.success ? "online" : "offline",
          mensagensEnviadas: 1250,
          ultima_atividade: "Agora",
          qrcode: data.qrcode || null
        });
      } catch (err) {
        console.error("Erro ao buscar status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // atualiza a cada 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispositivos</h1>
          <p className="text-muted-foreground">Gerencie seus dispositivos WhatsApp conectados</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Conectar Dispositivo
        </Button>
      </div>

      {dispositivo && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-lg">{dispositivo.nome}</CardTitle>
                  <CardDescription>{dispositivo.numero}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={dispositivo.status === "online" ? "default" : "secondary"}>
                  {dispositivo.status === "online" ? (
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
            </div>
          </CardHeader>
          <CardContent>
            {dispositivo.qrcode && dispositivo.status === "offline" && (
              <div className="mb-4">
                <p className="text-sm mb-2">Escaneie o QR Code para conectar:</p>
                <img
                  src={`data:image/png;base64,${dispositivo.qrcode}`}
                  alt="QR Code"
                  className="border rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Mensagens Enviadas</p>
                <p className="font-semibold">{dispositivo.mensagensEnviadas.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Última Atividade</p>
                <p className="font-semibold">{dispositivo.ultima_atividade}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dispositivos;
