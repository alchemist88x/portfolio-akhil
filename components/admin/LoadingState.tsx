import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "LOADING DATA FROM CLOUD..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mb-3" />
      <span className="text-xs font-mono tracking-wider text-zinc-400 uppercase">{message}</span>
    </div>
  );
}
