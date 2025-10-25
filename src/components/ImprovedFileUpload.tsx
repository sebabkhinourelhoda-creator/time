import React, { useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { 
  Upload, 
  File as FileIcon, 
  CheckCircle2, 
  AlertCircle, 
  X,
  FileText,
  Image,
  Music,
  Video
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";

interface FileUploadProps {
  onUploadComplete?: (url: string, fileName: string, fileType: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  isDisabled?: boolean;
  disabledMessage?: string;
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return <Image className="h-8 w-8" />;
  if (fileType.startsWith('video/')) return <Video className="h-8 w-8" />;
  if (fileType.startsWith('audio/')) return <Music className="h-8 w-8" />;
  if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-8 w-8" />;
  return <FileIcon className="h-8 w-8" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function ImprovedFileUpload({ 
  onUploadComplete,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg'],
  maxSize = 10, // 10MB default
  isDisabled = false,
  disabledMessage = "Please fill in all required fields before uploading"
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File) => {
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check file type
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.some(type => type.toLowerCase() === fileExtension)) {
      setError(`File type not supported. Accepted types: ${acceptedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((files: FileList) => {
    if (isDisabled) return;
    
    const selectedFile = files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  }, [maxSize, acceptedTypes, isDisabled]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDisabled) return;
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [isDisabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (isDisabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles, isDisabled]);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data, error: uploadError } = await supabase.storage
        .from('T2T')
        .upload(filePath, file);

      clearInterval(progressInterval);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        console.error('Bucket: T2T, FilePath:', filePath);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      const { data: urlData } = supabase.storage
        .from('T2T')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      setSuccess(true);
      
      // Call the callback with upload details
      onUploadComplete?.(urlData.publicUrl, file.name, file.type);
      
      // Reset after successful upload
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);

    } catch (error: any) {
      console.error('Upload error details:', error);
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.message?.includes('Bucket not found')) {
        errorMessage = 'Storage bucket "T2T" not found. Please check your Supabase configuration.';
      } else if (error.message?.includes('permissions')) {
        errorMessage = 'Permission denied. Please check your storage policies.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag and Drop Zone */}
      <Card className={`transition-all duration-300 ${
        isDisabled 
          ? 'border-muted border-2 opacity-50 cursor-not-allowed' 
          : dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-dashed border-2 border-muted-foreground/25'
      }`}>
        <CardContent className="p-6">
          {isDisabled ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-muted-foreground">Upload Disabled</h3>
                <p className="text-sm text-muted-foreground">
                  {disabledMessage}
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                dragActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Upload className="h-8 w-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Upload Document</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported: {acceptedTypes.join(', ')} • Max size: {maxSize}MB
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || isDisabled}
              >
                <FileIcon className="mr-2 h-4 w-4" />
                Choose File
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileChange}
                className="hidden"
                disabled={isDisabled}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Preview */}
      {file && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="text-muted-foreground">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {file.type || 'Unknown type'}
                </Badge>
              </div>
              {!uploading && !success && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {/* Success State */}
            {success && (
              <div className="mt-4 flex items-center space-x-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Upload completed successfully!</span>
              </div>
            )}

            {/* Upload Button */}
            {file && !uploading && !success && (
              <Button
                onClick={handleUpload}
                className="w-full mt-4"
                disabled={uploading || isDisabled}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}