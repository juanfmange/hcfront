import { useEffect, useState } from "react";
import { ServiceStatus } from "@/types/service";
import { ServiceCard } from "@/components/ServiceCard";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // localStorage.getItem("backendUrl") || "http://localhost:3000/health" //process.env.VITE_BACKEND_URL"http://localhost:3000/health"

  const [backendUrl, setBackendUrl] = useState(
    localStorage.getItem("backendUrl") || 
    import.meta.env.VITE_BACKEND_URL || 
    "http://localhost:3000/health"
  );

  const fetchHealthStatus = async () => {
    setIsRefreshing(true);
    
    try {
      const response = await fetch(backendUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Adaptar la respuesta según el formato de tu API de Go
      // Ajusta esto según la estructura real de tu respuesta
      if (data.services && Array.isArray(data.services)) {
        setServices(data.services);
      } else {
        // Fallback: intentar parsear otras estructuras comunes
        setServices(Object.entries(data).map(([name, info]: [string, any]) => ({
          name,
          url: info.url || info.endpoint || '',
          status: info.status === 'up' || info.healthy ? 'healthy' : 'unhealthy',
          responseTime: info.responseTime || info.latency,
          lastChecked: info.lastCheck || new Date().toISOString(),
          message: info.message || info.error
        })));
      }
      
      toast({
        title: "Status Updated",
        description: "Health check completed successfully",
      });
    } catch (error) {
      console.error("Error fetching health status:", error);
      
      // Mostrar datos de ejemplo si hay error
      setServices([
        {
          name: "Example Service 1",
          url: "https://api.example.com/v1",
          status: 'unknown',
          message: `Cannot connect to backend: ${error instanceof Error ? error.message : 'Unknown error'}`
        },
        {
          name: "Example Service 2",
          url: "https://api.example2.com/v1",
          status: 'unknown',
          message: "Waiting for backend connection..."
        }
      ]);
      
      toast({
        title: "Connection Error",
        description: `Could not connect to backend at ${backendUrl}. Showing example data.`,
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    
    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchHealthStatus, 30000);
    
    return () => clearInterval(interval);
  }, [backendUrl]);

  const handleBackendUrlChange = (url: string) => {
    setBackendUrl(url);
    localStorage.setItem("backendUrl", url);
    toast({
      title: "Configuration Saved",
      description: "Backend URL updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader
          onRefresh={fetchHealthStatus}
          isRefreshing={isRefreshing}
          backendUrl={backendUrl}
          onBackendUrlChange={handleBackendUrlChange}
        />

        <DashboardStats services={services} />

        {services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No services to display. Configure your backend URL to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={`${service.name}-${index}`} service={service} />
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">📝 Backend Integration Guide</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Your Go API should return JSON in one of these formats:
          </p>
          <pre className="bg-card p-4 rounded text-xs overflow-x-auto">
{`// Option 1: Array format
{
  "services": [
    {
      "name": "Service Name",
      "url": "https://api.example.com",
      "status": "healthy", // or "unhealthy"
      "responseTime": 123,
      "lastChecked": "2024-01-01T12:00:00Z",
      "message": "Optional message"
    }
  ],
  "timestamp": "2024-01-01T12:00:00Z"
}

// Option 2: Object format (will be auto-converted)
{
  "service1": {
    "url": "https://api.example.com",
    "healthy": true,
    "latency": 123
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Index;
