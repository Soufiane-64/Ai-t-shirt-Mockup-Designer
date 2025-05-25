import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "lucide-react";

interface MockupImage {
  id: string;
  originalUrl: string;
  processedUrl: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
}

interface MockupGalleryProps {
  mockups: MockupImage[];
  isProcessing: boolean;
  currentProcessingIndex: number;
  onCancelProcessing: () => void;
  onDownloadSingle: (mockupId: string) => void;
  onDownloadAll: () => void;
}

const MockupGallery = ({
  mockups = [],
  isProcessing = false,
  currentProcessingIndex = 0,
  onCancelProcessing = () => {},
  onDownloadSingle = () => {},
  onDownloadAll = () => {},
}: MockupGalleryProps) => {
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null);

  // If no mockups are available, show an empty state
  if (mockups.length === 0) {
    return (
      <div className="w-full h-[450px] bg-background border rounded-lg flex flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">🖼️</div>
        <h3 className="text-xl font-semibold mb-2">No mockups yet</h3>
        <p className="text-muted-foreground max-w-md">
          Upload your design and T-shirt mockups to see the AI-generated results
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Generated Mockups</h2>
        <Button
          onClick={onDownloadAll}
          disabled={
            !mockups.some((m) => m.status === "completed") || isProcessing
          }
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download All
        </Button>
      </div>

      {isProcessing && (
        <div className="mb-6">
          {/* Import ProcessingIndicator component where it's used */}
          <div className="bg-background border rounded-lg p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Processing mockup {currentProcessingIndex + 1} of{" "}
                  {mockups.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancelProcessing}
                >
                  Cancel
                </Button>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${mockups[currentProcessingIndex]?.progress || 0}%`,
                  }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {Math.round(mockups[currentProcessingIndex]?.progress || 0)}%
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockups.map((mockup) => (
          <Card
            key={mockup.id}
            className={`overflow-hidden ${selectedMockup === mockup.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedMockup(mockup.id)}
          >
            <CardContent className="p-0 relative">
              {/* Image container with aspect ratio */}
              <div className="relative aspect-[3/4] bg-muted">
                {/* Show original image if processed is not available */}
                <img
                  src={mockup.processedUrl || mockup.originalUrl}
                  alt="T-shirt mockup"
                  className="w-full h-full object-cover"
                />

                {/* Status overlay for pending/processing/failed states */}
                {mockup.status !== "completed" && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
                    {mockup.status === "pending" && (
                      <p>Waiting to process...</p>
                    )}
                    {mockup.status === "processing" && (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                        <p>Processing {Math.round(mockup.progress)}%</p>
                      </div>
                    )}
                    {mockup.status === "failed" && (
                      <div className="flex flex-col items-center">
                        <X size={32} className="text-red-500 mb-2" />
                        <p>Processing failed</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={mockup.status !== "completed"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadSingle(mockup.id);
                  }}
                >
                  <Download size={14} />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MockupGallery;
