import { AlertCircle, XCircle, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MapErrorProps {
  error: Error | string;
  onRetry?: () => void;
}

export const MapError = ({ error, onRetry }: MapErrorProps) => {
  const errorMessage = typeof error === "string" ? error : error.message;
  
  const getErrorType = () => {
    if (errorMessage.toLowerCase().includes("network") || 
        errorMessage.toLowerCase().includes("fetch")) {
      return {
        icon: WifiOff,
        title: "Connection Error",
        message: "Unable to connect to the server. Please check your internet connection.",
        color: "text-orange-400",
      };
    }
    
    if (errorMessage.toLowerCase().includes("mysql") ||
        errorMessage.toLowerCase().includes("database")) {
      return {
        icon: AlertCircle,
        title: "Database Error",
        message: "Unable to fetch environmental data. The database may be temporarily unavailable.",
        color: "text-yellow-400",
      };
    }
    
    return {
      icon: XCircle,
      title: "Error Loading Map",
      message: errorMessage || "An unexpected error occurred while loading the map.",
      color: "text-red-400",
    };
  };

  const errorType = getErrorType();
  const Icon = errorType.icon;

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-8 bg-gray-800/90 border-red-500/30 backdrop-blur-sm max-w-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Icon className={`w-16 h-16 ${errorType.color}`} />
            </motion.div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {errorType.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {errorType.message}
              </p>
            </div>

            {errorMessage && errorMessage !== errorType.message && (
              <details className="w-full mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs text-left text-gray-400 bg-gray-900/50 p-3 rounded overflow-auto max-h-32">
                  {errorMessage}
                </pre>
              </details>
            )}

            {onRetry && (
              <Button
                onClick={onRetry}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
