import React, { useState, useContext } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { AuthContext } from "../contexts/AuthContext";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { AlertCircle, FileIcon, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface FileUploadProps {
  onUploadComplete?: (url: string, fileName: string, fileType: string) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          Please login to upload files
        </div>
      </Card>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setFileUrl("");
    }
  };

  const handleUpload = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      // Create a unique file path with timestamp
      const filePath = `${Date.now()}-${file.name}`;

      // Upload the file to T2T bucket
      const { data, error: uploadError } = await supabase.storage
        .from("T2T")
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        throw  uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("T2T")

        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setFileUrl(publicUrl);
      
      // Call the completion handler
      onUploadComplete?.(publicUrl, file.name, file.type);
      
      // Simulate progress (since Supabase doesn't provide upload progress)
      setUploadProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Upload Document</h3>
            {uploading && (
              <div className="text-sm text-muted-foreground">
                Uploading...
              </div>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <input
              type="file"
              id="document-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("document-upload")?.click()}
              disabled={uploading}
            >
              {file ? file.name : "Choose File"}
            </Button>
          </div>

          {file && !fileUrl && (
            <form onSubmit={handleUpload} className="w-full max-w-sm">
              <Button
                type="submit"
                disabled={uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </form>
          )}

          {uploading && (
            <div className="w-full max-w-sm space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fileUrl && (
            <div className="w-full max-w-sm space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  File uploaded successfully!
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-4 w-4" />
                  <p className="text-sm font-medium">{file?.name}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded border">
                  <p className="text-xs text-gray-600 break-all">File URL:</p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {fileUrl}
                  </a>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(fileUrl);
                    setError("URL copied to clipboard!");
                    setTimeout(() => setError(null), 2000);
                  }}
                >
                  Copy URL
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}