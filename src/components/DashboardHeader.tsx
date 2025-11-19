import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Settings } from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface DashboardHeaderProps {
    onRefresh: () => void;
    isRefreshing: boolean;
    backendUrl: string;
    onBackendUrlChange: (url: string) => void;
}

export const DashboardHeader = ({
    onRefresh,
    isRefreshing,
    backendUrl,
    onBackendUrlChange,
}: DashboardHeaderProps) => {
    const [tempUrl, setTempUrl] = useState(backendUrl);
    const [open, setOpen] = useState(false);

    const handleSave = () => {
        onBackendUrlChange(tempUrl);
        setOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-4xl font-bold mb-2">Service Health Monitor</h1>
                <p className="text-muted-foreground">
                    Monitor the status of your services in real-time
                </p>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    className="gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Configure
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Backend Configuration</DialogTitle>
                            <DialogDescription>
                                Configure the URL of your Go backend healthcheck API
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="backend-url">Backend URL</Label>
                                <Input
                                    id="backend-url"
                                    placeholder="http://localhost:8080/healthcheck"
                                    value={tempUrl}
                                    onChange={(e) => setTempUrl(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Enter the full URL of your Go backend healthcheck endpoint
                                </p>
                            </div>
                            <Button onClick={handleSave} className="w-full">
                                Save Configuration
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
