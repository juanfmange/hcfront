import { Card } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, Server } from "lucide-react";
import { ServiceStatus } from "@/types/service";

interface DashboardStatsProps {
    services: ServiceStatus[];
}

export const DashboardStats = ({ services }: DashboardStatsProps) => {
    const total = services.length;
    const healthy = services.filter((s) => s.status === 'healthy').length;
    const unhealthy = services.filter((s) => s.status === 'unhealthy').length;
    const avgResponseTime = services.length > 0
        ? Math.round(
            services
                .filter((s) => s.responseTime !== undefined)
                .reduce((acc, s) => acc + (s.responseTime || 0), 0) / services.length
        )
        : 0;

    const stats = [
        {
            label: "Total de Servicios",
            value: total,
            icon: Server,
            color: "text-primary",
            bgColor: "bg-primary/10"
        },
        {
            label: "Healthy",
            value: healthy,
            icon: CheckCircle,
            color: "text-success",
            bgColor: "bg-success/10"
        },
        {
            label: "Unhealthy",
            value: unhealthy,
            icon: AlertTriangle,
            color: "text-destructive",
            bgColor: "bg-destructive/10"
        },
        {
            label: "Promedio de Respuesta",
            value: `${avgResponseTime}ms`,
            icon: Activity,
            color: "text-warning",
            bgColor: "bg-warning/10"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                <Card key={stat.label} className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
