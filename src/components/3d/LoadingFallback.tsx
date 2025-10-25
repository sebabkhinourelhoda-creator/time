import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingFallbackProps {
  error?: boolean;
  loading?: boolean;
}

export function LoadingFallback({ error = false, loading = true }: LoadingFallbackProps) {
  if (error) {
    return (
      <Card className="bg-card h-[600px] flex items-center justify-center shadow-xl">
        <CardContent className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">Failed to Load 3D Models</h3>
          <p className="text-muted-foreground">
            There was an error loading the 3D organ models. Please check your internet connection and try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-card h-[600px] flex items-center justify-center shadow-xl">
        <CardContent className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">Loading 3D Organ Models</h3>
          <p className="text-muted-foreground">
            Please wait while we load the interactive 3D models...
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}