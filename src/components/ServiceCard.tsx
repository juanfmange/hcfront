import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { ServiceStatus } from "@/types/service";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
    service: ServiceStatus;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
    const getStatusIcon = () => {
        switch (service.status) {
            case 'healthy':
                return <CheckCircle2 className="h-5 w-5 text-success" />;
            case 'unhealthy':
                return <AlertCircle className="h-5 w-5 text-destructive" />;
            case 'checking':
                return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
            default:
                return <Activity className="h-5 w-5 text-muted-foreground" />;
        }
    };

    const getStatusBadge = () => {
        const variants = {
            healthy: "bg-success/10 text-success hover:bg-success/20 border-success/20",
            unhealthy: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
            checking: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20",
            unknown: "bg-muted text-muted-foreground hover:bg-muted/80"
        };

        return (
            <Badge variant="outline" className={variants[service.status]}>
                {service.status.toUpperCase()}
            </Badge>
        );
    };

    const getBorderColor = () => {
        switch (service.status) {
            case 'healthy':
                return 'border-l-success';
            case 'unhealthy':
                return 'border-l-destructive';
            case 'checking':
                return 'border-l-primary';
            default:
                return 'border-l-muted';
        }
    };

    return (
        <Card
            className={cn(
                "p-6 transition-all hover:shadow-lg border-l-4",
                getBorderColor()
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <div>
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {service.url}
                        </p>
                    </div>
                </div>
                {getStatusBadge()}
            </div>

            <div className="space-y-2">
                {service.responseTime !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Response time:</span>
                        <span className="font-medium">{service.responseTime}ms</span>
                    </div>
                )}

                {service.lastChecked && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Activity className="h-4 w-4" />
                        <span>Last checked: {new Date(service.lastChecked).toLocaleTimeString()}</span>
                    </div>
                )}

                {service.message && (
                    <div className="mt-3 p-3 rounded-md bg-muted/50">
                        <p className="text-sm text-muted-foreground">{service.message}</p>
                    </div>
                )}
            </div>
        </Card>
    );
};
