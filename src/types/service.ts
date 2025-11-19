export interface ServiceStatus {
    name: string;
    url: string;
    status: 'healthy' | 'unhealthy' | 'checking' | 'unknown';
    responseTime?: number;
    lastChecked?: string;
    message?: string;
}

export interface HealthCheckResponse {
    services: ServiceStatus[];
    timestamp: string;
}
