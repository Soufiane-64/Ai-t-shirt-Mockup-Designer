import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Download, Upload } from "lucide-react";
import UploadPanel from "./UploadPanel";
import MockupGallery from "./MockupGallery";
import ProcessingIndicator from "./ProcessingIndicator";

import MockupImage from "./MockupGallery";

// Define the type for a mockup image
type MockupImageType = {
  id: string;
  url: string;
};

const Home = () => {
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [mockupFiles, setMockupFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedMockups, setGeneratedMockups] = useState<MockupImageType[]>([]);

  const handleDesignUpload = (files: File[]) => {
    if (files.length > 0) {
      setDesignFile(files[0]);
    }
  };

  const handleMockupUpload = (files: File[]) => {
    setMockupFiles(files);
  };

  const handleProcessMockups = () => {
    // Simulate processing
    setIsProcessing(true);
    setProgress(0);
    setGeneratedMockups([]);

    // Mock processing with timeout
    let currentMockup = 0;
    const mockupCount = mockupFiles.length;

    const mockupInterval = setInterval(() => {
      currentMockup += 1;
      const newProgress = Math.round((currentMockup / mockupCount) * 100);
      setProgress(newProgress);
      // Add a generated mockup placeholder
      setGeneratedMockups((prev) => [
        ...prev,
        {
          id: `mockup-${currentMockup}`,
          url: `https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80`,
        },
      ]);

      if (currentMockup >= mockupCount) {
        clearInterval(mockupInterval);
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handleCancelProcessing = () => {
    setIsProcessing(false);
  };

  const handleDownloadAll = () => {
    // In a real implementation, this would create and download a ZIP file
    console.log("Downloading all mockups as ZIP");
  };

  const canProcess = designFile && mockupFiles.length > 0 && !isProcessing;

  return (
    <div className="container mx-auto py-8 bg-background">
      <h1 className="text-3xl font-bold mb-6 text-center">
        T-Shirt Mockup Designer
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Upload your design and T-shirt mockups to create realistic product
        images
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2 h-5 w-5" /> Design Upload
            </h2>
            <UploadPanel
              title="Upload Your Design"
              description="Upload a PNG, JPG, or SVG file of your design"
              acceptedFileTypes={{
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/svg+xml": [".svg"],
              }}
              multiple={false}
              onFilesSelected={handleDesignUpload}
              maxFiles={1}
            />
            {designFile && (
              <div className="mt-4">
                <p className="text-sm font-medium">Selected Design:</p>
                <p className="text-sm text-muted-foreground">
                  {designFile.name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2 h-5 w-5" /> Mockup Upload
            </h2>
            <UploadPanel
              title="Upload Your T-Shirt Mockups"
              description="Upload PNG or JPG files of plain T-shirts"
              acceptedFileTypes={{
                "image/png": [".png"],
                "image/jpeg": [".jpg", ".jpeg"],
              }}
              multiple={true}
              onFilesSelected={handleMockupUpload}
            />
            {mockupFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">
                  {mockupFiles.length} mockup(s) selected
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mb-8">
        <Button size="lg" onClick={handleProcessMockups} disabled={!canProcess}>
          Generate Mockups
        </Button>
      </div>

      {isProcessing && (
        <div className="mb-8">
          <ProcessingIndicator
            progress={progress}
            onCancel={handleCancelProcessing}
            currentIndex={progress === 0 ? 0 : Math.ceil((progress / 100) * mockupFiles.length)}
            totalCount={mockupFiles.length}
            isProcessing={isProcessing}
          />
        </div>
      )}

      <Separator className="my-8" />

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Generated Mockups</h2>
          {generatedMockups.length > 0 && (
            <Button onClick={handleDownloadAll} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download All
            </Button>
          )}
        </div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery">
            <MockupGallery
              mockups={generatedMockups}
              isProcessing={isProcessing}
              currentProcessingIndex={progress === 0 ? 0 : Math.ceil((progress / 100) * mockupFiles.length)}
              onCancelProcessing={handleCancelProcessing}
              onDownloadSingle={(mockupId: string) => {
                // Implement download logic for a single mockup
                const mockup = generatedMockups.find(m => m.id === mockupId);
                if (mockup) {
                  const link = document.createElement("a");
                  link.href = mockup.url;
                  link.download = `mockup-${mockup.id}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {generatedMockups.length === 0 && !isProcessing && (
        <div className="text-center py-12 text-muted-foreground">
          <p>
            No mockups generated yet. Upload your design and mockups to get
            started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
