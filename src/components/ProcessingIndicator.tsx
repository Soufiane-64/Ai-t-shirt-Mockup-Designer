import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProcessingIndicatorProps {
  currentIndex: number;
  totalCount: number;
  progress: number;
  isProcessing: boolean;
  onCancel: () => void;
}

const ProcessingIndicator = ({
  currentIndex = 1,
  totalCount = 5,
  progress = 0,
  isProcessing = false,
  onCancel = () => {},
}: ProcessingIndicatorProps) => {
  if (!isProcessing) return null;

  return (
    <div className="bg-background border rounded-lg p-4 shadow-md w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-sm">Processing Mockups</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>

      <Progress value={progress} className="h-2 mb-2" />

      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          Processing mockup {currentIndex} of {totalCount}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default ProcessingIndicator;
