import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "DATABASE CONNECTION ERROR",
  message = "Failed to communicate with the MongoDB infrastructure. Ensure the database service is running.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-6 rounded-lg bg-red-950/20 border border-red-900/40 text-red-400">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-red-300">
            {title}
          </h4>
          <p className="text-xs font-mono text-red-400/90 mt-1 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 transition-colors"
            >
              <RefreshCw size={12} />
              RETRY CONNECTION
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
