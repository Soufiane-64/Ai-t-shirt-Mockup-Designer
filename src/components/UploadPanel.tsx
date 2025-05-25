import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, FileWarning } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";

interface UploadPanelProps {
  title: string;
  description: string;
  allowMultiple?: boolean;
  acceptedFileTypes?: string | Record<string, string[]>;
  maxFileSize?: number; // in MB
  onFilesSelected: (files: File[]) => void;
  className?: string;
  multiple?: boolean;
  maxFiles?: number;
}

const UploadPanel = ({
  title = "Upload Files",
  description = "Drag and drop files here or click to browse",
  allowMultiple = false,
  acceptedFileTypes = "image/*",
  maxFileSize = 10, // Default 10MB
  onFilesSelected,
  className = "",
}: UploadPanelProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      setError(null);
      const newFiles: File[] = [];
      const newPreviews: string[] = [];

      // Convert FileList to array for easier processing
      const filesArray = Array.from(selectedFiles);

      // Validate files
      for (const file of filesArray) {
        // Check file type
        const isValidType =
          typeof acceptedFileTypes === "string"
            ? file.type.match(acceptedFileTypes.replace("*", ".*"))
            : Object.keys(acceptedFileTypes as Record<string, string[]>).some(
                (type) => file.type === type,
              );

        if (!isValidType) {
          setError(`File type not supported: ${file.name}`);
          continue;
        }

        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
          setError(`File too large: ${file.name} (max ${maxFileSize}MB)`);
          continue;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push(previewUrl);
        newFiles.push(file);
      }

      // If not allowing multiple files, replace existing files
      if (!allowMultiple) {
        // Revoke old preview URLs to prevent memory leaks
        previews.forEach((url) => URL.revokeObjectURL(url));
        setFiles(newFiles.slice(0, 1));
        setPreviews(newPreviews.slice(0, 1));
      } else {
        setFiles((prev) => [...prev, ...newFiles]);
        setPreviews((prev) => [...prev, ...newPreviews]);
      }

      // Notify parent component
      if (newFiles.length > 0) {
        onFilesSelected(allowMultiple ? [...files, ...newFiles] : newFiles);
      }
    },
    [
      files,
      previews,
      allowMultiple,
      acceptedFileTypes,
      maxFileSize,
      onFilesSelected,
    ],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFileChange(droppedFiles);
    },
    [handleFileChange],
  );

  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleRemoveFile = useCallback(
    (index: number) => {
      // Create new arrays without the removed file
      const newFiles = [...files];
      const newPreviews = [...previews];

      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(previews[index]);

      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);

      setFiles(newFiles);
      setPreviews(newPreviews);

      // Notify parent component
      onFilesSelected(newFiles);
    },
    [files, previews, onFilesSelected],
  );

  return (
    <Card className={`bg-background ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Hidden file input */}
          <Input
            ref={fileInputRef}
            type="file"
            accept={
              typeof acceptedFileTypes === "string"
                ? acceptedFileTypes
                : Object.keys(acceptedFileTypes).join(",")
            }
            multiple={allowMultiple}
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files)}
          />

          {/* Drag and drop area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">
                Drag and drop {allowMultiple ? "files" : "a file"} here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Accepted formats:{" "}
                {typeof acceptedFileTypes === "string"
                  ? acceptedFileTypes
                      .replace("image/", "")
                      .replace("*", "All image formats")
                  : Object.keys(acceptedFileTypes as Record<string, string[]>)
                      .map((type) => type.replace("image/", ""))
                      .join(", ")}
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: {maxFileSize}MB
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mt-2">
              <FileWarning className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Preview area */}
          {previews.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm font-medium">
                Selected {allowMultiple ? "Files" : "File"}
              </Label>
              <div
                className={`grid gap-4 mt-2 ${allowMultiple ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}
              >
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-md overflow-hidden border bg-muted">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <p className="text-xs text-center mt-1 truncate">
                      {files[index]?.name}
                    </p>
                  </div>
                ))}

                {/* Add more button for multiple uploads */}
                {allowMultiple && (
                  <div
                    className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={handleBrowseClick}
                  >
                    <div className="flex flex-col items-center justify-center p-4">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-center text-muted-foreground">
                        Add more
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadPanel;
