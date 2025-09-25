import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Wifi, WifiOff, Plus, Settings } from "lucide-react";
import api from "../lib/api";

type Dispositivo = {
  id: number;
  nome: string;
  numero: string;
  status: "online" | "offline";
  mensagensEnviadas: number;
  ultima_atividade: string;
};

const Dispositivos = () => {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // ⚡ pega variáveis do backend (Railway)
        const instanceId = import.meta.env.VITE_ZAPI_INSTANCE_ID;
        const token = import.meta.env.VITE_ZAPI_TOKEN;

        const { data } = await api.get(
          `/instances/${instanceId}/token/${token}/status`
        );

        const status = data.connected ? "online" : "offline";

        setDispositivos([
          {
            id: 1,
            nome: "WhatsApp Principal",
            numero: "+55 11 99999-9999",
            status,
            mensagensEnviadas: 1250,
            ultima_atividade: "Agora",
          },
        ]);
      } catch (error) {
        console.error("Erro ao buscar status do dispositivo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return <p>Carregando dispositivos...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispositivos</h1>
          <p className="text-muted-foreground">
            Gerencie seus dispositivos WhatsApp conectados
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Conectar Dispositivo
        </Button>
      </div>

      <div className="grid gap-4">
        {dispositivos.map((dispositivo) => (
          <Card key={dispositivo.id}>
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
                  <Badge
                    variant={
                      dispositivo.status === "online" ? "default" : "secondary"
                    }
                  >
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
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Mensagens Enviadas</p>
                  <p className="font-semibold">
                    {dispositivo.mensagensEnviadas.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Última Atividade</p>
                  <p className="font-semibold">{dispositivo.ultima_atividade}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dispositivos;
